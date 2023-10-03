import { signIn, signOut, useSession } from "next-auth/react";
import Head from "next/head";
import Link from "next/link";
import Center from "~/components/ui/center";
import { Input } from "@/components/ui/input";

import { api } from "~/utils/api";
import { useState } from "react";
import { decryptMessage, encryptMessage } from "~/utils/encryption";
import { Label } from "~/components/ui/label";

export default function Home() {
  const hello = api.example.hello.useQuery({ text: "from tRPC" });
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [key, setKey] = useState("");

  const encryptionHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    const encrypted = encryptMessage(e.target.value, key);
    setOutput(encrypted);
    setInput(e.target.value);
  };

  const decrypted = decryptMessage(output, key);

  return (
    <div className="flex min-h-screen w-full bg-purple-200">
      <Head>
        <title>Create T3 App</title>
        <meta name="description" content="Generated by create-t3-app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex flex-1">
        <Center>
          <div className="grid grid-cols-2 gap-2">
            <Input placeholder="input" onChange={encryptionHandler} />
            <Input placeholder="key" onChange={(e) => setKey(e.target.value)} />
            <Input
              className="col-span-2"
              value={output}
              disabled
              placeholder="output"
            />
            <Input
              className="col-span-2"
              value={decrypted}
              disabled
              placeholder="output"
            />
            <div className="col-span-2 grid w-full max-w-sm items-center gap-1.5">
              <Label htmlFor="picture">Picture</Label>
              <Input id="picture" type="file" />
            </div>
          </div>
        </Center>
      </main>
    </div>
  );
}

function AuthShowcase() {
  const { data: sessionData } = useSession();

  const { data: secretMessage } = api.example.getSecretMessage.useQuery(
    undefined, // no input
    { enabled: sessionData?.user !== undefined },
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
