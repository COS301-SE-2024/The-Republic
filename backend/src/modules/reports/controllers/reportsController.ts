import { Request, Response } from "express";
import { sendResponse } from "@/utilities/response";
import { APIResponse } from "@/types/response";
import ReportsService from "@/modules/reports/services/reportsService";

const reportsService = new ReportsService();

export const getAllIssuesGroupedByResolutionStatus = async (
  req: Request,
  res: Response,
) => {
  try {
    const response = await reportsService.getAllIssuesGroupedByResolutionStatus(
      req.body,
    );
    sendResponse(res, response);
  } catch (error) {
    sendResponse(res, error as APIResponse);
  }
};

export const getIssueCountsGroupedByResolutionStatus = async (
  req: Request,
  res: Response,
) => {
  try {
    const response =
      await reportsService.getIssueCountsGroupedByResolutionStatus(req.body);
    sendResponse(res, response);
  } catch (error) {
    sendResponse(res, error as APIResponse);
  }
};

export const getIssueCountsGroupedByResolutionAndCategory = async (
  req: Request,
  res: Response,
) => {
  try {
    const response =
      await reportsService.getIssueCountsGroupedByResolutionAndCategory(
        req.body,
      );
    sendResponse(res, response);
  } catch (error) {
    sendResponse(res, error as APIResponse);
  }
};

export const getIssuesGroupedByCreatedAt = async (
  req: Request,
  res: Response,
) => {
  try {
    const response = await reportsService.getIssuesGroupedByCreatedAt(req.body);
    sendResponse(res, response);
  } catch (error) {
    sendResponse(res, error as APIResponse);
  }
};

export const getIssuesGroupedByCategory = async (
  req: Request,
  res: Response,
) => {
  try {
    const response = await reportsService.getIssuesGroupedByCategory(req.body);
    sendResponse(res, response);
  } catch (error) {
    sendResponse(res, error as APIResponse);
  }
};

export const getIssuesCountGroupedByCategoryAndCreatedAt = async (
  req: Request,
  res: Response,
) => {
  try {
    const response =
      await reportsService.getIssuesCountGroupedByCategoryAndCreatedAt(
        req.body,
      );
    sendResponse(res, response);
  } catch (error) {
    sendResponse(res, error as APIResponse);
  }
};
