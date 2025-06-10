import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { act } from "react";
import ResumeUpload from "@/components/ResumeUpload";

global.URL.createObjectURL = jest.fn(() => "blob:http://localhost/mock-pdf");
window.HTMLElement.prototype.scrollIntoView = jest.fn();

jest.mock("@/api/upload", () => {
    return {
        uploadResume: jest.fn(),
    };
});

import { uploadResume } from "@/api/upload";
const mockUploadResume = uploadResume as jest.Mock;

describe("ResumeUpload Component", () => {
    beforeEach(() => {
        jest.clearAllMocks();
        mockUploadResume.mockImplementation(
            () =>
                new Promise((resolve) => {
                    setTimeout(() => {
                        resolve({
                            filename: "resume.pdf",
                            resume_text: "Example text",
                            gpt_feedback: "This is the feedback",
                        });
                    }, 500); // delay to allow isLoading state to render
                })
        );
    });

    it("renders the upload section", () => {
        render(<ResumeUpload />);
        expect(screen.getByText(/upload your resume/i)).toBeInTheDocument();
        expect(
            screen.getByRole("button", { name: /submit/i })
        ).toBeInTheDocument();
    });

    it("shows error if no file is selected", async () => {
        render(<ResumeUpload />);
        await act(async () => {
            fireEvent.click(screen.getByRole("button", { name: /submit/i }));
        });
        const errors = await screen.findAllByText(/please select a PDF file/i);
        expect(errors.length).toBeGreaterThan(0);
    });

    it("accepts and previews uploaded file", async () => {
        render(<ResumeUpload />);
        const file = new File(["dummy content"], "resume.pdf", {
            type: "application/pdf",
        });

        await act(async () => {
            fireEvent.change(screen.getByTestId("file-input"), {
                target: { files: [file] },
            });
        });

        expect(screen.getByTestId("pdf-preview")).toBeInTheDocument();
    });

    it("displays PDF preview after file is selected", async () => {
        render(<ResumeUpload />);
        const file = new File(["dummy pdf"], "resume.pdf", {
            type: "application/pdf",
        });

        await act(async () => {
            fireEvent.change(screen.getByTestId("file-input"), {
                target: { files: [file] },
            });
        });

        expect(await screen.findByTestId("pdf-preview")).toBeInTheDocument();
    });

    it("shows loading indicator and progress bar during upload", async () => {
        render(<ResumeUpload />);
        const file = new File(["dummy"], "resume.pdf", {
            type: "application/pdf",
        });

        await act(async () => {
            fireEvent.change(screen.getByTestId("file-input"), {
                target: { files: [file] },
            });
            fireEvent.click(screen.getByRole("button", { name: /submit/i }));
        });

        await waitFor(() => {
            expect(screen.getByRole("progressbar")).toBeInTheDocument();
        });
    });

    it("displays parsed resume data after successful upload", async () => {
        render(<ResumeUpload />);
        const file = new File(["dummy content"], "resume.pdf", {
            type: "application/pdf",
        });

        await act(async () => {
            fireEvent.change(screen.getByTestId("file-input"), {
                target: { files: [file] },
            });
            fireEvent.click(screen.getByRole("button", { name: /submit/i }));
        });

        expect(
            await screen.findByText(/resume analysis result/i)
        ).toBeInTheDocument();
        expect(await screen.findByText(/filename:/i)).toBeInTheDocument();
        expect(await screen.findByText(/Resume Feedback/i)).toBeInTheDocument();
        expect(
            await screen.findByText("This is the feedback")
        ).toBeInTheDocument();
    });

    it("shows error message if upload fails", async () => {
        mockUploadResume.mockRejectedValueOnce(new Error("Upload failed"));

        render(<ResumeUpload />);
        const file = new File(["dummy"], "resume.pdf", {
            type: "application/pdf",
        });

        await act(async () => {
            fireEvent.change(screen.getByTestId("file-input"), {
                target: { files: [file] },
            });
            fireEvent.click(screen.getByRole("button", { name: /submit/i }));
        });

        expect(await screen.findByText(/upload failed/i)).toBeInTheDocument();
    });
});
