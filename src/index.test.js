// Barebones smoke test, not a full suite
import { describe, expect, it } from "bun:test";
import useModel, { useObjects, usePoses } from "./index.js";

describe("use-tensorflow", () => {
  it("exports the hooks", () => {
    expect(typeof useModel).toBe("function");
    expect(typeof useObjects).toBe("function");
    expect(typeof usePoses).toBe("function");
  });
});
