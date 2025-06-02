"use client";

import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type ScreenShotCardProps = {
    title: string;
    imageUrl: string;
};

const ScreenShotCard: React.FC<ScreenShotCardProps> = ({ title, imageUrl }) => {
    return (
        <div className="w-full">
            <p className="mb-2">{title}</p>
            <Image
                src={imageUrl}
                alt={title}
                width={800}
                height={600}
                className="rounded-lg shadow-lg"
            />
        </div>
    );
};

export default function ScreenshotSection() {
    return (
        <section className="w-full py-20 bg-muted/50">
            <div className="container max-w-5xl mx-auto px-4">
                <Card className="shadow-lg">
                    <CardHeader>
                        <CardTitle className="text-center text-2xl font-semibold">
                            Resume Analyzer in Action
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="flex flex-col gap-8">
                        <ScreenShotCard
                            title="Step 1: Upload Resume"
                            imageUrl="/screenshots/step1-upload-resume.png"
                        />
                        <ScreenShotCard
                            title="Step 2: Get Resume Feedback"
                            imageUrl="/screenshots/step2-get-resume-feedback.png"
                        />
                        <ScreenShotCard
                            title="Step 3: Get Gap Analysis and Suggestions"
                            imageUrl="/screenshots/step3-get-gap-feedback.png"
                        />
                    </CardContent>
                </Card>
            </div>
        </section>
    );
}
