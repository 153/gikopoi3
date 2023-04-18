import { Request, Response } from "express";
import { getAllUsers } from "../../users";
import { retrieveStreamersByRoom } from "../..";

interface PlayerListResponse {
  [roomId: string]: {
    users: number;
    streamers: string[];
  };
}

export default (req: Request, res: Response) => {
  const foundUsers = getAllUsers();

  const rooms = [...new Set(foundUsers.map((u) => u.roomId))];

  // User count by rooms
  const playerListData: PlayerListResponse = rooms.reduce((acc, roomId) => {
    const roomUsers = foundUsers.filter((u) => u.roomId === roomId);

    acc[roomId] = {
      users: roomUsers.length,
      streamers: retrieveStreamersByRoom(roomId),
    };

    return acc;
  }, {} as PlayerListResponse);

  res.json(playerListData);
};
