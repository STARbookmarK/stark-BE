import _sequelize from "sequelize";
const DataTypes = _sequelize.DataTypes;
import _bookmark from  "./bookmark.js";
import _category from  "./category.js";
import _hashtag from  "./hashtag.js";
import _hashtag_bookmark from  "./hashtag_bookmark.js";
import _user from  "./user.js";

export default function initModels(sequelize) {
  const bookmark = _bookmark.init(sequelize, DataTypes);
  const category = _category.init(sequelize, DataTypes);
  const hashtag = _hashtag.init(sequelize, DataTypes);
  const hashtag_bookmark = _hashtag_bookmark.init(sequelize, DataTypes);
  const user = _user.init(sequelize, DataTypes);

  category.belongsToMany(user, { as: 'user_user_id_users', through: hashtag, foreignKey: "category_category_id", otherKey: "user_user_id" });
  user.belongsToMany(category, { as: 'category_category_id_categories', through: hashtag, foreignKey: "user_user_id", otherKey: "category_category_id" });
  hashtag_bookmark.belongsTo(bookmark, { as: "bookmark_bookmark", foreignKey: "bookmark_bookmark_id"});
  bookmark.hasMany(hashtag_bookmark, { as: "hashtag_bookmarks", foreignKey: "bookmark_bookmark_id"});
  hashtag.belongsTo(category, { as: "category_category", foreignKey: "category_category_id"});
  category.hasMany(hashtag, { as: "hashtags", foreignKey: "category_category_id"});
  hashtag_bookmark.belongsTo(hashtag, { as: "hashtag_hashtag", foreignKey: "hashtag_hashtag_id"});
  hashtag.hasMany(hashtag_bookmark, { as: "hashtag_bookmarks", foreignKey: "hashtag_hashtag_id"});
  bookmark.belongsTo(user, { as: "user_user", foreignKey: "user_user_id"});
  user.hasMany(bookmark, { as: "bookmarks", foreignKey: "user_user_id"});
  category.belongsTo(user, { as: "user_user", foreignKey: "user_user_id"});
  user.hasMany(category, { as: "categories", foreignKey: "user_user_id"});
  hashtag.belongsTo(user, { as: "user_user", foreignKey: "user_user_id"});
  user.hasMany(hashtag, { as: "hashtags", foreignKey: "user_user_id"});
  hashtag_bookmark.belongsTo(user, { as: "user_user", foreignKey: "user_user_id"});
  user.hasMany(hashtag_bookmark, { as: "hashtag_bookmarks", foreignKey: "user_user_id"});

  return {
    bookmark,
    category,
    hashtag,
    hashtag_bookmark,
    user,
  };
}
