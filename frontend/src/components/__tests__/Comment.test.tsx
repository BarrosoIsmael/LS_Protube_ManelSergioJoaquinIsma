import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import Comment from "../Comment";

test("renders Comment correctly", () => {
  const comment = { text: "This is a test comment" };
  render(<Comment comment={comment} index={0} comments={[]} setComments={() => {}} />);

  expect(screen.getByText(/this is a test comment/i)).toBeInTheDocument();
});