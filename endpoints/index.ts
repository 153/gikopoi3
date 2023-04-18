import { Application } from "express";
import players from "./players";

const registerEndpoints = (app: Application) => {
  app.get("/players", players);
};

export default registerEndpoints;
