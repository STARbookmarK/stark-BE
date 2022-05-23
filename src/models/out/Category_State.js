import _sequelize from 'sequelize';
const { Model, Sequelize } = _sequelize;

export default class Category_State extends Model {
  static init(sequelize, DataTypes) {
  return super.init({
    State_state_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      references: {
        model: 'State',
        key: 'state_id'
      }
    },
    Category_category_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      references: {
        model: 'Category',
        key: 'category_id'
      }
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
    tableName: 'Category_State',
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
          { name: "State_state_id" },
          { name: "Category_category_id" },
          { name: "User_user_id" },
        ]
      },
      {
        name: "fk_Category_State_State1_idx",
        using: "BTREE",
        fields: [
          { name: "State_state_id" },
        ]
      },
      {
        name: "fk_Category_State_Category1_idx",
        using: "BTREE",
        fields: [
          { name: "Category_category_id" },
        ]
      },
      {
        name: "fk_Category_State_User1_idx",
        using: "BTREE",
        fields: [
          { name: "User_user_id" },
        ]
      },
    ]
  });
  }
}
