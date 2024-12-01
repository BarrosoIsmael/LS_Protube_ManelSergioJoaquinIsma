import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Login from "../auth-pages/login";

test("renders Login page with AuthForm", () => {
  render(
    <MemoryRouter>
      <Login />
    </MemoryRouter>
  );

  expect(screen.getByText(/login/i)).toBeInTheDocument();
  expect(screen.getByRole("button", { name: /login/i })).toBeInTheDocument();
});
