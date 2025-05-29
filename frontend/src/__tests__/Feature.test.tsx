import React from "react";
import { render, screen } from "@testing-library/react";
import Feature from "@/components/Feature";

describe("Feature Section", () => {
    it("renders all feature cards", () => {
        render(<Feature />);
        expect(screen.getByText(/Smart PDF Parsing/i)).toBeInTheDocument();
        expect(screen.getByText(/AI Feedback/i)).toBeInTheDocument();
        expect(screen.getByText(/Job Match Scoring/i)).toBeInTheDocument();
    });
});
