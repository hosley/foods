/**
 * @vitest-environment happy-dom
 */
import { describe, it, expect } from "vitest";
import * as PopoverModule from "./popover";

describe("Popover", () => {
	it("is exported correctly", () => {
		expect(PopoverModule.Popover).toBeDefined();
		expect(PopoverModule.PopoverTrigger).toBeDefined();
		expect(PopoverModule.PopoverContent).toBeDefined();
	});
});
