import { Room, Coordinates } from "../../types";
import { coordRange } from "../../utils";

export const LibraryRoom: Room = {
        id: "library",
        group: "gikopoipoi",
        scale: 1,
        size: {y: 13, x: 9},
        originCoordinates: {x: 0, y: 523.6},
        spawnPoint: "left",
        backgroundImageUrl: "rooms/library/background.svg",
        objects: [
            { x: 0, y: 2, scale: 1, offset: { x: 38, y: 282}, url: 'shleft.svg'},
            { x: 0, y: 5, scale: 1, offset: { x: 161, y: 220}, url: 'shleft.svg'},
            { x: 0, y: 8, scale: 1, offset: { x: 282, y: 161}, url: 'shleft.svg'},
            { x: 0, y: 11, scale: 1, offset: { x: 402, y: 100}, url: 'shleft.svg'},
            { x: 2, y: 12, scale: 1, offset: { x: 562, y: 119}, url: 'shright.svg'},
            { x: 5, y: 12, scale: 1, offset: { x: 682, y: 180}, url: 'shright.svg'},
            { x: 3, y: 0, scale: 1, offset: { x: 80, y: 363}, url: 'shrightb.svg'},
            { x: 8, y: 7, scale: 1, offset: { x: 603, y: 322}, url: 'shleftb.svg'},
            { x: 8, y: 10, scale: 1, offset: { x: 724, y: 262}, url: 'shleftb.svg'},
        ],
        sit: [
            {x: 4, y: 6},
        ],
        blocked: [
            // bookshelves
            {x: 0, y: 1},
            {x: 0, y: 2},
            {x: 0, y: 4},
            {x: 0, y: 5},
            {x: 0, y: 7},
            {x: 0, y: 8},
            {x: 0, y: 10},
            {x: 0, y: 11},
            {x: 2, y: 12},
            {x: 3, y: 12},
            {x: 5, y: 12},
            {x: 6, y: 12},
            {x: 8, y: 11},
            {x: 8, y: 10},
            {x: 8, y: 8},
            {x: 8, y: 7},
            {x: 2, y: 0},
            {x: 3, y: 0},
        ],
        doors: {
          left: { x: 6, y: 0, direction: "right", target: { roomId: "library", doorId: "right"}},
          right: {x: 8, y: 3, direction: "left", target: {roomId: "hell", doorId: "school"}},
        },

        forbiddenMovements: [],
        streamSlotCount: 1,
    };
