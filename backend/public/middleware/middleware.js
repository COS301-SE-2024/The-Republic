"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.serverMiddleare = void 0;
const serverMiddleare = (req, res, next) => {
  console.log("Middleware executed!");
  next();
};
exports.serverMiddleare = serverMiddleare;
