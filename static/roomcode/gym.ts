import { Room, Coordinates } from "../../types";
import { coordRange } from "../../utils";

export const GymRoom: Room = {
        id: "gym",
	group: "gikopoi",
	scale: 0.68,
	size: {x: 12, y: 18},
	originCoordinates: {x: 10, y: 410 },
	spawnPoint: "bottom",
	backgroundImageUrl: "rooms/gym/gym2.png",
	objects: [],
	sit: [
    { x: 0, y: 0},
		{ x: 0, y: 1},
		{ x: 0, y: 2},
		{ x: 0, y: 3},
	],
	blocked: [
                {x: 0, y: 4},
                {x: 0, y: 5},
                {x: 0, y: 6},
                {x: 0, y: 7},
                {x: 0, y: 8},
                {x: 0, y: 9},
                {x: 0, y: 10},
                {x: 0, y: 11},
                {x: 0, y: 12},
                {x: 1, y: 12},
                {x: 2, y: 12},
                {x: 3, y: 12},
                {x: 4, y: 12},
                {x: 5, y: 12},
                {x: 6, y: 14},
		{x: 7, y: 13},
                {x: 7, y: 14}, // arch
                {x: 6, y: 14},
                {x: 6, y: 14},
                {x: 6, y: 14},
                {x: 7, y: 15},
                {x: 8, y: 16},
                {x: 7, y: 16},
                {x: 8, y: 17},
                {x: 9, y: 17},
                {x: 10, y: 17},
                {x: 11, y: 17}, // arch additions
		{x: 6, y: 12}, // door
		{x: 7, y: 12},
		{x: 7, y: 13},
		{x: 1, y: 11}, // equip
		{x: 2, y: 11},
		{x: 3, y: 11},
		{x: 4, y: 11},
		{x: 5, y: 11},
		{x: 9, y: 16}, // wall
		{x: 10, y: 16},
		{x: 11, y: 16},


     ],
     forbiddenMovements: [],
     doors: {
       bottom: { x: 0, y: 0, direction: "up", target: { roomId: "grave", doorId: "spawn"} },
       moon: { x: 6, y: 13, direction: "up", target: {roomId: "gym", doorId: "moon"}},
       warp: { x: 10, y: 15, direction: "up", target: {roomId: "gym", doorId: "moon"}},
     },
     streamSlotCount: 3,
     };
