import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import ScrollToTopButton from "../ScrollToTopButton";

beforeAll(() => {
  window.scrollTo = jest.fn();
});

test("renders ScrollToTopButton and handles click", () => {
  render(<ScrollToTopButton />);


  fireEvent.scroll(window, { target: { scrollY: 200 } });
  expect(screen.getByLabelText(/scroll back to top/i)).toBeInTheDocument();


  fireEvent.click(screen.getByLabelText(/scroll back to top/i));
  expect(window.scrollTo).toHaveBeenCalledWith({ top: 0, behavior: "smooth" });
});