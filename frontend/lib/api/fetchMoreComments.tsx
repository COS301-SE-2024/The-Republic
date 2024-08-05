import { UserAlt as User, Comment as CommentType } from "@/lib/types";

const fetchMoreComments = async (
    user: User | null,
    from: number,
    amount: number,
    issueId: number,
    parentCommentId: number | null,
) => {
    const headers: HeadersInit = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${user?.access_token}`
    };

    const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/comments`,
        {
            method: "POST",
            headers,
            body: JSON.stringify({
                from,
                amount,
                issue_id: issueId,
                parent_id: parentCommentId
            }),
        },
    );

    const responseData = await response.json();

    if (responseData.success) {
        return responseData.data as CommentType[];
    } else {
        throw new Error(responseData.error);
    }
};

export { fetchMoreComments };
