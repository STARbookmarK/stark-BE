import _sequelize from "sequelize";
const DataTypes = _sequelize.DataTypes;
import _bookmark from  "./bookmark.js";
import _category from  "./category.js";
import _hashtag from  "./hashtag.js";
import _hashtag_bookmark from  "./hashtag_bookmark.js";
import _hashtag_state from  "./hashtag_state.js";
import _state from  "./state.js";
import _user from  "./user.js";

export default function initModels(sequelize) {
  const bookmark = _bookmark.init(sequelize, DataTypes);
  const category = _category.init(sequelize, DataTypes);
  const hashtag = _hashtag.init(sequelize, DataTypes);
  const hashtag_bookmark = _hashtag_bookmark.init(sequelize, DataTypes);
  const hashtag_state = _hashtag_state.init(sequelize, DataTypes);
  const state = _state.init(sequelize, DataTypes);
  const user = _user.init(sequelize, DataTypes);

  category.belongsToMany(user, { as: 'User_user_id_users', through: hashtag, foreignKey: "Category_category_id", otherKey: "User_user_id" });
  user.belongsToMany(category, { as: 'Category_category_id_categories', through: hashtag, foreignKey: "User_user_id", otherKey: "Category_category_id" });
  hashtag_bookmark.belongsTo(bookmark, { as: "Bookmark_bookmark", foreignKey: "Bookmark_bookmark_id"});
  bookmark.hasMany(hashtag_bookmark, { as: "hashtag_bookmarks", foreignKey: "Bookmark_bookmark_id"});
  hashtag.belongsTo(category, { as: "Category_category", foreignKey: "Category_category_id"});
  category.hasMany(hashtag, { as: "hashtags", foreignKey: "Category_category_id"});
  hashtag_bookmark.belongsTo(hashtag, { as: "Hashtag_hashtag", foreignKey: "Hashtag_hashtag_id"});
  hashtag.hasMany(hashtag_bookmark, { as: "hashtag_bookmarks", foreignKey: "Hashtag_hashtag_id"});
  hashtag_state.belongsTo(hashtag, { as: "Hashtag_hashtag", foreignKey: "Hashtag_hashtag_id"});
  hashtag.hasMany(hashtag_state, { as: "hashtag_states", foreignKey: "Hashtag_hashtag_id"});
  hashtag_state.belongsTo(state, { as: "State_state", foreignKey: "State_state_id"});
  state.hasMany(hashtag_state, { as: "hashtag_states", foreignKey: "State_state_id"});
  bookmark.belongsTo(user, { as: "User_user", foreignKey: "User_user_id"});
  user.hasMany(bookmark, { as: "bookmarks", foreignKey: "User_user_id"});
  category.belongsTo(user, { as: "User_user", foreignKey: "User_user_id"});
  user.hasMany(category, { as: "categories", foreignKey: "User_user_id"});
  hashtag.belongsTo(user, { as: "User_user", foreignKey: "User_user_id"});
  user.hasMany(hashtag, { as: "hashtags", foreignKey: "User_user_id"});
  hashtag_bookmark.belongsTo(user, { as: "User_user", foreignKey: "User_user_id"});
  user.hasMany(hashtag_bookmark, { as: "hashtag_bookmarks", foreignKey: "User_user_id"});
  hashtag_state.belongsTo(user, { as: "User_user", foreignKey: "User_user_id"});
  user.hasMany(hashtag_state, { as: "hashtag_states", foreignKey: "User_user_id"});
  state.belongsTo(user, { as: "User_user", foreignKey: "User_user_id"});
  user.hasMany(state, { as: "states", foreignKey: "User_user_id"});

  return {
    bookmark,
    category,
    hashtag,
    hashtag_bookmark,
    hashtag_state,
    state,
    user,
  };
}
