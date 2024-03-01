import { Router } from "express";
import commentRouter from "./commentRouter.js";
import favoriteRouter from "./favoriteRouter.js";
import friendRouter from "./friendRouter.js";
import likeRouter from "./likeRouter.js";
import postRouter from "./postRouter.js";
import userRouter from "./userRouter.js";
import authRouter from "./authRouter.js";

const router = Router();

router.use('/auth', authRouter);
router.use('/comments', commentRouter);
router.use('/favorites', favoriteRouter);
router.use('/friends', friendRouter);
router.use('/likes', likeRouter);
router.use('/posts', postRouter);
router.use('/users', userRouter);

export default router;