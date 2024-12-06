import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { MemoryRouter } from "react-router-dom";
import Homepage from "../homepage/homepage";
import { act } from "react";

// Mock para la función fetch
global.fetch = jest.fn(() =>
  Promise.resolve({
    ok: true,
    json: () => Promise.resolve([{ id: 1, title: "Test Video", user: "User1" }]),
  })
) as jest.Mock;

describe("Homepage Component", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should display videos when fetched successfully", async () => {
    await act(async () => {
      render(
        <MemoryRouter>
          <Homepage />
        </MemoryRouter>
      );
    });

    // Esperar a que los elementos carguen
    const videoTitle = await screen.findByText("Test Video");
    expect(videoTitle).toBeInTheDocument();
  });

  it("should display 'No videos found' when no videos are available", async () => {
    // Modificar el mock de fetch para devolver un array vacío
    (global.fetch as jest.Mock).mockImplementationOnce(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve([]),
      })
    );

    await act(async () => {
      render(
        <MemoryRouter>
          <Homepage />
        </MemoryRouter>
      );
    });

    // Esperar a que se cargue el mensaje de "No videos found"
    const noContentMessage = await screen.findByText("No videos found");
    expect(noContentMessage).toBeInTheDocument();
  });
});