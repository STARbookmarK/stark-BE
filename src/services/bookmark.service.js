import config from '../config/config.js';
import Sequelize from 'sequelize';

const env = config.env === 'production' ? config.env : 'development';
const mysql = config.mysql[env];
const sequelize = new Sequelize(mysql.database, mysql.username, mysql.password, mysql);

const getAllBookmark = async (id) => {
  const result = await sequelize.query(`
    SELECT
      ANY_VALUE(A.bookmark_id) AS id,
      ANY_VALUE(A.title) AS title,
      ANY_VALUE(A.address) AS address,
      ANY_VALUE(A.image) AS image,
      ANY_VALUE(A.description) AS description,
      ANY_VALUE(A.rate) AS rate,
      GROUP_CONCAT(B.title ORDER BY B.title DESC SEPARATOR '|') AS hashtags
    FROM
      Bookmark AS A,
      Hashtag AS B,
      Hashtag_Bookmark AS C 
    WHERE
      A.bookmark_id = C.Bookmark_bookmark_id AND
      B.hashtag_id = C.Hashtag_hashtag_id AND
      A.User_user_id = '${id}'
    GROUP BY
      A.title

    UNION

    SELECT
      A.bookmark_id AS id,
      A.title AS title,
      A.address AS address,
      A.image AS image,
      A.description AS description,
      A.rate AS rate,
      '' AS hashtags
    FROM
      Bookmark AS A
    WHERE 
      (
        SELECT
            COUNT(*)
        FROM
            Hashtag_Bookmark AS C
        WHERE
            C.Bookmark_bookmark_id = A.bookmark_id
      ) = 0 AND
      A.User_user_id = '${id}'
    ;
  `, {
    type: Sequelize.QueryTypes.SELECT
  });
  return result;
}

export default {
  getAllBookmark
};