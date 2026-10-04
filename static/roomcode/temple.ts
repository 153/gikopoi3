import { Room, Coordinates } from "../../types";
import { coordRange } from "../../utils";

export const TempleRoom: Room = {
    id: "temple",
    group: "gikopoipoi",
    scale: 1,
    size: { x: 12, y: 9},
    originCoordinates: { x: 0, y: 445} ,
    spawnPoint: "door",
    backgroundImageUrl: "rooms/temple/background.svg",
    backgroundColor: "#333333",
    objects: [
    { x: 2, y: 6, offset: { x: 80, y: 157}, url: 'altar.svg'},
    ],
    sit: [
      { x: 4, y: 4},
      { x: 7, y: 1},
      { x: 7, y: 3},
      { x: 7, y: 5},
      { x: 7, y: 7},
      { x: 9, y: 1},
      { x: 9, y: 3},
      { x: 9, y: 5},
      { x: 9, y: 7},
      ],
    blocked: [
      {x: 0, y: 2},
      {x: 1, y: 2},
      {x: 2, y: 2},
      {x: 2, y: 3},
      {x: 2, y: 4},
      {x: 2, y: 5},
      {x: 2, y: 6},
      {x: 1, y: 6},
      {x: 0, y: 6},
      ],
    doors: {
      door: { x: 11, y: 4, direction: "left", target: { roomId: "hell", doorId: "left"} }
      },
    forbiddenMovements: [],
    streamSlotCount: 5,
   };
