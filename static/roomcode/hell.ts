import { Room, Coordinates } from "../../types";
import { coordRange } from "../../utils";

export const HellRoom: Room = {
        id: "hell",
        group: "gikopoi",
        scale: 0.39,
        size: { x: 6, y: 8 },
        originCoordinates: { x: 11, y: 290},
        spawnPoint: "school",
        backgroundImageUrl: "rooms/hell/giko-hell.png",
	backgroundColor: "#990600",
        objects: [],
        sit: [],
        blocked: [
            { x: 0, y: 3 },
            { x: 0, y: 4 },
            { x: 0, y: 4 },
            { x: 0, y: 6 },
            { x: 0, y: 7 },
        ],
        forbiddenMovements: [],
        worldSpawns: [
            { x: 3, y: 4, direction: "down", target: null }
        ],
        doors: {
            left: { x: 0, y: 2, direction: "right", target: { roomId: "temple", doorId: "door" } },
            school: { x: 0, y: 5, direction: "right", target: { roomId: "library", doorId: "right" } },
            up: { x: 3, y: 7, direction: "down", target: { roomId: "grave", doorId: "spawn" } },
            right: { x: 5, y: 2, direction: "left", target: { roomId: "grave", doorId: "spawn" } },
            manhole: { x: 4, y: 1, direction: "down", target: { roomId: "lounge", doorId: "default" } },
	    spawn: { x: 3, y: 4, direction: "down", target: null},
        },
        streamSlotCount: 3,
    };
