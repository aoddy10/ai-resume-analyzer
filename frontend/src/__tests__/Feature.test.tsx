import React from "react";
import { render, screen } from "@testing-library/react";
import Feature from "@/components/Feature";

describe("Feature Section", () => {
    it("renders all feature cards with icons, titles, and descriptions", () => {
        render(<Feature />);

        // Titles
        expect(screen.getByText("Smart PDF Parsing")).toBeInTheDocument();
        expect(screen.getByText("AI Feedback")).toBeInTheDocument();
        expect(screen.getByText("Job Match Scoring")).toBeInTheDocument();

        // Descriptions
        expect(
            screen.getByText(
                "Extract clean, structured resume content from any PDF with high accuracy."
            )
        ).toBeInTheDocument();
        expect(
            screen.getByText(
                "Receive personalized tips to improve clarity, tone, and impact."
            )
        ).toBeInTheDocument();
        expect(
            screen.getByText(
                "Get instant compatibility scores between your resume and job descriptions."
            )
        ).toBeInTheDocument();

        // Icons should be present (by test id since Lucide icons render as SVG without explicit roles)
        const icons = screen.getAllByTestId("feature-icon");
        expect(icons.length).toBeGreaterThanOrEqual(3);
    });
});
