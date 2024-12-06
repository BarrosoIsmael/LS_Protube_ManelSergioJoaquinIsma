import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { MemoryRouter } from "react-router-dom";
import Menu from "../Menu";

test("renders Menu with login and register buttons", () => {
  render(
    <MemoryRouter>
      <Menu />
    </MemoryRouter>
  );

  expect(screen.getByRole("link", { name: /log in/i })).toBeInTheDocument();
  expect(screen.getByRole("link", { name: /register/i })).toBeInTheDocument();
});