import { Router } from "express";
import authMiddleware from "../middlewares/authMiddleware.js";
import LikeController from "../controllers/LikeController.js";

const likeRouter = Router();

likeRouter.post("/like", authMiddleware, LikeController.like);
likeRouter.delete("/dislike", authMiddleware, LikeController.dislike);

export default likeRouter;