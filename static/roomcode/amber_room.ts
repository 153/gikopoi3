import { Room } from "../../types";

export const AmberRoom: Room = {
    id: "amber_room",
    group: "gikopoi3",
    spawnPoint: "spawn",
    streamSlotCount: 5,
    size: {x: 9, y: 10},
    scale: 1,
    defaultZoom: 1.5,
    originCoordinates: {x: 0, y: 382.79},
    backgroundImageUrl: "rooms/amber_room/background.svg",

    sit: [
        { x: 5, y: 0 },
        { x: 7, y: 0 },
        { x: 6, y: 1 },
        { x: 8, y: 1 },
        { x: 1, y: 2 },
        { x: 2, y: 2 },
        { x: 6, y: 2 },
        { x: 8, y: 2 },
        { x: 1, y: 3 },
        { x: 2, y: 3 },
        { x: 1, y: 8 },
        { x: 0, y: 1 },
        { x: 0, y: 2 },
    ],
    blocked: [
        { x: 0, y: 0 },
        { x: 0, y: 8 },
        { x: 0, y: 9 },
        { x: 1, y: 1 },
        { x: 2, y: 1 },
        { x: 3, y: 1 },
        { x: 3, y: 2 },
        { x: 3, y: 3 },
        { x: 6, y: 5 },
        { x: 7, y: 5 },
        { x: 8, y: 5 },
        { x: 6, y: 6 },
        { x: 6, y: 7 },
        { x: 6, y: 9 },
        { x: 6, y: 8 },
        { x: 7, y: 1 },
        { x: 7, y: 2 },
        { x: 0, y: 3 },
    ],
    objects: [
        {x: 0, y: 3, offset: {x: 51, y: 267}, url: "blanket.svg", scale: 1},
        {x: 0, y: 0, offset: {x: 53, y: 280}, url: "blanket_front.svg", scale: 1},
        {x: 0, y: 0, offset: {x: 53, y: 279}, url: "blanket_top.svg", scale: 1},
        {x: 0, y: 1, offset: {x: 109, y: 279}, url: "blanket_top2.svg", scale: 1},
        {x: 4, y: 7, offset: {x: 556.42, y: 231.22}, url: "chest1.svg", scale: 1},
        {x: 0, y: 4, offset: {x: 558.75, y: 231.27}, url: "chest2.svg", scale: 1},
        {x: 4, y: 8, offset: {x: 556.42, y: 231.22}, url: "chest3.svg", scale: 1},
        {x: 5, y: 9, offset: {x: 584.48, y: 233.89}, url: "chestback1.svg", scale: 1},
        {x: 0, y: -1, offset: {x: 0, y: 273}, url: "drawer.svg", scale: 1},
        {x: 0, y: 0, offset: {x: 38, y: 263}, url: "image_6.svg", scale: 1},
        {x: 8, y: 2, offset: {x: 321.25, y: 412.63}, url: "table.svg", scale: 1},
        {x: 8, y: 2, offset: {x: 304.34, y: 461.72}, url: "chairs.svg", scale: 1}
    ],    doors: {
        spawn: {x: 3, y: 9, direction: "left", target: null}
    },
    forbiddenMovements: [
        { xFrom: 5, yFrom: 8, xTo: 5, yTo: 9 },
        { xFrom: 5, yFrom: 9, xTo: 5, yTo: 8 },
    ]
}