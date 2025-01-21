import { useCallback, useEffect, useRef, useState } from "react";

import { API_METHODS, fetchData } from "../apis/fetchData";
import {
  FOCUS_MACHINE_URL,
  GET_STATE_URL,
  MOVE_MACHINE_URL,
  RESET_MACHINE_URL,
} from "../utils/urls";

const GRID_SIZE = { width: 100, height: 60 };
const CELL_SIZE = 12;

const MachineControl = () => {
  const [currentState, setCurrentState] = useState({
    x: 0,
    y: 0,
    status: "idle",
  });
  const [history, setHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isResetting, setIsResetting] = useState(false);
  const [targetPosition, setTargetPosition] = useState({ x: 0, y: 0 });

  const targetRef = useRef({ x: 0, y: 0 });
  const processingRef = useRef(false);

  useEffect(() => {
    const fetchState = async () => {
      const response = await fetchData({ url: GET_STATE_URL });
      setCurrentState(response.current);
      targetRef.current = response.current;
      setTargetPosition(response.current);
      setHistory(response.history);
      setIsLoading(false);
    };
    fetchState();
  }, []);

  const updateMachineState = async ({
    url,
    method = API_METHODS.POST,
    data = null,
  }) => {
    const response = await fetchData({ url, method, data });
    setCurrentState(response.current);
    setHistory(response.history);
    return response;
  };

  const moveMachine = async (targetX, targetY) => {
    if (processingRef.current) return;
    setCurrentState((prev) => ({ ...prev, status: "moving" }));
    processingRef.current = true;
    const response = await fetchData({
      url: MOVE_MACHINE_URL,
      method: API_METHODS.POST,
      data: { x: targetX, y: targetY },
    });
    setCurrentState(response.current);
    setHistory(response.history);
    processingRef.current = false;
    if (targetX === targetRef.current.x && targetY === targetRef.current.y) {
      setCurrentState((prev) => ({ ...prev, status: "focusing" }));
      await focusMachine(targetX, targetY);
    } else await moveMachine(targetRef.current.x, targetRef.current.y);
  };

  const focusMachine = async (targetX, targetY) => {
    processingRef.current = true;
    await updateMachineState({ url: FOCUS_MACHINE_URL });
    processingRef.current = false;
    if (targetX !== targetRef.current.x || targetY !== targetRef.current.y)
      await moveMachine(targetRef.current.x, targetRef.current.y);
  };

  const handleKeyDown = useCallback((event) => {
    const { x, y } = targetRef.current;
    const movements = {
      ArrowLeft: { x: Math.max(x - 1, -GRID_SIZE.width / 2), y },
      ArrowRight: { x: Math.min(x + 1, GRID_SIZE.width / 2), y },
      ArrowUp: { x, y: Math.max(y - 1, -GRID_SIZE.height / 2) },
      ArrowDown: { x, y: Math.min(y + 1, GRID_SIZE.height / 2) },
    };
    const newPosition = movements[event.key];
    if (newPosition) {
      event.preventDefault();
      targetRef.current = newPosition;
      setTargetPosition(newPosition);
      moveMachine(newPosition.x, newPosition.y);
    }
  }, []);

  const handleReset = async () => {
    setIsResetting(true);
    await updateMachineState({ url: RESET_MACHINE_URL });
    targetRef.current = { x: 0, y: 0 };
    setTargetPosition({ x: 0, y: 0 });
    setIsResetting(false);
  };

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="p-4 flex flex-col items-center">
      Press Any arrow key to move microscope scope.
      <div
        className="relative overflow-y-scroll bg-white"
        style={{
          width: GRID_SIZE.width * CELL_SIZE + 20,
          height: GRID_SIZE.height * CELL_SIZE + 20,
          backgroundImage: `linear-gradient(to right, #e5e7eb 1px, transparent 1px),
                          linear-gradient(to bottom, #e5e7eb 1px, transparent 1px)`,
          backgroundSize: `${CELL_SIZE}px ${CELL_SIZE}px`,
        }}
      >
        {history.map((point, index) => (
          <div
            key={index}
            className={`absolute z-10 transition-all duration-300 ${
              point.status === "red" ? "bg-red-500" : "bg-green-500"
            }`}
            style={{
              width: CELL_SIZE,
              height: CELL_SIZE,
              left: `${point.x_position * CELL_SIZE + (GRID_SIZE.width * CELL_SIZE) / 2}px`,
              top: `${point.y_position * CELL_SIZE + (GRID_SIZE.height * CELL_SIZE) / 2}px`,
            }}
          />
        ))}

        <div
          className={`absolute z-10 transition-all duration-300 border-yellow-500 border-2`}
          style={{
            width: CELL_SIZE,
            height: CELL_SIZE,
            left: `${currentState.x * CELL_SIZE + (GRID_SIZE.width * CELL_SIZE) / 2}px`,
            top: `${currentState.y * CELL_SIZE + (GRID_SIZE.height * CELL_SIZE) / 2}px`,
          }}
        />

        <div
          className={`absolute bg-black`}
          style={{
            width: CELL_SIZE,
            height: CELL_SIZE,
            left: `${(GRID_SIZE.width * CELL_SIZE) / 2}px`,
            top: `${(GRID_SIZE.height * CELL_SIZE) / 2}px`,
          }}
        />
      </div>
      <div className="w-4/5 flex justify-between mt-4">
        <div>
          <div className="mb-4 space-y-2">
            <p className="text-gray-700">
              Current Position: ({currentState.x}, {-currentState.y})
            </p>
            <p className="text-gray-700">Status: {currentState.status}</p>
            <p className="text-gray-700">
              Target Position: ({targetPosition.x}, {-targetPosition.y})
            </p>
          </div>
          <button
            onClick={handleReset}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={isResetting || currentState.status !== "idle"}
          >
            Reset{isResetting && "ing ..."}
          </button>
        </div>
        <div>
          Info:
          <div>Green Box: Machine moved to that position</div>
          <div>Red Box: Microscope focused on that position</div>
          <div>Black Box: Initial position of microscope</div>
          <div>Box with Border: Current position of Microscope</div>
        </div>
      </div>
    </div>
  );
};

export default MachineControl;
