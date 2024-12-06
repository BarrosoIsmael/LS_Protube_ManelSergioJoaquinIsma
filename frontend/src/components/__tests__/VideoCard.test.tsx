import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import { MemoryRouter } from "react-router-dom";
import VideoCard from "../video-card/VideoCard";

jest.mock("../../utils/Env", () => ({
  getEnv: () => ({
    VITE_API_URL: "http://localhost:3000"
  })
}));

const mockNavigate = jest.fn();
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockNavigate,
}));

test("renders VideoCard correctly and handles click", () => {
  render(
    <MemoryRouter>
      <VideoCard title="Test Video" user="Test User" id="1" />
    </MemoryRouter>
  );

  expect(screen.getByText(/test video/i)).toBeInTheDocument();
  expect(screen.getByText(/test user/i)).toBeInTheDocument();

  fireEvent.click(screen.getByText(/test video/i));
  expect(mockNavigate).toHaveBeenCalledWith("/video/1");
});