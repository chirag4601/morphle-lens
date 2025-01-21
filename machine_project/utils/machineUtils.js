const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const focusMachineSimulation = async () => {
  await sleep(process.env.FOCUS_TIME || 2000);
};

const moveMachineSimulation = async () => {
  await sleep(process.env.MOVE_TIME || 3000);
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

module.exports = {
  focusMachineSimulation,
  moveMachineSimulation,
  createResponse,
};
