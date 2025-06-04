import { render, screen } from "@testing-library/react";
import React from "react";
import Hero from "@/components/Hero";

describe("Hero Section", () => {
    it("renders heading and description", () => {
        render(<Hero />);
        expect(
            screen.getByText(/Unlock Your Career Potential/i)
        ).toBeInTheDocument();
        expect(
            screen.getByText(
                /Upload your resume and let AI analyze your strengths, identify gaps, and score job matches instantly./i
            )
        ).toBeInTheDocument();
    });
});
