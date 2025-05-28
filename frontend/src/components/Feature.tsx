"use client";

import { FileText, Sparkles, Target } from "lucide-react";
import FeatureCard from "@/components/FeatureCard";

export default function Feature() {
    return (
        <section className="w-full bg-white py-20 md:py-28">
            <div className="container mx-auto max-w-screen-lg px-4 text-center">
                <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-gray-900">
                    Powerful Resume Tools
                </h2>
                <p className="mt-4 text-muted-foreground max-w-2xl mx-auto">
                    Explore our smart features to boost your job application
                    success.
                </p>

                <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-10">
                    <FeatureCard
                        icon={FileText}
                        title="Smart PDF Parsing"
                        description="Extract clean, structured resume content from any PDF with high accuracy."
                    />
                    <FeatureCard
                        icon={Sparkles}
                        title="AI Feedback"
                        description="Receive personalized tips to improve clarity, tone, and impact."
                    />
                    <FeatureCard
                        icon={Target}
                        title="Job Match Scoring"
                        description="Get instant compatibility scores between your resume and job descriptions."
                    />
                </div>
            </div>
        </section>
    );
}
