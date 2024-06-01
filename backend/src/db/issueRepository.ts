import { Issue } from '../models/issue';

import supabase from '../supabaseClient'

export class IssueRepository {
    async getAllIssues(): Promise<Issue[]> {
      const { data, error } = await supabase.from('issue').select('*');
      if (error) throw new Error(error.message);
      return data as Issue[];
    }
  
    async getIssueById(issueId: number): Promise<Issue | null> {
      const { data, error } = await supabase.from('issue').select('*').eq('issue_id', issueId).single();
      if (error) throw new Error(error.message);
      return data as Issue | null;
    }
  
    async createIssue(issue: Partial<Issue>): Promise<Issue> {
      const { data, error } = await supabase.from('issue').insert([issue]).single();
      if (error) throw new Error(error.message);
      return data as Issue;
    }
  
    async updateIssue(issueId: number, issue: Partial<Issue>): Promise<Issue> {
      const { data, error } = await supabase.from('issue').update(issue).eq('issue_id', issueId).single();
      if (error) throw new Error(error.message);
      return data as Issue;
    }
  
    async deleteIssue(issueId: number): Promise<void> {
      const { error } = await supabase.from('issue').delete().eq('issue_id', issueId);
      if (error) throw new Error(error.message);
    }
  }