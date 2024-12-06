import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import { MemoryRouter, Route, Routes, useNavigate } from "react-router-dom";
import Login from "../auth-pages/login";
import { AuthContext, AuthProvider } from "../../context/AuthContext";

// Mock para la función fetch
global.fetch = jest.fn(() =>
  Promise.resolve({
    ok: true,
    text: () => Promise.resolve("Login successful"),
  })
) as jest.Mock;

jest.mock('react-router-dom', () => {
  const originalModule = jest.requireActual('react-router-dom');
  return {
    ...originalModule,
    useNavigate: jest.fn(),
  };
});

describe("Login Component", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should login successfully and navigate to home", async () => {
    const mockLogin = jest.fn();
    const mockNavigate = jest.fn();
    (useNavigate as jest.Mock).mockImplementation(() => mockNavigate);

    render(
      <AuthContext.Provider value={{ login: mockLogin, user: null, logout: jest.fn() }}>
        <MemoryRouter initialEntries={["/login"]}>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/" element={<div>Home</div>} />
          </Routes>
        </MemoryRouter>
      </AuthContext.Provider>
    );

    fireEvent.change(screen.getByLabelText(/username/i), {
      target: { value: "testuser" },
    });
    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: "password" },
    });
    fireEvent.click(screen.getAllByText(/login/i)[1]); // Usar el segundo elemento con el texto "login"

    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalledWith("testuser");
      expect(mockNavigate).toHaveBeenCalledWith("/");
    });
  });

  it("should display an error message on failed login", async () => {
    (global.fetch as jest.Mock).mockImplementationOnce(() =>
      Promise.resolve({
        ok: false,
        text: () => Promise.resolve("Invalid credentials"),
      })
    );

    render(
      <AuthProvider>
        <MemoryRouter initialEntries={["/login"]}>
          <Login />
        </MemoryRouter>
      </AuthProvider>
    );

    fireEvent.change(screen.getByLabelText(/username/i), {
      target: { value: "wronguser" },
    });
    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: "wrongpassword" },
    });
    fireEvent.click(screen.getAllByText(/login/i)[1]); // Usar el segundo elemento con el texto "login"

    const errorMessage = await screen.findByText("Invalid credentials");
    expect(errorMessage).toBeInTheDocument();
  });
});