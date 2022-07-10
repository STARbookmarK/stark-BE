import _sequelize from 'sequelize';
const { Model, Sequelize } = _sequelize;

export default class Bookmark extends Model {
  static init(sequelize, DataTypes) {
  return super.init({
    bookmark_id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    title: {
      type: DataTypes.STRING(45),
      allowNull: false
    },
    address: {
      type: DataTypes.STRING(45),
      allowNull: false
    },
    image: {
      type: DataTypes.STRING(45),
      allowNull: false
    },
    description: {
      type: DataTypes.STRING(45),
      allowNull: false
    },
    rate: {
      type: DataTypes.TINYINT,
      allowNull: true
    },
    User_user_id: {
      type: DataTypes.STRING(45),
      allowNull: false,
      primaryKey: true,
      references: {
        model: 'User',
        key: 'user_id'
      }
    }
  }, {
    sequelize,
    tableName: 'Bookmark',
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
          { name: "bookmark_id" },
          { name: "User_user_id" },
        ]
      },
      {
        name: "bookmark_id_UNIQUE",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "bookmark_id" },
        ]
      },
      {
        name: "fk_Bookmark_User_idx",
        using: "BTREE",
        fields: [
          { name: "User_user_id" },
        ]
      },
    ]
  });
  }
}
