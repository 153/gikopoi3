import { Room, Coordinates, DynamicRoom } from "../../types";
import { coordRange } from "../../utils";

export const YojouhanRoom: DynamicRoom = {
    roomId: "yojouhan",
    subscribedAnnualEvents: ["noKotatsu", "yesKotatsu"],
    build: (currentAnnualEvents: string[]) =>
    {
        const variant = currentAnnualEvents.includes("noKotatsu") ? "no_kotatsu" : "yes_kotatsu";
        const scale = 0.7
        const room: Room = {
              id: "yojouhan",
              group: "gikopoipoi",
              variant: variant,
              scale: scale,
              backgroundColor: "#000000",
              size: {x: 6, y: 6},
              originCoordinates: {x: 0, y: 260},
              spawnPoint: "door",
              backgroundImageUrl: `rooms/yojouhan/background.${variant}.svg`,
              objects: [],
              sit: [],
              blocked: [
                       { x: 0, y: 0},
                   { x: 0, y: 1},
                   { x: 0, y: 2},
                   { x: 0, y: 3},
                   { x: 0, y: 4},
                   { x: 0, y: 5},
                   { x: 1, y: 5},
                   { x: 2, y: 5},
                   { x: 3, y: 5},
               ],
               forbiddenMovements: [],
               doors: {
               door: {x:5, y:5, direction: "down", target: {roomId: "bar_giko_square", doorId: "left"}}
               },
               streamSlotCount: 4,
          }

          if (variant == "yes_kotatsu")
          {
        room.objects.push({ x:4, y:1, scale: 0.7, offset: {x:190, y:280}, url: "kotatsu.svg"})
        room.blocked = room.blocked.concat([
        {x: 3, y: 1},
        {x: 3, y: 2},
        {x: 4, y: 1},
        {x: 4, y: 2},
        ]);
        room.sit = room.sit.concat([
        {x: 5, y: 1},
        {x: 5, y: 2},
        {x: 3, y: 0},
        {x: 4, y: 0},
        {x: 4, y: 3},
        {x: 3, y: 3},
        {x: 2, y: 2},
        {x: 2, y: 3},
        ])}
             else
    {
        room.sit = room.sit.concat([
        {x: 2, y: 1},
        {x: 3, y: 1},
        {x: 4, y: 1},
        {x: 2, y: 2},
        {x: 3, y: 2},
        {x: 4, y: 2},
        {x: 2, y: 3},
        {x: 3, y: 3},
        {x: 4, y: 3},
        ])
        }
        return room
        }
        };
