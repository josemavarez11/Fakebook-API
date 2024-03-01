import { Router } from "express";
import authMiddleware from "../middlewares/authMiddleware.js";
import FavoriteController from "../controllers/FavoriteController.js";

const favoriteRouter = Router();

favoriteRouter.post("/add", authMiddleware, FavoriteController.add);
favoriteRouter.delete("/remove", authMiddleware, FavoriteController.remove);

export default favoriteRouter;