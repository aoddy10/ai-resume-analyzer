import React from "react";
import { render, screen } from "@testing-library/react";
import FeatureCard from "@/components/FeatureCard";
import { FileText } from "lucide-react";

describe("FeatureCard", () => {
    it("renders icon, title, and description", () => {
        render(
            <FeatureCard
                icon={FileText}
                title="Test Feature"
                description="This is a description for the feature."
            />
        );

        expect(screen.getByText("Test Feature")).toBeInTheDocument();
        expect(
            screen.getByText("This is a description for the feature.")
        ).toBeInTheDocument();
        expect(screen.getByTestId("feature-icon")).toBeInTheDocument(); // icon render check
    });
});
