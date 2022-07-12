import config from '../config/config.js';
import Sequelize from 'sequelize';

const env = config.env === 'production' ? config.env : 'development';
const mysql = config.mysql[env];
const sequelize = new Sequelize(mysql.database, mysql.username, mysql.password, mysql);

const getAllBookmark = async (id) => {
  const result = await sequelize.query(`
    SELECT Any_value(A.bookmark_id)                                  AS id,
          Any_value(A.title)                                        AS title,
          Any_value(A.address)                                      AS address,
          Any_value(A.image)                                        AS image,
          Any_value(A.description)                                  AS description,
          Any_value(A.rate)                                         AS rate,
          Group_concat(B.title ORDER BY B.title DESC SEPARATOR '|') AS hashtags
    FROM   bookmark AS A,
          hashtag AS B,
          hashtag_bookmark AS C
    WHERE  A.bookmark_id = C.bookmark_bookmark_id
          AND B.hashtag_id = C.hashtag_hashtag_id
          AND A.user_user_id = '${id}'
    GROUP  BY A.title
    UNION
    SELECT A.bookmark_id AS id,
          A.title       AS title,
          A.address     AS address,
          A.image       AS image,
          A.description AS description,
          A.rate        AS rate,
          ''            AS hashtags
    FROM   bookmark AS A
    WHERE  (SELECT Count(*)
            FROM   hashtag_bookmark AS C
            WHERE  C.bookmark_bookmark_id = A.bookmark_id) = 0
          AND A.user_user_id = '${id}';
  `, {
    type: Sequelize.QueryTypes.SELECT
  });
  console.log(result);
  return result;
}

export default {
  getAllBookmark
};