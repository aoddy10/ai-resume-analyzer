"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Hero() {
    return (
        <section className="w-full bg-gradient-to-b from-white to-gray-50 py-20 md:py-28">
            <div className="container mx-auto max-w-screen-lg px-4 text-center">
                <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-gray-900">
                    Unlock Your Career Potential
                </h1>
                <p className="mt-6 text-lg text-muted-foreground max-w-2xl mx-auto">
                    Upload your resume and let AI analyze your strengths,
                    identify gaps, and score job matches instantly.
                </p>
                <div className="mt-8 flex justify-center gap-4 flex-wrap">
                    <Link href="/analyzer">
                        <Button size="lg">Try resume analyzer</Button>
                    </Link>
                    <Button variant="outline" size="lg">
                        Learn More
                    </Button>
                </div>
            </div>
        </section>
    );
}
