import { Request, Response } from "express";
import IssueService from "../services/issueService";

const issueService = new IssueService();

const handleError = (res: Response, error: unknown) => {
  if (error instanceof Error) {
    res.status(500).json({ error: error.message });
  } else {
    res.status(500).json({ error: "An unknown error occurred" });
  }
};

export const getAllIssues = async (req: Request, res: Response) => {
  try {
    const issues = await issueService.getAllIssues();
    res.status(200).json(issues);
  } catch (error) {
    handleError(res, error);
  }
};

export const getIssueById = async (req: Request, res: Response) => {
  try {
    const issueId = parseInt(req.params.id, 10);
    const issue = await issueService.getIssueById(issueId);
    if (issue) {
      res.status(200).json(issue);
    } else {
      res.status(404).json({ message: "Issue not found" });
    }
  } catch (error) {
    handleError(res, error);
  }
};

export const createIssue = async (req: Request, res: Response) => {
  try {
    const issue = await issueService.createIssue(req.body);
    res.status(201).json(issue);
  } catch (error) {
    handleError(res, error);
  }
};

export const updateIssue = async (req: Request, res: Response) => {
  try {
    const issueId = parseInt(req.params.id, 10);
    const issue = await issueService.updateIssue(issueId, req.body);
    res.status(200).json(issue);
  } catch (error) {
    handleError(res, error);
  }
};

export const deleteIssue = async (req: Request, res: Response) => {
  try {
    const issueId = parseInt(req.params.id, 10);
    await issueService.deleteIssue(issueId);
    res.status(204).send();
  } catch (error) {
    handleError(res, error);
  }
};

export const resolveIssue = async (req: Request, res: Response) => {
  try {
    const issueId = parseInt(req.params.id, 10);
    const issue = await issueService.resolveIssue(issueId);
    res.status(200).json(issue);
  } catch (error) {
    handleError(res, error);
  }
};

export default {
  getAllIssues,
  getIssueById,
  createIssue,
  updateIssue,
  deleteIssue,
  resolveIssue
};
