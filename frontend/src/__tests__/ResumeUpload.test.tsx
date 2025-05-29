import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { act } from "react";
import ResumeUpload from "@/components/ResumeUpload";

// Mock for global fetch (if needed)
global.fetch = jest.fn(() =>
    Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ message: "Uploaded successfully" }),
    })
) as jest.Mock;

beforeEach(() => {
    global.URL.createObjectURL = jest.fn(
        () => "blob:http://localhost/mock-pdf"
    );
});

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
        await act(async () => {
            fireEvent.click(screen.getByRole("button", { name: /submit/i }));
        });
        expect(
            await screen.findByText(/please select a PDF file/i)
        ).toBeInTheDocument();
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

        expect(await screen.findByText("resume.pdf")).toBeInTheDocument();
    });

    it("submits selected file", async () => {
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

        await act(async () => {
            fireEvent.change(screen.getByTestId("file-input"), {
                target: { files: [file] },
            });
            fireEvent.click(screen.getByRole("button", { name: /submit/i }));
        });

        await waitFor(() => {
            expect(mockFetch).toHaveBeenCalledTimes(1);
        });
    });

    it("shows loading indicator while uploading", async () => {
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

        await act(async () => {
            fireEvent.drop(dropZone, { dataTransfer });
        });

        expect(await screen.findByText("resume.pdf")).toBeInTheDocument();
    });
});

it("displays progress bar during upload", async () => {
    render(<ResumeUpload />);
    const file = new File(["dummy content"], "resume.pdf", {
        type: "application/pdf",
    });

    // Mock XMLHttpRequest if used for progress (adjust if using fetch)
    const mockXHR = {
        open: jest.fn(),
        send: jest.fn(),
        setRequestHeader: jest.fn(),
        upload: {
            addEventListener: jest.fn((_, cb) =>
                cb({ lengthComputable: true, loaded: 50, total: 100 })
            ),
        },
        addEventListener: jest.fn((_, cb) => cb()),
        readyState: 4,
        status: 200,
        responseText: JSON.stringify({ message: "Uploaded successfully" }),
    };
});

it("renders PDF preview after file is selected", async () => {
    render(<ResumeUpload />);
    const file = new File(["dummy pdf content"], "resume.pdf", {
        type: "application/pdf",
    });

    await act(async () => {
        fireEvent.change(screen.getByTestId("file-input"), {
            target: { files: [file] },
        });
    });

    expect(await screen.findByTestId("pdf-preview")).toBeInTheDocument();
});

it("displays parsed resume data after upload", async () => {
    const parsedData = {
        name: "John Doe",
        email: "john@example.com",
        skills: ["JavaScript", "React"],
    };

    global.fetch = jest.fn(() =>
        Promise.resolve({
            ok: true,
            json: () => Promise.resolve({ parsed: parsedData }),
        })
    ) as jest.Mock;

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

    expect(await screen.findByText(/john doe/i)).toBeInTheDocument();
    expect(await screen.findByText(/john@example.com/i)).toBeInTheDocument();
    expect(await screen.findByText(/javascript/i)).toBeInTheDocument();
});
