import { Router } from "express";
import authMiddleware from "../middlewares/authMiddleware.js";
import PostController from "../controllers/PostController.js";

const postRouter = Router();

postRouter.get("/getFavorites", authMiddleware, PostController.getFavorites);
postRouter.get("/getByFriends", authMiddleware, PostController.getByFriends);
postRouter.get("/getAll",  authMiddleware, PostController.getAll);
postRouter.delete("/delete/:postId", authMiddleware, PostController.delete);
postRouter.post("/create", authMiddleware, PostController.create);
postRouter.put("/updateBody", authMiddleware, PostController.updateBody);
postRouter.put("/updateImages", authMiddleware, PostController.updateImages);

export default postRouter;