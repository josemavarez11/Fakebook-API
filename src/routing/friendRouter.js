import { Router } from "express";
import authMiddleware from "../middlewares/authMiddleware.js";
import FriendController from "../controllers/friendController.js";

const friendRouter = Router();

friendRouter.post("/sendRequest", authMiddleware, FriendController.sendRequest);
friendRouter.put("/answerRequest", authMiddleware, FriendController.answerRequest);
friendRouter.get("/getRequests", authMiddleware, FriendController.getRequests);

export default friendRouter;