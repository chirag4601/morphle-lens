// routes/machineRoutes.js
const express = require("express");
const {
  getState,
  moveMachine,
  focusMachine,
  resetMachine,
} = require("../controllers/machineController");

const router = express.Router();

router.get("/backend/api/state", getState);
router.post("/backend/api/move", moveMachine);
router.post("/backend/api/focus", focusMachine);
router.post("/backend/api/reset", resetMachine);

module.exports = router;
