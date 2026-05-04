/**
 * @vitest-environment happy-dom
 */
import { describe, it, expect } from "vitest";
import * as CheckboxModule from "./checkbox";

describe("Checkbox", () => {
	it("is exported correctly", () => {
		expect(CheckboxModule.Checkbox).toBeDefined();
	});
});
