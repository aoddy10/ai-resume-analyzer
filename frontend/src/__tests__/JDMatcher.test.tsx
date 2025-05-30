import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { act } from "react";
import JDMatcher from "@/components/JDMatcher"; // <— UI component ที่จะสร้าง
import * as sonner from "sonner";

jest.mock("@/api/match", () => ({
    matchJDWithResume: jest.fn(),
}));

import { matchJDWithResume } from "@/api/match";
const mockMatchJDWithResume = matchJDWithResume as jest.Mock;

describe("JDMatcher Component", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("renders JD upload section", () => {
        render(<JDMatcher resumeText="Mock Resume Text" />);
        expect(screen.getByText(/upload job description/i)).toBeInTheDocument();
        expect(
            screen.getByRole("button", { name: /analyze match/i })
        ).toBeInTheDocument();
    });

    it("shows error if no JD file is selected", async () => {
        render(<JDMatcher resumeText="Mock Resume Text" />);
        await act(async () => {
            fireEvent.click(
                screen.getByRole("button", { name: /analyze match/i })
            );
        });

        expect(
            await screen.findByText(/please select a job description PDF/i)
        ).toBeInTheDocument();
    });

    it("calls API and displays match score and gap if successful", async () => {
        const mockResponse = {
            match_score: 84,
            gap_feedback: "Missing: Leadership, Azure experience",
        };

        mockMatchJDWithResume.mockResolvedValueOnce(mockResponse);

        render(<JDMatcher resumeText="Mock Resume Text" />);
        const file = new File(["dummy JD"], "jd.pdf", {
            type: "application/pdf",
        });

        await act(async () => {
            fireEvent.change(screen.getByTestId("jd-file-input"), {
                target: { files: [file] },
            });
            fireEvent.click(
                screen.getByRole("button", { name: /analyze match/i })
            );
        });

        expect(await screen.findByText(/match score/i)).toBeInTheDocument();
        expect(screen.getByText(/84/i)).toBeInTheDocument();
        expect(
            screen.getByText(/missing: leadership, azure/i)
        ).toBeInTheDocument();
    });

    it("shows error toast if API returns error", async () => {
        mockMatchJDWithResume.mockRejectedValueOnce(
            new Error("Mock API error")
        );

        const toastSpy = jest.spyOn(sonner, "toast");

        render(<JDMatcher resumeText="Mock Resume Text" />);
        const file = new File(["dummy JD"], "jd.pdf", {
            type: "application/pdf",
        });

        await act(async () => {
            fireEvent.change(screen.getByTestId("jd-file-input"), {
                target: { files: [file] },
            });
            fireEvent.click(
                screen.getByRole("button", { name: /analyze match/i })
            );
        });

        expect(toastSpy).toHaveBeenCalledWith(
            "Upload Failed",
            expect.objectContaining({
                description: expect.stringContaining(
                    "Error analyzing job description"
                ),
            })
        );
    });

    it("shows loading indicator while uploading", async () => {
        mockMatchJDWithResume.mockImplementation(
            () =>
                new Promise((resolve) => {
                    setTimeout(
                        () =>
                            resolve({ match_score: 80, gap_feedback: "none" }),
                        500
                    );
                })
        );

        render(<JDMatcher resumeText="Mock Resume Text" />);
        const file = new File(["dummy JD"], "jd.pdf", {
            type: "application/pdf",
        });

        await act(async () => {
            fireEvent.change(screen.getByTestId("jd-file-input"), {
                target: { files: [file] },
            });
            fireEvent.click(
                screen.getByRole("button", { name: /analyze match/i })
            );
        });

        expect(screen.getByTestId("loading-indicator")).toBeInTheDocument();
        await waitFor(() => screen.getByText(/match score/i));
    });
});
