import { render, screen, fireEvent } from "@testing-library/react";
import AuthForm from "../AuthForm";

test("renders AuthForm correctly", () => {
  render(<AuthForm title="Login" buttonText="Login" onSubmit={() => {}} />);

  expect(screen.getByText(/login/i)).toBeInTheDocument(); 
  expect(screen.getByLabelText(/username/i)).toBeInTheDocument(); 
  expect(screen.getByLabelText(/password/i)).toBeInTheDocument(); 
  expect(screen.getByRole("button", { name: /login/i })).toBeInTheDocument(); 
});

test("calls onSubmit with username and password", () => {
  const mockSubmit = jest.fn();
  render(<AuthForm title="Login" buttonText="Login" onSubmit={mockSubmit} />);

  fireEvent.change(screen.getByLabelText(/username/i), { target: { value: "testuser" } });
  fireEvent.change(screen.getByLabelText(/password/i), { target: { value: "password" } });
  fireEvent.click(screen.getByRole("button", { name: /login/i }));

  expect(mockSubmit).toHaveBeenCalledWith("testuser", "password");
});
