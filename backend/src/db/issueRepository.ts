import Issue from "../models/issue";
import supabase from "../services/supabaseClient";

export default class IssueRepository {
  async getAllIssues(): Promise<any[]> {
    const { data, error } = await supabase
      .from("issue")
      .select(`
        *,
        user: user_id (
          user_id,
          email_address,
          username,
          fullname,
          image_url
        ),
        category: category_id (
          name
        )
      `)
      .order("created_at", { ascending: false });
    if (error) throw new Error(error.message);
    return data as any[];
  }

  async getIssueById(issueId: number): Promise<Issue | null> {
    const { data, error } = await supabase
      .from("issue")
      .select(`
        *,
        user: user_id (
          user_id,
          email_address,
          username,
          fullname,
          image_url
        ),
        category: category_id (
          name
        )
      `)
      .eq("issue_id", issueId)
      .single();
    if (error) throw new Error(error.message);
    return data as Issue | null;
  }

  async createIssue(issue: Partial<Issue>): Promise<Issue> {
    const { data, error } = await supabase
      .from("issue")
      .insert(issue)
      .select()
      .single();
    if (error) throw new Error(error.message);
    return data as Issue;
  }

  async updateIssue(issueId: number, issue: Partial<Issue>): Promise<Issue> {
    const { data, error } = await supabase
      .from("issue")
      .update(issue)
      .eq("issue_id", issueId)
      .single();
    if (error) throw new Error(error.message);
    return data as Issue;
  }

  async deleteIssue(issueId: number): Promise<void> {
    const { error } = await supabase
      .from("issue")
      .delete()
      .eq("issue_id", issueId);
    if (error) throw new Error(error.message);
  }
}
