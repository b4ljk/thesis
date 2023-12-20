/* eslint-disable @typescript-eslint/no-misused-promises */
import { signIn, signOut, useSession } from "next-auth/react";
import Head from "next/head";
import HeroHeader from "~/components/pages/home";
import FeatureCards from "~/components/pages/home/feature-cards";

export default function Home() {
  return (
    <div className="flex w-full">
      <Head>
        <title>
          CloudSign - Mongolian First Cloud-Based Digital Signature Service
        </title>
        <meta
          name="description"
          content="CloudSign is the first cloud-based digital signature service in Mongolia. Secure, efficient, and accessible anywhere."
        />

        {/* Add these for better SEO */}
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta
          name="keywords"
          content="CloudSign, Digital Signature, Cloud-Based, Mongolia, Secure Signature, Accessible Signature"
        />
        <meta charSet="UTF-8" />

        {/* These are for social media previews */}
        <meta
          property="og:title"
          content="CloudSign - Mongolia's First Cloud-Based Digital Signature Service"
        />
        <meta
          property="og:description"
          content="CloudSign is the first cloud-based digital signature service in Mongolia. Secure, efficient, and accessible anywhere."
        />
        <meta property="og:image" content="/public/cloud.png" />
        <meta property="og:url" content="https://sign.arbitration.mn" />

        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex-1">
        <HeroHeader />
        <FeatureCards />
      </main>
    </div>
  );
}
