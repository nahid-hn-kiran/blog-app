import type { Post, PostStatus } from "../../../generated/prisma/client";
import type { PostWhereInput } from "../../../generated/prisma/models";
import { prisma } from "../../lib/prisma";

const createPost = async (
  data: Omit<Post, "id" | "createdAt" | "updatedAt" | "authorId">,
  userId: string,
) => {
  const result = await prisma.post.create({
    data: {
      ...data,
      authorId: userId,
    },
  });
  return result;
};

const getPosts = async ({
  search,
  tags,
  isFeatured,
  status,
  authorId,
}: {
  search: string | undefined;
  tags: string[] | undefined;
  isFeatured: boolean;
  status: PostStatus | undefined;
  authorId: string | undefined;
}) => {
  const andConditions: PostWhereInput[] = [];
  if (search) {
    andConditions.push({
      OR: [
        {
          title: {
            contains: search as string,
            mode: "insensitive",
          },
        },
        {
          content: {
            contains: search as string,
            mode: "insensitive",
          },
        },
        {
          tags: {
            has: search as string,
          },
        },
      ],
    });
  }

  if (tags && tags.length > 0) {
    andConditions.push({
      tags: {
        hasEvery: tags as string[],
      },
    });
  }

  if (isFeatured) {
    andConditions.push({
      isFeatured: true,
    });
  }

  if (status) {
    andConditions.push({
      status,
    });
  }

  if (authorId) {
    andConditions.push({
      authorId,
    });
  }

  const posts = await prisma.post.findMany({
    where: {
      AND: andConditions,
    },
  });
  return posts;
};

const getPostById = async (id: string) => {
  const post = await prisma.post.findUnique({
    where: { id },
  });
  return post;
};

const updatePost = async (id: string, data: Partial<Post>, userId: string) => {
  const post = await prisma.post.update({
    where: { id, authorId: userId },
    data,
  });
  return post;
};

const deletePost = async (id: string, userId: string) => {
  const post = await prisma.post.delete({
    where: { id, authorId: userId },
  });
  return post;
};

export const postService = {
  createPost,
  getPosts,
  getPostById,
  updatePost,
  deletePost,
};
