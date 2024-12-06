import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import Register from "../auth-pages/register";

const mockFetch = jest.fn();
global.fetch = mockFetch;

describe("Register Component", () => {
  beforeEach(() => {
    mockFetch.mockClear();
  });

  it("renders the register form", () => {
    render(
      <MemoryRouter>
        <AuthContext.Provider value={{ login: jest.fn(), user: null, logout: jest.fn() }}>
          <Register />
        </AuthContext.Provider>
      </MemoryRouter>
    );

    expect(screen.getByText("Register")).toBeInTheDocument();
    expect(screen.getByLabelText("Username:")).toBeInTheDocument();
    expect(screen.getByLabelText("Password:")).toBeInTheDocument();
    expect(screen.getByText("Register")).toBeInTheDocument();
  });

  it("displays error message when registration fails", async () => {
    mockFetch.mockResolvedValueOnce({ ok: false, text: async () => "Username already taken" });

    render(
      <MemoryRouter>
        <AuthContext.Provider value={{ login: jest.fn(), user: null, logout: jest.fn() }}>
          <Register />
        </AuthContext.Provider>
      </MemoryRouter>
    );

    fireEvent.change(screen.getByLabelText("Username:"), { target: { value: "testUser" } });
    fireEvent.change(screen.getByLabelText("Password:"), { target: { value: "testPassword" } });
    fireEvent.click(screen.getByText("Register"));

    await waitFor(() => expect(screen.getByText("Username already taken")).toBeInTheDocument());
  });

  it("navigates to home page on successful registration", async () => {
    const mockLogin = jest.fn();
    mockFetch.mockResolvedValueOnce({ ok: true });

    render(
      <MemoryRouter>
        <AuthContext.Provider value={{ login: mockLogin, user: null, logout: jest.fn() }}>
          <Register />
        </AuthContext.Provider>
      </MemoryRouter>
    );

    fireEvent.change(screen.getByLabelText("Username:"), { target: { value: "testUser" } });
    fireEvent.change(screen.getByLabelText("Password:"), { target: { value: "testPassword" } });
    fireEvent.click(screen.getByText("Register"));

    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalledWith("testUser");
    });
  });

  it("displays error message on network error", async () => {
    mockFetch.mockRejectedValueOnce(new Error("Network error"));

    render(
      <MemoryRouter>
        <AuthContext.Provider value={{ login: jest.fn(), user: null, logout: jest.fn() }}>
          <Register />
        </AuthContext.Provider>
      </MemoryRouter>
    );

    fireEvent.change(screen.getByLabelText("Username:"), { target: { value: "testUser" } });
    fireEvent.change(screen.getByLabelText("Password:"), { target: { value: "testPassword" } });
    fireEvent.click(screen.getByText("Register"));

    await waitFor(() => expect(screen.getByText("An error occurred while registering. Please try again.")).toBeInTheDocument());
  });
});