import _sequelize from 'sequelize';
const { Model, Sequelize } = _sequelize;

export default class hashtag_state extends Model {
  static init(sequelize, DataTypes) {
  return super.init({
    State_state_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      references: {
        model: 'state',
        key: 'state_id'
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
    },
    Hashtag_hashtag_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      references: {
        model: 'hashtag',
        key: 'hashtag_id'
      }
    }
  }, {
    sequelize,
    tableName: 'hashtag_state',
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
          { name: "User_user_id" },
          { name: "Hashtag_hashtag_id" },
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
        name: "fk_Category_State_User1_idx",
        using: "BTREE",
        fields: [
          { name: "User_user_id" },
        ]
      },
      {
        name: "fk_Category_State_Hashtag1_idx",
        using: "BTREE",
        fields: [
          { name: "Hashtag_hashtag_id" },
        ]
      },
    ]
  });
  }
}
