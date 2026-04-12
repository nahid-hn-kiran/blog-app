import express, { Router } from "express";
import { postController } from "./post.controller";
import auth, { UserRole } from "../../middlewares/auth";
const router = express.Router();

router.post("/", auth(UserRole.USER), postController.createPost);
router.get("/", postController.getPosts);
router.get("/:id", postController.getPostById);
router.put("/:id", auth(UserRole.USER), postController.updatePost);
router.delete("/:id", auth(UserRole.USER), postController.deletePost);

export const postRouter: Router = router;
