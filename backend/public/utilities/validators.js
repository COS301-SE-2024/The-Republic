"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateOrganizationUsername = exports.validateOrganizationName = void 0;
function validateOrganizationName(name) {
    return name.length >= 3 && name.length <= 50;
}
exports.validateOrganizationName = validateOrganizationName;
function validateOrganizationUsername(username) {
    return /^[a-zA-Z0-9_-]{3,20}$/.test(username);
}
exports.validateOrganizationUsername = validateOrganizationUsername;
