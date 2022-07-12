import _sequelize from 'sequelize';
const { Model, Sequelize } = _sequelize;

export default class hashtag extends Model {
  static init(sequelize, DataTypes) {
  return super.init({
    hashtag_id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    title: {
      type: DataTypes.STRING(45),
      allowNull: false
    },
    star: {
      type: DataTypes.TINYINT,
      allowNull: false,
      defaultValue: 0
    },
    Category_category_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      references: {
        model: 'category',
        key: 'category_id'
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
    tableName: 'hashtag',
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
          { name: "hashtag_id" },
          { name: "Category_category_id" },
          { name: "User_user_id" },
        ]
      },
      {
        name: "hashtag_id_UNIQUE",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "hashtag_id" },
        ]
      },
      {
        name: "fk_Hashtag_Category1_idx",
        using: "BTREE",
        fields: [
          { name: "Category_category_id" },
        ]
      },
      {
        name: "fk_Hashtag_User1_idx",
        using: "BTREE",
        fields: [
          { name: "User_user_id" },
        ]
      },
    ]
  });
  }
}
