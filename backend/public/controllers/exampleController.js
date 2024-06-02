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
Object.defineProperty(exports, "__esModule", { value: true });
exports.exampleController = void 0;
// Sample JSON data for testing
const exampleData = [
  { id: "1", name: "Example 1" },
  { id: "2", name: "Example 2" },
  { id: "3", name: "Example 3" },
];
// Controller to get all examples
const getAllExamples = (req, res) =>
  __awaiter(void 0, void 0, void 0, function* () {
    res.status(200).json(exampleData);
  });
// Controller to get an example by ID
const getExampleById = (req, res) =>
  __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const example = exampleData.find((example) => example.id === id);
    if (!example) {
      return res.status(404).json({ error: "Example not found" });
    }
    res.status(200).json(example);
  });
// Controller to create a new example
const createExample = (req, res) =>
  __awaiter(void 0, void 0, void 0, function* () {
    const { name } = req.body;
    const newExample = { id: String(exampleData.length + 1), name };
    exampleData.push(newExample);
    res.status(201).json(newExample);
  });
// Controller to update an example by ID
const updateExample = (req, res) =>
  __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const { name } = req.body;
    const exampleIndex = exampleData.findIndex((example) => example.id === id);
    if (exampleIndex === -1) {
      return res.status(404).json({ error: "Example not found" });
    }
    exampleData[exampleIndex].name = name;
    res.status(200).json(exampleData[exampleIndex]);
  });
// Controller to delete an example by ID
const deleteExample = (req, res) =>
  __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const exampleIndex = exampleData.findIndex((example) => example.id === id);
    if (exampleIndex === -1) {
      return res.status(404).json({ error: "Example not found" });
    }
    exampleData.splice(exampleIndex, 1);
    res.status(200).json({ message: "Example deleted successfully" });
  });
exports.exampleController = {
  getAllExamples,
  getExampleById,
  createExample,
  updateExample,
  deleteExample,
};
// import { Request, Response } from 'express';
// import { supabase } from '../services/supabaseClient';
// import { Example } from '../types/exampleTypes';
// // Controller to get all examples
// const getAllExamples = async (req: Request, res: Response) => {
//   const { data, error } = await supabase.from<Example>('examples').select('*');
//   if (error) {
//     return res.status(500).json({ error: error.message });
//   }
//   res.status(200).json(data);
// };
// // Controller to get an example by ID
// const getExampleById = async (req: Request, res: Response) => {
//   const { id } = req.params;
//   const { data, error } = await supabase.from<Example>('examples').select('*').eq('id', id).single();
//   if (error) {
//     return res.status(404).json({ error: 'Example not found' });
//   }
//   res.status(200).json(data);
// };
// // Controller to create a new example
// const createExample = async (req: Request, res: Response) => {
//   const { name } = req.body;
//   const { data, error } = await supabase.from<Example>('examples').insert([{ name }]);
//   if (error) {
//     return res.status(500).json({ error: error.message });
//   }
//   res.status(201).json(data);
// };
// // Controller to update an example by ID
// const updateExample = async (req: Request, res: Response) => {
//   const { id } = req.params;
//   const { name } = req.body;
//   const { data, error } = await supabase.from<Example>('examples').update({ name }).eq('id', id);
//   if (error) {
//     return res.status(500).json({ error: error.message });
//   }
//   res.status(200).json(data);
// };
// // Controller to delete an example by ID
// const deleteExample = async (req: Request, res: Response) => {
//   const { id } = req.params;
//   const { data, error } = await supabase.from<Example>('examples').delete().eq('id', id);
//   if (error) {
//     return res.status(500).json({ error: error.message });
//   }
//   res.status(200).json({ message: 'Example deleted successfully' });
// };
// export const exampleController = {
//   getAllExamples,
//   getExampleById,
//   createExample,
//   updateExample,
//   deleteExample,
// };
