import config from '../config/config.js';
import models from '../models/index.js';
import Sequelize from 'sequelize';
import rp from 'request-promise';
import * as cheerio from 'cheerio';

const env = config.env === 'production' ? config.env : 'development';
const mysql = config.mysql[env];
const sequelize = new Sequelize(mysql.database, mysql.username, mysql.password, mysql);

const Bookmark = models.bookmark;
const Hashtag_bookmark = models.hashtag_bookmark;

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
  let {title, address, description, rate, shared, hashtags} = reqBody;
  hashtags = hashtags.filter(el => el !== '');
  hashtags = Array.from(new Set(hashtags));
  // ????????? ????????? ?????????
  let image = '';
  const body = await rp(address);
  const $ = cheerio.load(body);
  const arr = [];
  $('img').map((i, el) => arr.push(el.attribs.src));
  image = arr.filter(el => el !== undefined)[0];
  image = (image && image.length) > 200 ? '' : image;
  // ????????? ????????? ????????? ?????? ????????? ?????? ??????
  const tmp = await Bookmark.findOne({
    where: { user_user_id: id, address: address }
  });
  if(tmp && Object.values(tmp.dataValues).length) return false;
  // ????????? ??????
  Bookmark.create({
    title: title,
    address: address,
    image: image,
    description: description,
    rate: rate,
    shared: shared,
    user_user_id: id
  });
  // ??????????????? ????????? ??????
  if(hashtags){
    hashtags.forEach(hashtag => {
      // ???????????? ??????
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
      // ????????????_????????? ????????? ?????? ??????
      sequelize.query(`
        INSERT INTO hashtag_bookmark
        VALUES  ((SELECT bookmark_id
                  FROM   bookmark
                  WHERE
                    address = '${address}' AND
                    user_user_id = '${id}'),
                (SELECT hashtag_id
                  FROM   hashtag
                  WHERE
                    title = '${hashtag}' AND
                    user_user_id = '${id}'),
                '${id}');
      `, {
        type: Sequelize.QueryTypes.INSERT
      })
    });
  }
  return true;
}

const editBookmark = async (user_id, reqBody) => {
  let {id, title, address, description, rate, shared, hashtags} = reqBody;
  hashtags = hashtags.filter(el => el !== '');
  hashtags = Array.from(new Set(hashtags));
  Bookmark.update({
    title: title,
    description: description,
    rate: rate,
    shared: shared
  }, {
    where: {
      address: address,
      user_user_id: user_id
    }
  });
  // ???????????? ????????????
  // 1. ???????????? ????????????_????????? ?????? ?????? ??????
  sequelize.query(`
    DELETE
    FROM   hashtag_bookmark
    WHERE  bookmark_bookmark_id =
      (SELECT bookmark_id
      FROM   bookmark
      WHERE  address = '${address}'
      AND    user_user_id = '${user_id}');
  `, {
    type: Sequelize.QueryTypes.DELETE
  });
  // 2. ????????????, ????????????_????????? ?????? ??????
  if(hashtags){
    hashtags.forEach(hashtag => {
      // ???????????? ??????
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
            user_user_id = '${user_id}'),
          '${user_id}'
        WHERE NOT EXISTS
          (SELECT
            *
          FROM
            hashtag
          WHERE
            user_user_id = '${user_id}' AND
            title = '${hashtag}');
      `, {
        type: Sequelize.QueryTypes.INSERT
      });
      // ????????????_????????? ????????? ?????? ??????
      sequelize.query(`
        INSERT INTO hashtag_bookmark
        VALUES  ('${id}',
                (SELECT hashtag_id
                  FROM   hashtag
                  WHERE
                    title = '${hashtag}' AND
                    user_user_id = '${user_id}'),
                '${user_id}');
      `, {
        type: Sequelize.QueryTypes.INSERT
      })
    });
  }
  // 3. ???????????? ?????? ???????????? ??????
  await removeUnusedHashtag(user_id);
}

const deleteBookmark = async (user_id, bookmark_id) => {
  // 1. ??????????????? ???????????? ????????? ???????????? ?????? ?????? ??????
  Hashtag_bookmark.destroy({
    where: {
      bookmark_bookmark_id: bookmark_id
    }
  });
  // 2. ????????? ??????
  Bookmark.destroy({
    where: {
      bookmark_id: bookmark_id
    }
  });
  // 3. ???????????? ?????? ???????????? ??????
  await removeUnusedHashtag(user_id);
}

const removeUnusedHashtag = async (user_id) => {
  sequelize.query(`
    DELETE
    FROM hashtag AS A
    WHERE
      A.user_user_id = '${user_id}' AND
      NOT EXISTS
        (SELECT *
        FROM   hashtag_bookmark AS B
        WHERE  B.hashtag_hashtag_id = A.hashtag_id);
  `, {
    type: Sequelize.QueryTypes.DELETE
  })
}

const getAllHashtag = async (user_id) => {
  const result = await sequelize.query(`
    SELECT
      Any_value(A.title) AS title,
      Any_value(A.star) AS star,
      Any_value(
        (SELECT title
        FROM category AS C
        WHERE C.category_id = A.category_category_id)
      ) AS category
    FROM
      hashtag AS A
    WHERE
      A.user_user_id = '${user_id}';
  `, {
    type: Sequelize.QueryTypes.SELECT
  });
  return result; 
}

export default {
  getAllBookmark,
  addBookmark,
  editBookmark,
  deleteBookmark,
  getAllHashtag
};