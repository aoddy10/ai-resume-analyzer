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
                <p className="font-medium text-lg text-foreground dark:text-foreground">
                    {title}
                </p>
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
        <section className="w-full py-20 bg-muted/50 bg-background text-foreground">
            <div className="container max-w-5xl mx-auto px-4">
                <Card className="shadow-lg dark:bg-muted/70">
                    <CardHeader>
                        <CardTitle className="text-center text-2xl font-semibold">
                            Resume Analyzer in Action
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="flex flex-col gap-6 py-6">
                        <ScreenShotCard
                            title="Home Page"
                            imageUrl="/screenshots/1-homepage.png"
                        />
                        <ScreenShotCard
                            title="Step 1: Upload Resume"
                            imageUrl="/screenshots/2-upload-resume.png"
                        />
                        <ScreenShotCard
                            title="Step 2: Get Resume Feedback"
                            imageUrl="/screenshots/3-get-resume-feedback.png"
                        />
                        <ScreenShotCard
                            title="Step 3: Match with Job Description"
                            imageUrl="/screenshots/4-jd-matcher.png"
                        />
                        <ScreenShotCard
                            title="Step 4: Export Result as PDF"
                            imageUrl="/screenshots/5-pdf-download.png"
                        />
                        <ScreenShotCard
                            title="Step 5: Resume Analysis History"
                            imageUrl="/screenshots/6-analyzer-history.png"
                        />
                    </CardContent>
                </Card>
            </div>
        </section>
    );
}
