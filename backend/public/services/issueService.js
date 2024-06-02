"use strict";
var __awaiter =
  (this && this.__awaiter) ||
  function (thisArg, _arguments, P, generator) {
    function adopt(value) {
      return value instanceof P
        ? value
        : new P(function (resolve) {
            resolve(value);
          });
    }
    return new (P || (P = Promise))(function (resolve, reject) {
      function fulfilled(value) {
        try {
          step(generator.next(value));
        } catch (e) {
          reject(e);
        }
      }
      function rejected(value) {
        try {
          step(generator["throw"](value));
        } catch (e) {
          reject(e);
        }
      }
      function step(result) {
        result.done
          ? resolve(result.value)
          : adopt(result.value).then(fulfilled, rejected);
      }
      step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
  };
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, "__esModule", { value: true });
const issueRepository_1 = __importDefault(require("../db/issueRepository"));
class IssueService {
  constructor() {
    this.issueRepository = new issueRepository_1.default();
  }
  getAllIssues() {
    return __awaiter(this, void 0, void 0, function* () {
      return this.issueRepository.getAllIssues();
    });
  }
  getIssueById(issueId) {
    return __awaiter(this, void 0, void 0, function* () {
      return this.issueRepository.getIssueById(issueId);
    });
  }
  createIssue(issue) {
    return __awaiter(this, void 0, void 0, function* () {
      if (!issue.user_id || !issue.category_id || !issue.content) {
        throw new Error("Missing required fields for creating an issue");
      }
      if (issue.content.length > 500) {
        throw new Error(
          "Issue content exceeds the maximum length of 500 characters",
        );
      }
      return this.issueRepository.createIssue(issue);
    });
  }
  updateIssue(issueId, issue) {
    return __awaiter(this, void 0, void 0, function* () {
      return this.issueRepository.updateIssue(issueId, issue);
    });
  }
  deleteIssue(issueId) {
    return __awaiter(this, void 0, void 0, function* () {
      return this.issueRepository.deleteIssue(issueId);
    });
  }
  setIssueRepository(issueRepository) {
    this.issueRepository = issueRepository;
  }
}
exports.default = IssueService;
