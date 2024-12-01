import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { MemoryRouter } from "react-router-dom";
import Header from "../Header";
import { AuthProvider } from "../../context/AuthContext";

// Mock getEnv to return a dummy environment variable
jest.mock("../../utils/Env", () => ({
  getEnv: () => ({
    VITE_API_URL: "http://localhost:3000"
  })
}));

test("renders Header with Pro Tube logo and navigation buttons", () => {
  render(
    <MemoryRouter>
      <AuthProvider>
        <Header />
      </AuthProvider>
    </MemoryRouter>
  );

  expect(screen.getByText(/pro tube/i)).toBeInTheDocument();
  expect(screen.getByRole("link", { name: /log in/i })).toBeInTheDocument();
  expect(screen.getByRole("link", { name: /register/i })).toBeInTheDocument();
});