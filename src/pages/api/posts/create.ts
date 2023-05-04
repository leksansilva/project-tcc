import { prisma } from "@/lib/prisma";
import { Post } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { username, comment, createdAt } = req.body as Post;

  const post = await prisma.post.create({
    data: {
      username,
      comment,
      createdAt,
    },
  });

  return res.status(201).json(post);
}
