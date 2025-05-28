import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

type FeatureCardProps = {
    icon: LucideIcon;
    title: string;
    description: string;
};

export default function FeatureCard({
    icon: Icon,
    title,
    description,
}: FeatureCardProps) {
    return (
        <div className="flex flex-col items-start rounded-xl border p-6 shadow-sm transition hover:shadow-md bg-white text-left">
            <div className="mb-4 rounded-full bg-gray-100 p-3">
                <Icon className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
            <p className="mt-2 text-sm text-muted-foreground">{description}</p>
        </div>
    );
}
