import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import { MemoryRouter } from "react-router-dom";
import AuthForm from "../AuthForm";

test("renders AuthForm correctly", () => {
  render(
    <MemoryRouter>
      <AuthForm title="Login" buttonText="Login" onSubmit={() => {}} />
    </MemoryRouter>
  );

  expect(screen.getAllByText(/login/i).length).toBeGreaterThan(0); 
  expect(screen.getByLabelText(/username/i)).toBeInTheDocument(); 
  expect(screen.getByLabelText(/password/i)).toBeInTheDocument(); 
  expect(screen.getByRole("button", { name: /login/i })).toBeInTheDocument(); 
});

test("calls onSubmit with username and password", () => {
  const mockSubmit = jest.fn();
  render(
    <MemoryRouter>
      <AuthForm title="Login" buttonText="Login" onSubmit={mockSubmit} />
    </MemoryRouter>
  );

  fireEvent.change(screen.getByLabelText(/username/i), { target: { value: "testuser" } });
  fireEvent.change(screen.getByLabelText(/password/i), { target: { value: "password" } });
  fireEvent.click(screen.getByRole("button", { name: /login/i }));

  expect(mockSubmit).toHaveBeenCalledWith("testuser", "password");
});