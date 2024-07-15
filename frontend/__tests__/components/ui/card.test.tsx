import React from "react";
import { render, screen } from "@testing-library/react";
import { describe, expect } from "@jest/globals";
import {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";

jest.mock("@supabase/supabase-js", () => ({
  createClient: jest.fn().mockReturnValue({
    auth: {
      signIn: jest.fn().mockResolvedValue({
        user: { id: "user-id" },
        session: "session-token",
        error: null,
      }),
    },
    from: jest.fn(() => ({
      select: jest.fn().mockResolvedValue({ data: [], error: null }),
      insert: jest.fn().mockResolvedValue({ data: [], error: null }),
    })),
  }),
}));

describe("Card Component", () => {
  it("renders the Card component", () => {
    render(<Card data-testid="card">Card Content</Card>);
    const card = screen.getByTestId("card");
    expect(card).toBeInTheDocument();
  });

  it("applies custom className to Card", () => {
    render(
      <Card className="custom-class" data-testid="card">
        Card Content
      </Card>,
    );
    const card = screen.getByTestId("card");
    expect(card).toHaveClass("custom-class");
  });

  it("renders the CardHeader component", () => {
    render(<CardHeader data-testid="card-header">Header Content</CardHeader>);
    const cardHeader = screen.getByTestId("card-header");
    expect(cardHeader).toBeInTheDocument();
  });

  it("applies custom className to CardHeader", () => {
    render(
      <CardHeader className="custom-class" data-testid="card-header">
        Header Content
      </CardHeader>,
    );
    const cardHeader = screen.getByTestId("card-header");
    expect(cardHeader).toHaveClass("custom-class");
  });

  it("renders the CardTitle component", () => {
    render(<CardTitle data-testid="card-title">Title Content</CardTitle>);
    const cardTitle = screen.getByTestId("card-title");
    expect(cardTitle).toBeInTheDocument();
  });

  it("applies custom className to CardTitle", () => {
    render(
      <CardTitle className="custom-class" data-testid="card-title">
        Title Content
      </CardTitle>,
    );
    const cardTitle = screen.getByTestId("card-title");
    expect(cardTitle).toHaveClass("custom-class");
  });

  it("renders the CardDescription component", () => {
    render(
      <CardDescription data-testid="card-description">
        Description Content
      </CardDescription>,
    );
    const cardDescription = screen.getByTestId("card-description");
    expect(cardDescription).toBeInTheDocument();
  });

  it("applies custom className to CardDescription", () => {
    render(
      <CardDescription className="custom-class" data-testid="card-description">
        Description Content
      </CardDescription>,
    );
    const cardDescription = screen.getByTestId("card-description");
    expect(cardDescription).toHaveClass("custom-class");
  });

  it("renders the CardContent component", () => {
    render(<CardContent data-testid="card-content">Content</CardContent>);
    const cardContent = screen.getByTestId("card-content");
    expect(cardContent).toBeInTheDocument();
  });

  it("applies custom className to CardContent", () => {
    render(
      <CardContent className="custom-class" data-testid="card-content">
        Content
      </CardContent>,
    );
    const cardContent = screen.getByTestId("card-content");
    expect(cardContent).toHaveClass("custom-class");
  });

  it("renders the CardFooter component", () => {
    render(<CardFooter data-testid="card-footer">Footer Content</CardFooter>);
    const cardFooter = screen.getByTestId("card-footer");
    expect(cardFooter).toBeInTheDocument();
  });

  it("applies custom className to CardFooter", () => {
    render(
      <CardFooter className="custom-class" data-testid="card-footer">
        Footer Content
      </CardFooter>,
    );
    const cardFooter = screen.getByTestId("card-footer");
    expect(cardFooter).toHaveClass("custom-class");
  });
});
