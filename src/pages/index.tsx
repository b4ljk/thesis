/* eslint-disable @typescript-eslint/no-misused-promises */
import { signIn, signOut, useSession } from "next-auth/react";
import Head from "next/head";

import { api } from "~/utils/api";
import { type ChangeEvent, useState } from "react";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { downloadFileFromS3, uploadToSignedUrl } from "~/lib/awsHelper";
import HeroHeader from "~/components/pages/home";
import FeatureCards from "~/components/pages/home/feature-cards";

const bucketName = "thesis-cloudsign";

export default function Home() {
  // const hello = api.example.hello.useQuery({ text: "hello world" });
  const preSign = api.s3Router.getSignedUrl.useMutation();

  const downloadPdf = () => {
    window.open(`/api/signing/download?filename=tailan.pdf`);
  };

  return (
    <div className="flex w-full">
      <Head>
        <title>CloudSign</title>
        <meta name="description" content="Generated by create-t3-app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex-1 ">
        <HeroHeader />
        <FeatureCards />
      </main>
    </div>
  );
}

// function AuthShowcase() {
//   const { data: sessionData } = useSession();

//   const { data: secretMessage } = api.example.getSecretMessage.useQuery(
//     undefined, // no input
//     { enabled: sessionData?.user !== undefined },
//   );

//   return (
//     <div className="flex flex-col items-center justify-center gap-4">
//       <p className="text-center text-2xl text-white">
//         {sessionData && <span>Logged in as {sessionData.user?.name}</span>}
//         {secretMessage && <span> - {secretMessage}</span>}
//       </p>
//       <button
//         className="rounded-full bg-white/10 px-10 py-3 font-semibold text-white no-underline transition hover:bg-white/20"
//         onClick={sessionData ? () => void signOut() : () => void signIn()}
//       >
//         {sessionData ? "Sign out" : "Sign in"}
//       </button>
//     </div>
//   );
// }
