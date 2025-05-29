import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import ResumeUpload from "@/components/ResumeUpload";

// Mock for global fetch (if needed)
global.fetch = jest.fn(() =>
    Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ message: "Uploaded successfully" }),
    })
) as jest.Mock;

describe("ResumeUpload Section", () => {
    it("renders upload section", () => {
        render(<ResumeUpload />);
        expect(screen.getByText(/upload your resume/i)).toBeInTheDocument();
        expect(
            screen.getByRole("button", { name: /submit/i })
        ).toBeInTheDocument();
    });

    it("shows error if no file selected", async () => {
        render(<ResumeUpload />);
        fireEvent.click(screen.getByRole("button", { name: /submit/i }));
        expect(
            await screen.findByText(/please select a PDF file/i)
        ).toBeInTheDocument();
    });

    it("accepts and previews uploaded file", async () => {
        render(<ResumeUpload />);
        const file = new File(["dummy content"], "resume.pdf", {
            type: "application/pdf",
        });
        const input = screen.getByTestId("file-input") as HTMLInputElement;
        fireEvent.change(input, { target: { files: [file] } });
        expect(await screen.findByText("resume.pdf")).toBeInTheDocument();
    });

    it("submits selected file", async () => {
        render(<ResumeUpload />);
        const file = new File(["dummy content"], "resume.pdf", {
            type: "application/pdf",
        });
        const input = screen.getByTestId("file-input") as HTMLInputElement;
        fireEvent.change(input, { target: { files: [file] } });
        fireEvent.click(screen.getByRole("button", { name: /submit/i }));

        await waitFor(() => {
            expect(
                screen.getByText(/uploaded successfully/i)
            ).toBeInTheDocument();
        });
    });

    it("calls backend API when file is submitted", async () => {
        const mockFetch = jest.fn(() =>
            Promise.resolve({
                ok: true,
                json: () =>
                    Promise.resolve({ message: "Uploaded successfully" }),
            })
        );
        global.fetch = mockFetch as jest.Mock;

        render(<ResumeUpload />);
        const file = new File(["dummy content"], "resume.pdf", {
            type: "application/pdf",
        });
        fireEvent.change(screen.getByTestId("file-input"), {
            target: { files: [file] },
        });
        fireEvent.click(screen.getByRole("button", { name: /submit/i }));

        await waitFor(() => {
            expect(mockFetch).toHaveBeenCalledTimes(1);
        });
    });

    it("shows loading indicator while uploading", async () => {
        render(<ResumeUpload />);
        const file = new File(["dummy content"], "resume.pdf", {
            type: "application/pdf",
        });
        fireEvent.change(screen.getByTestId("file-input"), {
            target: { files: [file] },
        });
        fireEvent.click(screen.getByRole("button", { name: /submit/i }));

        expect(screen.getByTestId("loading-indicator")).toBeInTheDocument();

        await waitFor(() => {
            expect(
                screen.getByText(/uploaded successfully/i)
            ).toBeInTheDocument();
        });
    });

    it("handles file drop via drag & drop", async () => {
        render(<ResumeUpload />);
        const file = new File(["dummy content"], "resume.pdf", {
            type: "application/pdf",
        });

        const dropZone = screen.getByTestId("drop-zone");
        const dataTransfer = {
            files: [file],
            items: [],
            types: ["Files"],
            getData: () => "",
        };

        fireEvent.drop(dropZone, { dataTransfer });

        expect(await screen.findByText("resume.pdf")).toBeInTheDocument();
    });
});
