import { Room, Coordinates } from "../../types";
import { coordRange } from "../../utils";

export const GraveRoom: Room = {
        id: "grave",
        group: "gikopoi",
        scale: 1,
        size: { x: 10, y: 9 },
        originCoordinates: { x: -1, y: 323 },
        spawnPoint: "spawn",
        backgroundImageUrl: "rooms/grave/background.png",
        objects: [],
        sit: [],
        blocked: [
            { x:  0, y:  4},
	    { x:  1, y:  4},
	    { x:  2, y:  4},
	    { x:  6, y:  4},
	    { x:  7, y:  4},
	    { x:  8, y:  4},
	    { x:  9, y:  4},
	    { x:  9, y:  5},
	    { x:  9, y:  6},
	    { x:  9, y:  7},
	    { x:  9, y:  8},
        ],
        forbiddenMovements: [],
        doors: {
            spawn: { x: 4, y: 0, direction: "down", target: { roomId: "hell", doorId: "spawn"} },
         },
        streamSlotCount: 2,
    };
