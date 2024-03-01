import { Router } from "express";
import authMiddleware from "../middlewares/authMiddleware.js";
import CommentController from "../controllers/commentController.js";

const commentRouter = Router();

commentRouter.post("/create", authMiddleware, CommentController.create);
commentRouter.post("/getAll", authMiddleware, CommentController.getAll);

export default commentRouter;