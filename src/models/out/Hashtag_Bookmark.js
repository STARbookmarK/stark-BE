import _sequelize from 'sequelize';
const { Model, Sequelize } = _sequelize;

export default class hashtag_bookmark extends Model {
  static init(sequelize, DataTypes) {
  return super.init({
    Bookmark_bookmark_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      references: {
        model: 'bookmark',
        key: 'bookmark_id'
      }
    },
    Hashtag_hashtag_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      references: {
        model: 'hashtag',
        key: 'hashtag_id'
      }
    },
    User_user_id: {
      type: DataTypes.STRING(45),
      allowNull: false,
      primaryKey: true,
      references: {
        model: 'user',
        key: 'user_id'
      }
    }
  }, {
    sequelize,
    tableName: 'hashtag_bookmark',
    timestamps: false,
    underscored: false,
    charset: 'utf8',
    collate: 'utf8_general_ci',
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "Bookmark_bookmark_id" },
          { name: "Hashtag_hashtag_id" },
          { name: "User_user_id" },
        ]
      },
      {
        name: "fk_Hashtag_Bookmark_copy1_Bookmark1_idx",
        using: "BTREE",
        fields: [
          { name: "Bookmark_bookmark_id" },
        ]
      },
      {
        name: "fk_Hashtag_Bookmark_copy1_Hashtag1_idx",
        using: "BTREE",
        fields: [
          { name: "Hashtag_hashtag_id" },
        ]
      },
      {
        name: "fk_Hashtag_Bookmark_copy1_User1_idx",
        using: "BTREE",
        fields: [
          { name: "User_user_id" },
        ]
      },
    ]
  });
  }
}
