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
  tags: string[] | [];
  isFeatured: boolean | undefined;
  status: PostStatus | undefined;
  authorId: string | undefined;
}) => {
  const andConditions: PostWhereInput[] = [];

  if (search) {
    andConditions.push({
      OR: [
        {
          title: {
            contains: search,
            mode: "insensitive",
          },
        },
        {
          content: {
            contains: search,
            mode: "insensitive",
          },
        },
        {
          tags: {
            has: search,
          },
        },
      ],
    });
  }

  if (tags.length > 0) {
    andConditions.push({
      tags: {
        hasEvery: tags as string[],
      },
    });
  }

  if (typeof isFeatured === "boolean") {
    andConditions.push({
      isFeatured,
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

  const allPost = await prisma.post.findMany({
    where: {
      AND: andConditions,
    },
  });
  return allPost;
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
