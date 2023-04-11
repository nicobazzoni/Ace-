import { useEffect } from "react";
import { atom, useRecoilValue } from "recoil";

export const shipPositionState = atom({
  key: "shipPosition", // unique ID (with respect to other atoms/selectors)
  default: { position: {}, rotation: {} } // default value (aka initial value)
});

export const enemyPositionState = atom({
  key: "enemyPosition", // unique ID (with respect to other atoms/selectors)
  default: [{ x: -10, y: 10, z: -80 }, { x: 20, y: 20, z: -100 },{ x: 15, y: 15, z: -50 },{ x: 5, y: 5, z: -20 },{ x: 2, y: 2, z: -5 }] // default value (aka initial value)
});

//repeat for each enemy
export const laserPositionState = atom({
  key: "laserPositions", // unique ID (with respect to other atoms/selectors)
  default: [] // default value (aka initial value)
});

export const scoreState = atom({
  key: "score", // unique ID (with respect to other atoms/selectors)
  default: 0 // default value (aka initial value)
});

export const bulletPositionState = atom({
  key: "bulletPosition", // unique ID (with respect to other atoms/selectors)
 //make value where enemy is destroyed
  default: { x: 0, y: 0, z: 0 } // default value (aka initial value)
  
});

export const explosionPositionState = atom({
  key: "explosionPosition", // unique ID (with respect to other atoms/selectors)
  default: [] // default value (aka initial value)
});





