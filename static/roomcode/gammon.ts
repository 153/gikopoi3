import { Room, Coordinates } from "../../types";
import { coordRange } from "../../utils";

export const GammonRoom: Room = {
    id: "gammon",
	group: "gikopoi",
	scale: 1,
	size: {x: 12, y: 14},
	originCoordinates: { x: 42, y: 523},
	spawnPoint: "spawn",
	backgroundImageUrl: "rooms/gammon/background.svg",
	objects: [
	{x: 0, y: 4, scale: 1, offset: { x: 252, y: 222}, url: 'beer.png'},
	],
	sit: [],
	blocked: [
	// the bar
	{x: 4, y: 13}, 	{x: 5, y: 13},	{x: 6, y: 13},
	{x: 8, y: 13}, {x: 9, y: 13}, {x: 10, y: 13}, {x: 11, y: 13},
	// the wall
	{x: 3, y: 0}, {x: 3, y: 1}, {x: 3, y: 2}, {x: 3, y: 3},
	{x: 3, y: 4}, {x: 3, y: 5}, {x: 3, y: 6}, {x: 3, y: 7},
	{x: 3, y: 8}, {x: 3, y: 9}, {x: 3, y: 10}, {x: 3, y: 11},
	{x: 3, y: 12}, {x: 3, y: 13},
	// the table
	{x: 0, y: 4}, {x: 1, y: 5}, {x: 1, y: 6}, {x: 0, y: 7},

	],
	forbiddenMovements: [],
	doors: {
	    spawn: {x: 4, y: 0, direction: "right", target: {roomId: "hell", doorId: "spawn",},},
	    bar: {x: 7, y: 13, direction: "left", target: {roomId: "gammon", doorId: "beer"},},
	    beer: {x: 0, y: 5, direction: "right", target: null},
	    },
        streamSlotCount: 5,
    };
