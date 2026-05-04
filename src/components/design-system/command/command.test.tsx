/**
 * @vitest-environment happy-dom
 */
import { describe, it, expect } from "vitest";
import * as CommandModule from "./command";

describe("Command", () => {
	it("is exported correctly", () => {
		expect(CommandModule.Command).toBeDefined();
		expect(CommandModule.CommandInput).toBeDefined();
		expect(CommandModule.CommandList).toBeDefined();
		expect(CommandModule.CommandEmpty).toBeDefined();
		expect(CommandModule.CommandGroup).toBeDefined();
		expect(CommandModule.CommandItem).toBeDefined();
	});
});
