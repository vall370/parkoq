import { Model, ModelDefined, UUIDV4 } from "sequelize";
interface UserAttributes {
  id: string;
  name: string;
  first_name: string;
  last_name: string;
  picture: any;
  email: string;
  status: boolean;
}
module.exports = function (sequelize: any, DataTypes: any) {
  const User: Model<UserAttributes> = sequelize.define(
    "user",
    {
      id: {
        type: DataTypes.STRING,
        allowNull: false,
        primaryKey: true,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      first_name: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      last_name: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      picture: {
        type: DataTypes.JSONB,
        allowNull: true,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      status: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
      },
    },
    {
      sequelize,
      tableName: "user",
      schema: "public",
      timestamps: false,
      indexes: [
        {
          name: "user_pkey",
          unique: true,
          fields: [{ name: "id" }],
        },
      ],
    }
  );
  return User;
};
