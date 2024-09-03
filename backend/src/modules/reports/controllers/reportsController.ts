import { Request, Response } from "express";
import { sendResponse } from "@/utilities/response";
import { APIResponse } from "@/types/response";
import ReportsService from "@/modules/reports/services/reportsService";
import { cacheMiddleware } from "@/middleware/cacheMiddleware";

const reportsService = new ReportsService();

export const getAllIssuesGroupedByResolutionStatus = [
  cacheMiddleware(300),
  async (req: Request, res: Response) => {
    try {
      const response = await reportsService.getAllIssuesGroupedByResolutionStatus(
        req.body,
      );
      sendResponse(res, response);
    } catch (error) {
      sendResponse(res, error as APIResponse);
    }
  }
];

export const getIssueCountsGroupedByResolutionStatus = [
  cacheMiddleware(300),
  async (req: Request, res: Response) => {
    try {
      const response =
        await reportsService.getIssueCountsGroupedByResolutionStatus(req.body);
      sendResponse(res, response);
    } catch (error) {
      sendResponse(res, error as APIResponse);
    }
  }
];

export const getIssueCountsGroupedByResolutionAndCategory = [
  cacheMiddleware(300),
  async (req: Request, res: Response) => {
    try {
      const response =
        await reportsService.getIssueCountsGroupedByResolutionAndCategory(
          req.body,
        );
      sendResponse(res, response);
    } catch (error) {
      sendResponse(res, error as APIResponse);
    }
  }
];

export const getIssuesGroupedByCreatedAt = [
  cacheMiddleware(300),
  async (req: Request, res: Response) => {
    try {
      const response = await reportsService.getIssuesGroupedByCreatedAt(req.body);
      sendResponse(res, response);
    } catch (error) {
      sendResponse(res, error as APIResponse);
    }
  }
];

export const getIssuesGroupedByCategory = [
  cacheMiddleware(300),
  async (req: Request, res: Response) => {
    try {
      const response = await reportsService.getIssuesGroupedByCategory(req.body);
      sendResponse(res, response);
    } catch (error) {
      sendResponse(res, error as APIResponse);
    }
  }
];

export const getIssuesCountGroupedByCategoryAndCreatedAt = [
  cacheMiddleware(300),
  async (req: Request, res: Response) => {
    try {
      const response =
        await reportsService.getIssuesCountGroupedByCategoryAndCreatedAt(
          req.body,
        );
      sendResponse(res, response);
    } catch (error) {
      sendResponse(res, error as APIResponse);
    }
  }
];

export const groupedByPoliticalAssociation = [
  cacheMiddleware(300),
  async (_: Request, res: Response) => {
    try {
      const response =
        await reportsService.groupedByPoliticalAssociation();
      sendResponse(res, response);
    } catch (error) {
      sendResponse(res, error as APIResponse);
    }
  }
];
