import { castIronChicken } from "./cast-iron-chicken";
import { basilPestoPasta } from "./basil-pesto-pasta";
import type { Recipe } from "./schema";

export const allRecipes: Recipe[] = [castIronChicken, basilPestoPasta];

export * from "./schema";
