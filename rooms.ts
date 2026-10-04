import { Room, DynamicRoom } from "./types";
import { getCurrentAnnualEvents } from "./annualevents";
import { BarRoom } from "./static/roomcode/bar";
import { WarroomRoom } from "./static/roomcode/warroom";
import { AdminStRoom } from "./static/roomcode/admin_st";
import { BasementRoom } from "./static/roomcode/basement";
import { AdminRoom } from "./static/roomcode/admin";
import { AdminOldRoom } from "./static/roomcode/admin_old";
import { RadioBackstageRoom } from "./static/roomcode/radio_backstage";
import { SchoolStRoom } from "./static/roomcode/school_st";
import { BarStRoom } from "./static/roomcode/bar_st";
import { TakadaiRoom } from "./static/roomcode/takadai";
import { SiloRoom } from "./static/roomcode/silo";
import { BadendRoom } from "./static/roomcode/badend";
import { YoshinoyaRoom } from "./static/roomcode/yoshinoya";
import { LongStRoom } from "./static/roomcode/long_st";
import { BarGikoRoom } from "./static/roomcode/bar_giko";
import { JinjaRoom } from "./static/roomcode/jinja";
import { BusstopRoom } from "./static/roomcode/busstop";
import { Izakaya774Room } from "./static/roomcode/izakaya774";
import { BarGikoSquareRoom } from "./static/roomcode/bar_giko_square";
import { BarGiko2Room } from "./static/roomcode/bar_giko2";
import { RadioRoom1Room } from "./static/roomcode/radio_room1";
import { RadioRoom2Room } from "./static/roomcode/radio_room2";
import { RadioRoom3Room } from "./static/roomcode/radio_room3";
import { RadioRoom } from "./static/roomcode/radio";
import { RadioGakuyaRoom } from "./static/roomcode/radio_gakuya";
import { JinjaStRoom } from "./static/roomcode/jinja_st";
import { EnkaiRoom } from "./static/roomcode/enkai";
import { IdoARoom } from "./static/roomcode/idoA";
import { IdoBRoom } from "./static/roomcode/idoB";
import { AdminBarRoom } from "./static/roomcode/admin_bar";
import { Bar774Room } from "./static/roomcode/bar774";
import { YataiRoom } from "./static/roomcode/yatai";
import { SchoolRoukaRoom } from "./static/roomcode/school_rouka";
import { SchoolRoom } from "./static/roomcode/school";
import { SchoolInternationalRoom } from "./static/roomcode/school_international";
import { SchoolPcRoom } from "./static/roomcode/school_pc";
import { SchoolGroundRoom } from "./static/roomcode/school_ground";
import { KaidanRoom } from "./static/roomcode/kaidan";
import { SeashoreRoom } from "./static/roomcode/seashore";
import { DenshaRoom } from "./static/roomcode/densha";
import { GraveRoom } from "./static/roomcode/grave";
import { TempleRoom } from "./static/roomcode/temple";
import { LibraryRoom } from "./static/roomcode/library";
import { GammonRoom } from "./static/roomcode/gammon";
import { PachinkoRoom } from "./static/roomcode/pachinko";
import { LoungeRoom } from "./static/roomcode/lounge";
import { GymRoom } from "./static/roomcode/gym";
import { LabyrinthRoom } from "./static/roomcode/labyrinth";
import { NerdOfficeRoom } from "./static/roomcode/nerd_office";
import { MeganeyaRoom } from "./static/roomcode/meganeya";
import { TaiikukanRoom } from "./static/roomcode/taiikukan";
import { KyougijouRoom } from "./static/roomcode/kyougijou";
import { KaraokeBoxRoom } from "./static/roomcode/karaoke_box";
import { HellRoom } from "./static/roomcode/hell";
import { HotaruRoomRoom } from "./static/roomcode/hotaru_room";
import { VaporMallRoom } from "./static/roomcode/vapor_mall";
import { BarGikoSquareV2Room } from "./static/roomcode/bar_giko_square_v2";
import { CafeStRoom } from "./static/roomcode/cafe_st";
import { KonbiniRoom } from "./static/roomcode/konbini";
import { IroriRoom } from "./static/roomcode/irori";
import { RiverRoom } from "./static/roomcode/river";
import { YaneuraRoom } from "./static/roomcode/yaneura";
import { MonachatRoom } from "./static/roomcode/monachat";
import { YojouhanRoom } from "./static/roomcode/yojouhan";
import { YaneRoom } from "./static/roomcode/yane";

export const rooms: { [roomId: string]: Room } = {
    "bar": BarRoom,
    "admin_st": AdminStRoom,
    "basement": BasementRoom,
    "admin": AdminRoom,
    "admin_old": AdminOldRoom,
    "radio_backstage": RadioBackstageRoom,
    "school_st": SchoolStRoom,
    "bar_st": BarStRoom,
    "takadai": TakadaiRoom,
    "silo": SiloRoom,
    "badend": BadendRoom,
    "yoshinoya": YoshinoyaRoom,
    "long_st": LongStRoom,
    "bar_giko": BarGikoRoom,
    "jinja": JinjaRoom,
    "busstop": BusstopRoom,
    "izakaya774": Izakaya774Room,
    "bar_giko_square": BarGikoSquareRoom,
    "bar_giko2": BarGiko2Room,
    "radio_room1": RadioRoom1Room,
    "radio_room2": RadioRoom2Room,
    "radio_room3": RadioRoom3Room,
    "radio": RadioRoom,
    "radio_gakuya": RadioGakuyaRoom,
    "jinja_st": JinjaStRoom,
    "enkai": EnkaiRoom,
    "idoA": IdoARoom,
    "idoB": IdoBRoom,
    "admin_bar": AdminBarRoom,
    "bar774": Bar774Room,
    "yatai": YataiRoom,
    "school_rouka": SchoolRoukaRoom,
    "school": SchoolRoom,
    "school_international": SchoolInternationalRoom,
    "school_pc": SchoolPcRoom,
    "school_ground": SchoolGroundRoom,
    "kaidan": KaidanRoom,
    "seashore": SeashoreRoom,
    "densha": DenshaRoom,
    "grave": GraveRoom,
    "temple": TempleRoom,
    "library": LibraryRoom,
    "gammon": GammonRoom,
    "pachinko": PachinkoRoom,
    "warroom": WarroomRoom,
    "lounge": LoungeRoom,
    "gym": GymRoom,
    "labyrinth": LabyrinthRoom,
    "nerd_office": NerdOfficeRoom,
    "meganeya": MeganeyaRoom,
    "taiikukan": TaiikukanRoom,
    "kyougijou": KyougijouRoom,
    "karaoke_box": KaraokeBoxRoom,
    "hell": HellRoom,
    "hotaru_room": HotaruRoomRoom,
    "vapor_mall": VaporMallRoom,
    "bar_giko_square_v2": BarGikoSquareV2Room,
};

export const dynamicRooms: DynamicRoom[] = [
    CafeStRoom,
    KonbiniRoom,
    IroriRoom,
    RiverRoom,
    YaneuraRoom,
    MonachatRoom,
    YojouhanRoom,
    YaneRoom,
];

const currentAnnualEvents = getCurrentAnnualEvents();
dynamicRooms.forEach(dynamicRoom => {
    rooms[dynamicRoom.roomId] = dynamicRoom.build(currentAnnualEvents, currentAnnualEvents, []);
});
