<<<<<<< HEAD:frontend/__tests__/misc/index.test.ts
import { capitalize } from '../../lib/helper';
import { describe, expect, test } from '@jest/globals';
=======
import { capitalize } from "../lib/helper";
import { describe, expect, test } from "@jest/globals";
>>>>>>> 3399dee0e5bc67293f9f83c4348d6fbd597ba7c3:frontend/__tests__/index.test.ts

describe("capitalize function", () => {
  test("capitalizes the first letter of a word", () => {
    expect(capitalize("hello")).toBe("Hello");
  });

  test("handles empty string", () => {
    expect(capitalize("")).toBe("");
  });

  test("handles already capitalized string", () => {
    expect(capitalize("World")).toBe("World");
  });

  test("handles string with numbers", () => {
    expect(capitalize("123abc")).toBe("123abc");
  });

  test("handles string with special characters", () => {
    expect(capitalize("$test")).toBe("$test");
  });
});
