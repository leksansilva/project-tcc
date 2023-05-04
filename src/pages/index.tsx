import Form from "@/components/Form";
import List from "@/components/List";
import { prisma } from "@/lib/prisma";
import { Post } from "@prisma/client";
import { GetServerSideProps } from "next";
import Head from "next/head";
import { FormEvent, useState } from "react";

export const getServerSideProps: GetServerSideProps = async () => {
  const data = await prisma.post.findMany();
  const posts = data.map((p) => ({
    ...p,
    createdAt: p.createdAt.toISOString(),
  }));

  return {
    props: {
      data: posts,
    },
  };
};

interface HomeProps {
  data: Post[];
}

export default function Home({ data }: HomeProps) {
  const [posts, setPosts] = useState<Post[]>(data);
  const [loading, setLoading] = useState(false);

  const onSubmitPost = async (ev: FormEvent) => {
    ev.preventDefault();
    setLoading(true);
    const data = new FormData(ev.currentTarget as HTMLFormElement);
    const username = data.get("username") as string;
    const comment = data.get("comment") as string;
    const createdAt = new Date(data.get("createdAt") as string).toJSON();
    if (!username || !comment || !createdAt) return;
    try {
      const result = await fetch("api/posts/create", {
        method: "POST",
        body: JSON.stringify({
          username,
          comment,
          createdAt,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      });
      const jsonData = await result.json();
      console.log(jsonData);
      setPosts((prev) => [...prev, jsonData]);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };
  return (
    <div>
      <Head>
        <title>TCC | Home</title>
      </Head>
      <main className="p-20 flex flex-col md:flex-row gap-20">
        <Form loading={loading} onSubmit={onSubmitPost} />
        <List loading={loading} posts={posts} />
      </main>
    </div>
  );
}
