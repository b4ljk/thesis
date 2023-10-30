import Image from "next/image";
import HeadingText from "@/components/ui/heading-text";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import { FolderLock, Globe2, Wallet } from "lucide-react";

export type Content = {
  text: string;
  subtext: string;
  image: string | JSX.Element;
};

export type ContentSection = {
  header: string;
  subheader: string;
  image?: string;
  content: Array<Content>;
};

export const featureCards: ContentSection = {
  header: `Давуу талууд`,
  subheader: `Cloudsign ашигласнаар гарах давуу талууд.`,
  content: [
    {
      text: `Хаанаас ч`,
      subtext: `Дэлхийн хаанаас ч хамаагүй ашиглана.`,
      image: <Globe2 strokeWidth={2} size={50} />,
    },
    {
      text: `Найдвартай байдал`,
      subtext: `Таны бичиг баримтыг баталгаажуулна.`,
      image: <FolderLock strokeWidth={2} size={50} />,
    },
    {
      text: `Pay as you go`,
      subtext: `Хэрэглэсэн хэмжээгээ төлнө.`,
      image: <Wallet strokeWidth={2} size={50} />,
    },
  ],
};

export default function FeatureCards() {
  return (
    <section className="bg-slate-100 dark:bg-slate-900">
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
                  <div className="flex flex-1 bg-white">{cards.image}</div>
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
