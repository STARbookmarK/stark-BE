import _sequelize from 'sequelize';
const { Model, Sequelize } = _sequelize;

export default class state extends Model {
  static init(sequelize, DataTypes) {
  return super.init({
    state_id: {
      autoIncrement: true,
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
        model: 'user',
        key: 'user_id'
      }
    }
  }, {
    sequelize,
    tableName: 'state',
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
          { name: "state_id" },
          { name: "User_user_id" },
        ]
      },
      {
        name: "state_id_UNIQUE",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "state_id" },
        ]
      },
      {
        name: "fk_State_User1_idx",
        using: "BTREE",
        fields: [
          { name: "User_user_id" },
        ]
      },
    ]
  });
  }
}
