import type { Request, Response } from "express";
import { postService } from "./post.service";
import type { PostStatus } from "../../../generated/prisma/enums";

const createPost = async (req: Request, res: Response) => {
  try {
    const user = req.user;
    if (!user) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    const post = await postService.createPost(req.body, user.id as string);
    res.status(201).json(post);
  } catch (error) {
    res.status(500).json({ error: "Failed to create post" });
  }
};

const getPosts = async (req: Request, res: Response) => {
  try {
    const search = req.query.search as string | undefined;
    const tags = req.query.tags ? req.query.tags.toString().split(",") : [];
    const isFeatured = req.query.isFeatured === "true";
    const status = req.query.status as PostStatus | undefined;
    const authorId = req.query.authorId as string | undefined;

    const result = await postService.getPosts({
      search,
      tags,
      isFeatured,
      status,
      authorId,
    });
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ error: "Failed to get posts" });
  }
};

const getPostById = async (req: Request, res: Response) => {
  try {
    const post = await postService.getPostById(req.params.id as string);
    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }
    res.json(post);
  } catch (error) {
    res.status(500).json({ error: "Failed to get post" });
  }
};

const updatePost = async (req: Request, res: Response) => {
  try {
    const user = req.user;
    if (!user) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    const post = await postService.updatePost(
      req.params.id as string,
      req.body,
      user.id as string,
    );
    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }
    res.json(post);
  } catch (error) {
    res.status(500).json({ error: "Failed to update post" });
  }
};

const deletePost = async (req: Request, res: Response) => {
  try {
    const user = req.user;
    if (!user) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    const post = await postService.deletePost(
      req.params.id as string,
      user.id as string,
    );
    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }
    res.json({ message: "Post deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete post" });
  }
};

export const postController = {
  createPost,
  getPosts,
  getPostById,
  updatePost,
  deletePost,
};
