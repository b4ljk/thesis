import Image from "next/image";
import HeadingText from "@/components/ui/heading-text";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";

export type Content = {
  text: string;
  subtext: string;
  image: string;
};

export type ContentSection = {
  header: string;
  subheader: string;
  image?: string;
  content: Array<Content>;
};

export const featureCards: ContentSection = {
  header: `Powered by`,
  subheader: `What makes Next Landing possible`,
  content: [
    {
      text: `Next.js`,
      subtext: `The React Framework`,
      image: `/next.svg`,
    },
    {
      text: `shadcn/ui`,
      subtext: `Beautifully designed components`,
      image: `/shadcn-ui.svg`,
    },
    {
      text: `Vercel`,
      subtext: `Develop. Preview. Ship.`,
      image: `/vercel.svg`,
    },
  ],
};

export default function FeatureCards() {
  return (
    <section className="bg-slate-50 dark:bg-slate-900">
      <div className="container space-y-8 py-12 text-center lg:py-20">
        {featureCards.header || featureCards.subheader ? (
          <HeadingText subtext={featureCards.subheader}>
            {featureCards.header}
          </HeadingText>
        ) : null}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {featureCards.content.map((cards) => (
            <Card
              key={cards.text}
              className="flex flex-grow flex-col items-center justify-between gap-4 p-8 dark:bg-secondary"
            >
              {cards.image !== "" ? (
                <div className="flex items-center justify-center">
                  <div className="flex flex-1 bg-white">
                    <Image
                      src={cards.image}
                      width={100}
                      height={100}
                      alt="Card image"
                    />
                  </div>
                </div>
              ) : (
                <></>
              )}
              <div className="space-y-2">
                <CardTitle>{cards.text}</CardTitle>
                <CardDescription>{cards.subtext}</CardDescription>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
