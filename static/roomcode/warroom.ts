import { Room, Coordinates } from "../../types";
import { coordRange } from "../../utils";

export const WarroomRoom: Room = {
    id: "warroom",
    group: "gikopoi3",
    spawnPoint: "spawn",
    streamSlotCount: 1,
    forcedAnonymous: false,
    size: {x: 13, y: 13},
    scale: 1,
    originCoordinates: {x: 2, y: 964},
    backgroundImageUrl: "rooms/warroom/background.svg",
    sit: [
        {x: 1, y: 3},
            {x: 1, y: 4},
            {x: 1, y: 5},
            {x: 1, y: 6},
            {x: 5, y: 6},
            {x: 6, y: 6},
            {x: 1, y: 7},
            {x: 5, y: 7},
            {x: 6, y: 7},
            {x: 1, y: 8},
            {x: 1, y: 9},
            {x: 3, y: 11},
            {x: 4, y: 11},
            {x: 5, y: 11},
            {x: 6, y: 11},
            {x: 7, y: 11},
            {x: 8, y: 11},
            {x: 9, y: 11}
    ],
    blocked: [
        {x: 3, y: 0},
            {x: 3, y: 1},
            {x: 2, y: 2},
            {x: 2, y: 3},
            {x: 2, y: 4},
            {x: 2, y: 5},
            {x: 2, y: 6},
            {x: 2, y: 7},
            {x: 2, y: 8},
            {x: 2, y: 9},
            {x: 10, y: 9},
            {x: 11, y: 9},
            {x: 12, y: 9},
            {x: 2, y: 10},
            {x: 3, y: 10},
            {x: 4, y: 10},
            {x: 5, y: 10},
            {x: 6, y: 10},
            {x: 7, y: 10},
            {x: 8, y: 10},
            {x: 9, y: 10},
            {x: 10, y: 10}
    ],
    objects: [
        {x: 6, y: 5, offset: {x: 125, y: 311}, url: "target1.svg", scale: 1}
    ],

    doors: {
        spawn: {x: 2, y: 12, direction: "down", target: null}
    },
    forbiddenMovements: []
    };
