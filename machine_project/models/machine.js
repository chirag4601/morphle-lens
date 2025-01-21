// models/machine.js
const { Model, DataTypes } = require("sequelize");
const sequelize = require("../config/database");

class MachineState extends Model {}

MachineState.init(
  {
    x_position: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    y_position: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    status: {
      type: DataTypes.STRING,
      defaultValue: "idle",
    },
  },
  {
    sequelize,
    modelName: "MachineState",
    tableName: "backend_machinestate",
    timestamps: false,
  },
);

class MachineHistory extends Model {}

MachineHistory.init(
  {
    x_position: DataTypes.INTEGER,
    y_position: DataTypes.INTEGER,
    status: DataTypes.STRING,
    created_at: DataTypes.DATE,
  },
  {
    sequelize,
    modelName: "MachineHistory",
    tableName: "backend_machinehistory",
    timestamps: false,
  },
);

module.exports = { MachineState, MachineHistory };
