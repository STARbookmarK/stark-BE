import _sequelize from 'sequelize';
const { Model, Sequelize } = _sequelize;

export default class Category extends Model {
  static init(sequelize, DataTypes) {
  return super.init({
    category_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    title: {
      type: DataTypes.STRING(45),
      allowNull: false
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
    tableName: 'Category',
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
          { name: "category_id" },
          { name: "User_user_id" },
        ]
      },
      {
        name: "fk_Category_User1_idx",
        using: "BTREE",
        fields: [
          { name: "User_user_id" },
        ]
      },
    ]
  });
  }
}
