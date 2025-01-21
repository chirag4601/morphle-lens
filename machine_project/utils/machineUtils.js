const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const focusMachineSimulation = async () => {
  await sleep(2000);
};

const moveMachineSimulation = async () => {
  await sleep(3000);
};

const createResponse = (state, history = null) => {
  return {
    current: {
      x: state.x_position,
      y: state.y_position,
      status: state.status,
    },
    history: history || [],
  };
};

const requireIdleState = (fn) => {
  return async (req, res) => {
    const state = await getMachineState();
    if (state.status !== "idle") {
      return res.status(400).json({ error: "Machine is busy" });
    }
    return fn(req, res);
  };
};

module.exports = {
  focusMachineSimulation,
  moveMachineSimulation,
  createResponse,
  requireIdleState,
};
