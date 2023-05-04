import { Post } from "@prisma/client";
import { GetServerSideProps } from "next";
import Head from "next/head";
import { FormEvent } from "react";
import { prisma } from "./lib/prisma";

export const getServerSideProps: GetServerSideProps = async () => {
  const data = await prisma.post.findMany();
  const posts = data.map((p) => ({
    ...p,
    createdAt: p.createdAt.toISOString(),
  }));

  return {
    props: {
      posts,
    },
  };
};

interface HomeProps {
  posts: Post[];
}

export default function Home({ posts }: HomeProps) {
  const onSubmitPost = async (ev: FormEvent) => {
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
    } catch (err) {
      console.log(err);
    }
  };
  return (
    <div>
      <Head>
        <title>TCC | Home</title>
      </Head>
      <main className="p-20 flex flex-col md:flex-row gap-20">
        <form onSubmit={onSubmitPost} className="md:w-1/2">
          <div className="space-y-12">
            <div className="border-b border-gray-900/10 pb-12">
              <h2 className="text-base font-semibold leading-7 text-gray-900">
                Coleta de dados
              </h2>
              <p className="mt-1 text-sm leading-6 text-gray-600">
                Joga os dados aí Paulete
              </p>

              <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                <div className="col-span-4">
                  <label
                    htmlFor="username"
                    className="block text-sm font-medium leading-6 text-gray-900"
                  >
                    Username
                  </label>
                  <div className="mt-2">
                    <div className="p-1 flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 ">
                      <input
                        required
                        type="text"
                        name="username"
                        id="username"
                        autoComplete="username"
                        className="block flex-1 border-0 bg-transparent py-1.5 pl-1 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                        placeholder="alex.evernever"
                      />
                    </div>
                  </div>
                </div>
                <div className="col-span-2">
                  <label
                    htmlFor="createdAt"
                    className="block text-sm font-medium leading-6 text-gray-900"
                  >
                    Data
                  </label>
                  <div className="mt-2">
                    <div className="p-1 flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 ">
                      <input
                        required
                        type="date"
                        name="createdAt"
                        id="createdAt"
                        autoComplete="createdAt"
                        className="block flex-1 border-0 bg-transparent py-1.5 pl-1 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                        placeholder="alex.evernever"
                      />
                    </div>
                  </div>
                </div>

                <div className="col-span-full">
                  <label
                    htmlFor="comment"
                    className="block text-sm font-medium leading-6 text-gray-900"
                  >
                    Comentário
                  </label>
                  <div className="mt-2">
                    <textarea
                      required
                      id="comment"
                      name="comment"
                      rows={3}
                      className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                      defaultValue={""}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 flex items-center justify-end gap-x-6">
            <button
              type="button"
              className="text-sm font-semibold leading-6 text-gray-900"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              Salvar
            </button>
          </div>
        </form>
        <div className="md:w-1/2">
          <h1>Posts ({posts.length})</h1>
          <ul
            role="list"
            className="divide-y divide-gray-100 max-h-[70vh] overflow-auto p-5 "
          >
            {posts.map((post) => (
              <li key={post.id} className="flex justify-between gap-x-6 py-5">
                <div className="flex gap-x-4">
                  <div className="min-w-0 flex-auto">
                    <p className="text-sm font-semibold leading-6 text-gray-900">
                      {post.username}
                    </p>
                    <p className="mt-1 break-words text-xs leading-5 text-gray-500 max-w-[500px]">
                      {post.comment}
                    </p>
                  </div>
                </div>
                <div className="hidden sm:flex sm:flex-col sm:items-end">
                  <p className="text-sm leading-6 text-gray-900">
                    {new Date(post.createdAt).toLocaleDateString("pt-BR")}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </main>
    </div>
  );
}
