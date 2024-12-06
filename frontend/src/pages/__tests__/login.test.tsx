import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import Login from "../auth-pages/login";

const mockFetch = jest.fn();
global.fetch = mockFetch;

describe("Login Component", () => {
  beforeEach(() => {
    mockFetch.mockClear();
  });

  it("renders the login form", () => {
    render(
      <MemoryRouter>
        <AuthContext.Provider value={{ login: jest.fn(), user: null, logout: jest.fn() }}>
          <Login />
        </AuthContext.Provider>
      </MemoryRouter>
    );

    expect(screen.getByText("Login")).toBeInTheDocument();
    expect(screen.getByLabelText("Username:")).toBeInTheDocument();
    expect(screen.getByLabelText("Password:")).toBeInTheDocument();
    expect(screen.getByText("Login")).toBeInTheDocument();
  });

  it("displays error message when login fails", async () => {
    mockFetch.mockResolvedValueOnce({ ok: false, text: async () => "Invalid credentials" });

    render(
      <MemoryRouter>
        <AuthContext.Provider value={{ login: jest.fn(), user: null, logout: jest.fn() }}>
          <Login />
        </AuthContext.Provider>
      </MemoryRouter>
    );

    fireEvent.change(screen.getByLabelText("Username:"), { target: { value: "testUser" } });
    fireEvent.change(screen.getByLabelText("Password:"), { target: { value: "wrongPassword" } });
    fireEvent.click(screen.getByText("Login"));

    await waitFor(() => expect(screen.getByText("Invalid credentials")).toBeInTheDocument());
  });

  it("navigates to home page on successful login", async () => {
    const mockLogin = jest.fn();
    mockFetch.mockResolvedValueOnce({ ok: true });

    render(
      <MemoryRouter>
        <AuthContext.Provider value={{ login: mockLogin, user: null, logout: jest.fn() }}>
          <Login />
        </AuthContext.Provider>
      </MemoryRouter>
    );

    fireEvent.change(screen.getByLabelText("Username:"), { target: { value: "testUser" } });
    fireEvent.change(screen.getByLabelText("Password:"), { target: { value: "correctPassword" } });
    fireEvent.click(screen.getByText("Login"));

    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalledWith("testUser");
    });
  });

  it("displays error message on network error", async () => {
    mockFetch.mockRejectedValueOnce(new Error("Network error"));

    render(
      <MemoryRouter>
        <AuthContext.Provider value={{ login: jest.fn(), user: null, logout: jest.fn() }}>
          <Login />
        </AuthContext.Provider>
      </MemoryRouter>
    );

    fireEvent.change(screen.getByLabelText("Username:"), { target: { value: "testUser" } });
    fireEvent.change(screen.getByLabelText("Password:"), { target: { value: "anyPassword" } });
    fireEvent.click(screen.getByText("Login"));

    await waitFor(() => expect(screen.getByText("An error occurred while logging in. Please try again.")).toBeInTheDocument());
  });
});