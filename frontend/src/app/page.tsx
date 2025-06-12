import Feature from "@/components/Feature";
import Hero from "@/components/Hero";
import ScreenshotSection from "@/components/ScreenshotSection";

export default function Home() {
    return (
        <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen px-4 py-8 pb-20 gap-16 sm:px-6 md:px-8 bg-background text-foreground">
            <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start w-full">
                <Hero />

                <Feature />

                <ScreenshotSection />
            </main>
        </div>
    );
}
