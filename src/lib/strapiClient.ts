import { strapi } from "@strapi/client";

const API_URL =
  import.meta.env.VITE_STRAPI_URL ||
  "https://authentic-virtue-ebbd26e6cd.strapiapp.com/api";
const API_TOKEN = import.meta.env.VITE_STRAPI_API_TOKEN;

export const strapiClient = strapi({
  baseURL: API_URL,
  auth: API_TOKEN,
});

// IMPORTANT: In Strapi 5, ensure these match your Content-Type API IDs
// If you go to Strapi Admin -> Content-Type Builder, look at the "API ID" (Plural)
export const articles = strapiClient.collection("articles");
export const categories = strapiClient.collection("categories");
export const subcategories = strapiClient.collection("sub-categories");
export const products = strapiClient.collection("products");
export const currencies = strapiClient.collection("currency-settings");
export const users = strapiClient.collection("users");
export const orders = strapiClient.collection("orders");
export const order_items = strapiClient.collection("order-items");
