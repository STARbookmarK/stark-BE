import _sequelize from 'sequelize';
const { Model, Sequelize } = _sequelize;

export default class user extends Model {
  static init(sequelize, DataTypes) {
  return super.init({
    user_id: {
      type: DataTypes.STRING(45),
      allowNull: false,
      primaryKey: true
    },
    nickname: {
      type: DataTypes.STRING(45),
      allowNull: false,
      unique: "nickname_UNIQUE"
    },
    password: {
      type: DataTypes.STRING(45),
      allowNull: false
    },
    info: {
      type: DataTypes.STRING(45),
      allowNull: true
    },
    bookmarkshow: {
      type: DataTypes.TINYINT,
      allowNull: false,
      defaultValue: 1
    },
    hashtagshow: {
      type: DataTypes.TINYINT,
      allowNull: false,
      defaultValue: 1
    },
    hashtagcategory: {
      type: DataTypes.TINYINT,
      allowNull: false,
      defaultValue: 1
    }
  }, {
    sequelize,
    tableName: 'user',
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
          { name: "user_id" },
        ]
      },
      {
        name: "user_id_UNIQUE",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "user_id" },
        ]
      },
      {
        name: "nickname_UNIQUE",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "nickname" },
        ]
      },
    ]
  });
  }
}
