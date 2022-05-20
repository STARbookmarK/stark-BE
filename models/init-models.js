import _sequelize from "sequelize";
const DataTypes = _sequelize.DataTypes;
import _Bookmark from  "./Bookmark.js";
import _Category from  "./Category.js";
import _Category_State from  "./Category_State.js";
import _Hashtag from  "./Hashtag.js";
import _Hashtag_Bookmark from  "./Hashtag_Bookmark.js";
import _State from  "./State.js";
import _User from  "./User.js";

export default function initModels(sequelize) {
  const Bookmark = _Bookmark.init(sequelize, DataTypes);
  const Category = _Category.init(sequelize, DataTypes);
  const Category_State = _Category_State.init(sequelize, DataTypes);
  const Hashtag = _Hashtag.init(sequelize, DataTypes);
  const Hashtag_Bookmark = _Hashtag_Bookmark.init(sequelize, DataTypes);
  const State = _State.init(sequelize, DataTypes);
  const User = _User.init(sequelize, DataTypes);

  Category.belongsToMany(User, { as: 'User_user_id_Users', through: Hashtag, foreignKey: "Category_category_id", otherKey: "User_user_id" });
  User.belongsToMany(Category, { as: 'Category_category_id_Categories', through: Hashtag, foreignKey: "User_user_id", otherKey: "Category_category_id" });
  Hashtag_Bookmark.belongsTo(Bookmark, { as: "Bookmark_bookmark", foreignKey: "Bookmark_bookmark_id"});
  Bookmark.hasMany(Hashtag_Bookmark, { as: "Hashtag_Bookmarks", foreignKey: "Bookmark_bookmark_id"});
  Category_State.belongsTo(Category, { as: "Category_category", foreignKey: "Category_category_id"});
  Category.hasMany(Category_State, { as: "Category_States", foreignKey: "Category_category_id"});
  Hashtag.belongsTo(Category, { as: "Category_category", foreignKey: "Category_category_id"});
  Category.hasMany(Hashtag, { as: "Hashtags", foreignKey: "Category_category_id"});
  Hashtag_Bookmark.belongsTo(Hashtag, { as: "Hashtag_hashtag", foreignKey: "Hashtag_hashtag_id"});
  Hashtag.hasMany(Hashtag_Bookmark, { as: "Hashtag_Bookmarks", foreignKey: "Hashtag_hashtag_id"});
  Category_State.belongsTo(State, { as: "State_state", foreignKey: "State_state_id"});
  State.hasMany(Category_State, { as: "Category_States", foreignKey: "State_state_id"});
  Bookmark.belongsTo(User, { as: "User_user", foreignKey: "User_user_id"});
  User.hasMany(Bookmark, { as: "Bookmarks", foreignKey: "User_user_id"});
  Category.belongsTo(User, { as: "User_user", foreignKey: "User_user_id"});
  User.hasMany(Category, { as: "Categories", foreignKey: "User_user_id"});
  Category_State.belongsTo(User, { as: "User_user", foreignKey: "User_user_id"});
  User.hasMany(Category_State, { as: "Category_States", foreignKey: "User_user_id"});
  Hashtag.belongsTo(User, { as: "User_user", foreignKey: "User_user_id"});
  User.hasMany(Hashtag, { as: "Hashtags", foreignKey: "User_user_id"});
  Hashtag_Bookmark.belongsTo(User, { as: "User_user", foreignKey: "User_user_id"});
  User.hasMany(Hashtag_Bookmark, { as: "Hashtag_Bookmarks", foreignKey: "User_user_id"});
  State.belongsTo(User, { as: "User_user", foreignKey: "User_user_id"});
  User.hasMany(State, { as: "States", foreignKey: "User_user_id"});

  return {
    Bookmark,
    Category,
    Category_State,
    Hashtag,
    Hashtag_Bookmark,
    State,
    User,
  };
}
