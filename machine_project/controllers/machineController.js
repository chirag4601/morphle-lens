const { MachineState, MachineHistory } = require("../models/machine");
const {
  focusMachineSimulation,
  moveMachineSimulation,
  createResponse,
  requireIdleState,
} = require("../utils/machineUtils");

const getMachineState = async () => {
  return await MachineState.findByPk(1);
};
const getMachineHistory = async () => {
  return await MachineHistory.findAll();
};

const getState = async (req, res) => {
  const state = await getMachineState();
  const history = await getMachineHistory();
  res.json(createResponse(state, history));
};

const moveMachine = async (req, res) => {
  const { x: targetX, y: targetY } = req.body;
  const state = await getMachineState();

  if (state.status !== "idle")
    return res.status(400).json({ error: "Machine is busy" });

  await state.update({ status: "moving" });
  await focusMachineSimulation();
  await state.update({
    status: "idle",
    x_position: targetX,
    y_position: targetY,
  });

  await MachineHistory.create({
    x_position: targetX,
    y_position: targetY,
    status: "green",
    created_at: new Date(),
  });
  const history = await getMachineHistory();
  res.json(createResponse(state, history));
};

const focusMachine = async (req, res) => {
  const state = await getMachineState();
  if (state.status !== "idle")
    return res.status(400).json({ error: "Machine is busy" });

  await state.update({ status: "processing" });
  await moveMachineSimulation();

  await MachineHistory.create({
    x_position: state.x_position,
    y_position: state.y_position,
    status: "red",
    created_at: new Date(),
  });
  await state.update({ status: "idle" });
  const history = await getMachineHistory();
  res.json(createResponse(state, history));
};

const resetMachine = async (req, res) => {
  await MachineHistory.destroy({ where: {} });
  const state = await getMachineState();
  await state.update({ status: "idle", x_position: 0, y_position: 0 });
  const history = await getMachineHistory();
  res.json(createResponse(state, history));
};

module.exports = { getState, moveMachine, focusMachine, resetMachine };
