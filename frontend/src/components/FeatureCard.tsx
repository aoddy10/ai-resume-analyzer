import { LucideIcon } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

type FeatureCardProps = {
    icon: LucideIcon;
    title: string;
    description: string;
    variant?: "default" | "outline";
};

export default function FeatureCard({
    icon: Icon,
    title,
    description,
    variant = "default",
}: FeatureCardProps) {
    return (
        <Card
            className={`text-left hover:shadow-md transition ${
                variant === "outline" ? "border border-gray-300" : ""
            }`}
        >
            <CardHeader className="flex flex-row items-center gap-4">
                <div className="rounded-full bg-gray-100 p-3">
                    <Icon
                        className="h-6 w-6 text-primary"
                        data-testid="feature-icon"
                    />
                </div>
                <CardTitle className="text-lg font-semibold text-gray-900">
                    {title}
                </CardTitle>
            </CardHeader>
            <CardContent>
                <p className="text-sm text-muted-foreground">{description}</p>
            </CardContent>
        </Card>
    );
}
