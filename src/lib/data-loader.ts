import fs from "fs/promises";
import path from "path";
import lunr from "lunr";
import msgpack from "msgpack-lite";
import { gunzip } from "zlib";
import { promisify } from "util";
import { Product } from "./types";

const gunzipAsync = promisify(gunzip);
const dataDirectory = path.join(process.cwd(), "data");
const allProductsInputPath = path.join(dataDirectory, "all-products.mp.gz");
const searchIndexInputPath = path.join(dataDirectory, "search-index.json");

// In-memory cache
let productMap: Map<string, Product> | null = null;
let allProducts: Product[] | null = null;
let searchIndex: lunr.Index | null = null;

async function loadData() {
  if (productMap && allProducts && searchIndex) {
    return;
  }

  console.log("Loading all data into memory for the first time...");

  // Load all products from the single all-products.mp.gz file
  try {
    const fileContent = await fs.readFile(allProductsInputPath);
    const decompressed = await gunzipAsync(fileContent);
    allProducts = msgpack.decode(decompressed) as Product[];
  } catch (error) {
    console.error(`Error loading all products from ${allProductsInputPath}:`, error);
    allProducts = []; // Initialize as empty array on error
  }

  // Create a Map for quick product lookups by handle
  productMap = new Map();
  allProducts.forEach((product) => {
    if (product && product.handle) {
      productMap!.set(product.handle, product);
    }
  });

  // Load the pre-built search index
  try {
    const indexJson = await fs.readFile(searchIndexInputPath, "utf-8");
    searchIndex = lunr.Index.load(JSON.parse(indexJson));
  } catch (error) {
    console.error(`Error loading search index from ${searchIndexInputPath}:`, error);
    // Create an empty index as a fallback
    searchIndex = lunr(function () {
      this.ref("handle");
      this.field("title");
    });
  }

  console.log(`${allProducts.length} products and search index loaded into memory.`);
}

export async function getProducts(): Promise<Product[]> {
  if (!allProducts) {
    await loadData();
  }
  return allProducts!;
}

export async function getProductMap(): Promise<Map<string, Product>> {
  if (!productMap) {
    await loadData();
  }
  return productMap!;
}

export async function getSearchIndex(): Promise<lunr.Index> {
  if (!searchIndex) {
    await loadData();
  }
  return searchIndex!;
}
