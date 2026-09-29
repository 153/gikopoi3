import { Room, Coordinates } from "../../types";
import { coordRange } from "../../utils";

export const LoungeRoom: Room = {
	id: "lounge",
	group: "gikopoi",
	scale: 1.4,
	size: {x: 19, y: 20},
	originCoordinates: {x: -350, y: 250},
	spawnPoint: "default",
	backgroundImageUrl: "rooms/mcdonalds/hello.jpg",
	objects: [],
	sit: [],
	blocked: ([
	{x: 7, y: 0},
	{x: 14, y: 0},
	] as Coordinates[])
	// left
	.concat(coordRange({x: 0, y: 0}, {x: 0, y: 7}))
	.concat(coordRange({x: 1, y: 0}, {x: 1, y: 6}))
	.concat(coordRange({x: 2, y: 0}, {x: 2, y: 5}))
	.concat(coordRange({x: 3, y: 0}, {x: 3, y: 4}))
	.concat(coordRange({x: 4, y: 0}, {x: 4, y: 3}))
	.concat(coordRange({x: 5, y: 0}, {x: 5, y: 2}))
	.concat(coordRange({x: 6, y: 0}, {x: 6, y: 1}))

	// top
	.concat(coordRange({x: 0, y: 12}, {x: 0, y: 19}))
	.concat(coordRange({x: 1, y: 13}, {x: 1, y: 19}))
	.concat(coordRange({x: 2, y: 14}, {x: 2, y: 19}))
	.concat(coordRange({x: 3, y: 15}, {x: 3, y: 19}))
	.concat(coordRange({x: 4, y: 16}, {x: 4, y: 19}))
	.concat(coordRange({x: 5, y: 17}, {x: 5, y: 19}))
	.concat(coordRange({x: 6, y: 18}, {x: 6, y: 19}))
	.concat(coordRange({x: 7, y: 18}, {x: 7, y: 19}))

	// right
	.concat(coordRange({x: 8, y: 17}, {x: 8, y: 19}))
	.concat(coordRange({x: 9, y: 16}, {x: 9, y: 19}))
	.concat(coordRange({x: 10, y: 15}, {x: 10, y: 19}))
	.concat(coordRange({x: 11, y: 14}, {x: 11, y: 19}))
	.concat(coordRange({x: 12, y: 13}, {x: 12, y: 19}))
	.concat(coordRange({x: 13, y: 12}, {x: 13, y: 19}))
	.concat(coordRange({x: 14, y: 11}, {x: 14, y: 19}))
	.concat(coordRange({x: 15, y: 10}, {x: 15, y: 19}))
	.concat(coordRange({x: 16, y: 9}, {x: 16, y: 19}))
	.concat(coordRange({x: 17, y: 8}, {x: 17, y: 19}))
	.concat(coordRange({x: 18, y: 7}, {x: 18, y: 19}))

	// bottom
	.concat(coordRange({x: 15, y: 0}, {x: 15, y: 1}))
	.concat(coordRange({x: 16, y: 0}, {x: 16, y: 2}))
	.concat(coordRange({x: 17, y: 0}, {x: 17, y: 3}))
	.concat(coordRange({x: 18, y: 0}, {x: 18, y: 4})),



	forbiddenMovements: [],
	doors: {
	    default: {x:10, y:10, direction: "up", target: {roomId: "hell", doorId: "manhole"} },
	},
	streamSlotCount: 12,
    };
