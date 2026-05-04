import { AppContent } from "../../constants/content";

export const getContent = () => AppContent;

export const getLandingPageContent = () => getContent().landingPage;

export const getShoppingListContent = () => getContent().shoppingList;

export const getRecipePageContent = () => getContent().recipePage;

export const getAddRecipeContent = () => getContent().addRecipe;

export const getCommonContent = () => getContent().common;

export const getNavContent = () => getCommonContent().nav;

export const getFooterContent = () => getCommonContent().footer;
