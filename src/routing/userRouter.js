import { Router } from "express";
import authMiddleware from "../middlewares/authMiddleware.js";
import UserController from "../controllers/userController.js";

const userRouter = Router();

userRouter.post("/search", authMiddleware, UserController.search);
userRouter.put("/updatePassword", authMiddleware, UserController.updatePassword);
userRouter.put("/updateName", authMiddleware, UserController.updateName);
userRouter.put("/updateEmail", authMiddleware, UserController.updateEmail);
userRouter.delete("/delete", authMiddleware, UserController.delete);
userRouter.get("/getNameAndEmail", authMiddleware, UserController.getNameAndEmail);
userRouter.post("/getNameById", authMiddleware, UserController.getNameById);

export default userRouter;