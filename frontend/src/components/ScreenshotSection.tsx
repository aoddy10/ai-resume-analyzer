"use client";

import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type ScreenShotCardProps = {
    title: string;
    imageUrl: string;
};

const ScreenShotCard: React.FC<ScreenShotCardProps> = ({ title, imageUrl }) => {
    return (
        <Card className="flex flex-col md:flex-row items-center gap-4 shadow-md p-4">
            <div className="flex-1">
                <p className="font-medium text-lg">{title}</p>
            </div>
            <div className="flex-shrink-0 max-w-[600px] w-full">
                <Image
                    src={imageUrl}
                    alt={title}
                    width={600}
                    height={400}
                    className="rounded-lg shadow-md w-full h-auto"
                />
            </div>
        </Card>
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
                    <CardContent className="flex flex-col gap-6 py-6">
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
