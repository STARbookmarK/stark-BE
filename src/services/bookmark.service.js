import config from '../config/config.js';
import models from '../models/index.js';
import Sequelize from 'sequelize';
import rp from 'request-promise';
import * as cheerio from 'cheerio';

const env = config.env === 'production' ? config.env : 'development';
const mysql = config.mysql[env];
const sequelize = new Sequelize(mysql.database, mysql.username, mysql.password, mysql);

const Bookmark = models.bookmark;

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
  return result;
}

const addBookmark = async (id, reqBody) => {
  const {title, address, description, rate, shared, hashtags} = reqBody;
  // 북마크 썸네일 크롤링
  let image = '';
  const body = await rp(address);
  const $ = cheerio.load(body);
  const arr = [];
  $('img').map((i, el) => arr.push(el.attribs.src));
  image = arr.filter(el => el !== undefined)[0];
  image = image.length > 200 ? '' : image;
  // 중복된 주소가 존재할 경우 북마크 추가 불가
  const tmp = await Bookmark.findOne({
    where: { user_user_id: id, address: address }
  });
  if(tmp && Object.values(tmp.dataValues).length) return false;
  // 북마크 추가
  Bookmark.create({
    title: title,
    address: address,
    image: image,
    description: description,
    rate: rate,
    shared: shared,
    user_user_id: id
  });
  // 해시태그가 존재할 경우
  if(hashtags){
    hashtags.forEach(hashtag => {
      // 해시태그 추가
      sequelize.query(`
        INSERT INTO hashtag
          (title,
          star,
          category_category_id,
          user_user_id)
        SELECT
          '${hashtag}',
          '1',
          (SELECT
            category_id
          FROM
            category
          WHERE
            title = 'default' AND
            user_user_id = '${id}'),
          '${id}'
        WHERE NOT EXISTS
          (SELECT
            *
          FROM
            hashtag
          WHERE
            user_user_id = '${id}' AND
            title = '${hashtag}');
      `, {
        type: Sequelize.QueryTypes.INSERT
      });
      // 해시태그_북마크 테이블 관계 추가
      sequelize.query(`
        INSERT INTO hashtag_bookmark
        VALUES  ((SELECT bookmark_id
                  FROM   bookmark
                  WHERE  address = '${address}'),
                (SELECT hashtag_id
                  FROM   hashtag
                  WHERE  title = '${hashtag}'),
                '${id}');
      `, {
        type: Sequelize.QueryTypes.INSERT
      })
    });
  }
  return true;
}

export default {
  getAllBookmark,
  addBookmark
};