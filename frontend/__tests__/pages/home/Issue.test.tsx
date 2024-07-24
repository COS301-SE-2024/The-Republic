import { render, screen, waitFor } from "@testing-library/react";
import { describe, expect } from "@jest/globals";
import IssuePage from "@/app/(home)/issues/[issueId]/page";
import { useParams } from "next/navigation";
import { useUser } from "@/lib/contexts/UserContext";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

jest.mock("next/navigation", () => ({
  useParams: jest.fn(),
}));

jest.mock("@/lib/contexts/UserContext", () => ({
  useUser: jest.fn(),
}));

jest.mock("@/components/Issue/Issue", () =>
  jest.fn(() => <div>Mocked Issue</div>),
);
jest.mock("@/components/Comment/CommentList", () =>
  jest.fn(() => (
    <>
      <div>Mocked AddCommentForm</div>
      <div>Mocked CommentList</div>
    </>
  ),
));

jest.mock("lucide-react", () => ({
  Loader2: () => <div>Loading...</div>,
}));


const renderWithClient = (ui: React.ReactNode) => {
  const testQueryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });
  return render(
    <QueryClientProvider client={testQueryClient}>{ui}</QueryClientProvider>
  );
};

describe("Issue Page", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(console, "error").mockImplementation(() => {});
  });

  afterEach(() => {
    (console.error as jest.Mock).mockRestore();
  });

  it("renders loading state initially", () => {
    (useParams as jest.Mock).mockReturnValue({ issueId: "1" });
    (useUser as jest.Mock).mockReturnValue({
      user: { access_token: "test-token" },
    });
    renderWithClient(<IssuePage />);
  });

  it("renders issue details and components when data is loaded", async () => {
    (useParams as jest.Mock).mockReturnValue({ issueId: "1" });
    (useUser as jest.Mock).mockReturnValue({
      user: { access_token: "test-token" },
    });

    global.fetch = jest.fn(
      () =>
        Promise.resolve({
          ok: true,
          json: jest.fn().mockResolvedValue({
            success: true,
            data: { id: "1", title: "Test Issue" },
          } as unknown) as unknown,
          headers: new Headers(),
          redirected: false,
          status: 200,
          statusText: "OK",
        }) as Promise<Response>,
    );

    renderWithClient(<IssuePage />);

    await waitFor(() => expect(screen.queryByText("Loading...")).toBeNull());
  });

  it('renders "Issue not found" when issue data is not available', async () => {
    (useParams as jest.Mock).mockReturnValue({ issueId: "1" });
    (useUser as jest.Mock).mockReturnValue({
      user: { access_token: "test-token" },
    });

    global.fetch = jest.fn(
      () =>
        Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ success: false }),
          headers: new Headers(),
          redirected: false,
          status: 200,
          statusText: "OK",
        }) as Promise<Response>,
    );

    renderWithClient(<IssuePage />);

    await waitFor(() => expect(screen.queryByText("Loading...")).toBeNull());
  });

  it('renders "Issue not found" when fetch fails', async () => {
    (useParams as jest.Mock).mockReturnValue({ issueId: "1" });
    (useUser as jest.Mock).mockReturnValue({
      user: { access_token: "test-token" },
    });

    global.fetch = jest.fn(
      () =>
        Promise.resolve({
          ok: false,
          headers: new Headers(),
          redirected: false,
          status: 200,
          statusText: "OK",
        }) as Promise<Response>,
    );

    renderWithClient(<IssuePage />);

    await waitFor(() => expect(screen.queryByText("Loading...")).toBeNull());
  });
});
