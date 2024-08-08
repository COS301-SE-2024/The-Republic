import React from "react";
import { render } from "@testing-library/react";
import IssueModal from "@/components/IssueModal/IssueModal";

test("renders IssueModal without crashing", () => {
  render(<IssueModal />);
});
