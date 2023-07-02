import { Button, Switch, TextInput } from "@mantine/core";
import { signIn, signOut, useSession } from "next-auth/react";
import Head from "next/head";
import Link from "next/link";
import { Page } from "~/components/Page";
import { api } from "~/utils/api";

export default function Home() {
  const hello = api.example.hello.useQuery({ text: "from tRPC" });

  return (
    <Page>
      <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#026d47] to-[#152c29]">
        <div className="flex h-screen w-screen max-w-screen-xl flex-col justify-center gap-6 px-4 py-16 ">
          <h1 className="text-5xl font-extrabold tracking-tight text-white sm:text-[5rem]">
            Atharo.
          </h1>
          <div className="flex w-full flex-1 gap-4">
            <div className="relative flex flex-1 flex-col p-4">
              <div className="absolute bottom-0 left-0 right-0 top-0 rounded-lg bg-black opacity-40" />
              <div className="flex-1"></div>
              <div className="flex">
                <TextInput className="mr-4 flex-1" />
                <Button>Send</Button>
              </div>
            </div>
            <div className="flex flex-col gap-4">
              <div>
                <div className="flex max-w-xs flex-col gap-4 rounded-xl bg-white/10 p-4 text-white ">
                  <h3 className="text-2xl font-bold">
                    Featured Plugin: Weather
                  </h3>
                  <div className="text-lg">
                    Get the current weather in a given location
                  </div>
                  <div>
                    <Switch label="Enable" />
                  </div>
                </div>
              </div>
              <Link
                className="flex max-w-xs flex-col gap-4 rounded-xl bg-white/10 p-4 text-white hover:bg-white/20"
                href="https://create.t3.gg/en/introduction"
                target="_blank"
              >
                <h3 className="text-2xl font-bold">Browse all plugins →</h3>
                <div className="text-lg">
                  Install plugins so your Atharo can do even more!
                </div>
              </Link>
            </div>
          </div>
        </div>
        {/* <Link
          className="flex max-w-xs flex-col gap-4 rounded-xl bg-white/10 p-4 text-white hover:bg-white/20"
          href="https://create.t3.gg/en/introduction"
          target="_blank"
        >
          <h3 className="text-2xl font-bold">Documentation →</h3>
          <div className="text-lg">
            Learn more about Create T3 App, the libraries it uses, and how to
            deploy it.
          </div>
        </Link> */}
        {/* <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-8"> */}
        {/* <Link
              className="flex max-w-xs flex-col gap-4 rounded-xl bg-white/10 p-4 text-white hover:bg-white/20"
              href="https://create.t3.gg/en/usage/first-steps"
              target="_blank"
            >
              <h3 className="text-2xl font-bold">Weather →</h3>
              <div className="text-md">
                Get the current weather in a given location.
              </div>
              <div>
                ""
              </div>
            </Link>
            <Link
              className="flex max-w-xs flex-col gap-4 rounded-xl bg-white/10 p-4 text-white hover:bg-white/20"
              href="https://create.t3.gg/en/introduction"
              target="_blank"
            >
              <h3 className="text-2xl font-bold">Documentation →</h3>
              <div className="text-lg">
                Learn more about Create T3 App, the libraries it uses, and how
                to deploy it.
              </div>
            </Link>
          </div>
          <div className="flex flex-col items-center gap-2">
            <p className="text-2xl text-white">
              {hello.data ? hello.data.greeting : "Loading tRPC query..."}
            </p>
            <AuthShowcase />
          </div> */}
      </main>
    </Page>
  );
}

function AuthShowcase() {
  const { data: sessionData } = useSession();

  const { data: secretMessage } = api.example.getSecretMessage.useQuery(
    undefined, // no input
    { enabled: sessionData?.user !== undefined }
  );

  return (
    <div className="flex flex-col items-center justify-center gap-4">
      <p className="text-center text-2xl text-white">
        {sessionData && <span>Logged in as {sessionData.user?.name}</span>}
        {secretMessage && <span> - {secretMessage}</span>}
      </p>
      <button
        className="rounded-full bg-white/10 px-10 py-3 font-semibold text-white no-underline transition hover:bg-white/20"
        onClick={sessionData ? () => void signOut() : () => void signIn()}
      >
        {sessionData ? "Sign out" : "Sign in"}
      </button>
    </div>
  );
}
