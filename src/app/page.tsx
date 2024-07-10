"use client";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Skeleton } from "@/components/ui/skeleton";

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import Autoplay from "embla-carousel-autoplay";
import message from "@/message.json";
// AutoPlay.globalOptions = { delay: 41000 }
export default function Home() {
  // why this thing is not working
  return (
    <main className="flex-grow flex flex-col items-center justify-center px-4 md:px-24 py-12 bg-slate-400 text-white">
      <section className="text-center mb-8 md:mb-12">
        <h1 className="text-3xl md:text-5xl font-bold">
          When one is anonymous, they dare to speak truth
        </h1>
        <p className="mt-3 md:mt-4 text-base md:text-lg">Truth Table</p>
      </section>
      <Carousel
        plugins={[Autoplay({ delay: 2000 })]}
        className="w-full max-w-xs"
      >
        <CarouselContent>
          {message.map((me, index) => (
            <CarouselItem key={index}>
              <div className="p-1">
                <Card>
                  <CardHeader>{me.title}</CardHeader>
                  <CardContent className="flex aspect-square items-center justify-center p-6">
                    <span className="text-2xl text-center font-semibold">
                      {me.content}
                    </span>
                  </CardContent>
                  <CardFooter>{me.received}</CardFooter>
                </Card>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
    </main>
  );
}
