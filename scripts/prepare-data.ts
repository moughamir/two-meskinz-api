import fs from "fs/promises";
import path from "path";
import msgpack from "msgpack-lite";
import { gzip } from "zlib";
import { promisify } from "util";
import lunr from "lunr";
import { Product } from "../src/lib/types";

const gzipAsync = promisify(gzip);
const dataDirectory = path.join(process.cwd(), "data");
const productsSourceDirectory = path.join(dataDirectory, "products"); // Directory containing JSON files
const allProductsOutputPath = path.join(dataDirectory, "all-products.mp.gz");
const searchIndexOutputPath = path.join(dataDirectory, "search-index.json");

async function collectProductsFromDirectory(directory: string): Promise<Product[]> {
  let products: Product[] = [];
  try {
    const entries = await fs.readdir(directory, { withFileTypes: true });

    for (const entry of entries) {
      const fullPath = path.join(directory, entry.name);
      if (entry.isDirectory()) {
        products = products.concat(await collectProductsFromDirectory(fullPath));
      } else if (entry.isFile() && entry.name.endsWith(".json")) {
        try {
          const jsonContent = await fs.readFile(fullPath, "utf-8");
          const data: Product = JSON.parse(jsonContent);
          products.push(data);
        } catch (error) {
          console.error(`Error parsing JSON from ${fullPath}:`, error);
        }
      }
    }
  } catch (_error) {
    // This can happen if the directory is empty or doesn't exist, which is fine.
  }
  return products;
}

async function main() {
  console.log("Starting data preparation...");

  // 1. Collect all products from JSON files
  console.log(`Collecting products from ${productsSourceDirectory}...`);
  const allProducts = await collectProductsFromDirectory(productsSourceDirectory);

  if (allProducts.length === 0) {
    console.log("No JSON products found to process. Please ensure your 'products' directory contains JSON files.");
    console.log("Data preparation complete.");
    return;
  }

  console.log(`Collected ${allProducts.length} products.`);

  // 2. Encode all products into a single MessagePack and Gzip it
  console.log("Encoding and compressing all products into a single file...");
  try {
    const packedData = msgpack.encode(allProducts);
    const compressedData = await gzipAsync(packedData);
    await fs.writeFile(allProductsOutputPath, compressedData);
    console.log(`All products saved to ${allProductsOutputPath}`);
  } catch (error) {
    console.error("Error encoding/compressing all products:", error);
    return;
  }

  // 3. Build and save the search index
  console.log("Building search index...");
  try {
    const idx = lunr(function () {
      this.ref("handle");
      this.field("title", { boost: 10 });
      this.field("body_html");
      this.field("vendor");
      this.field("product_type");
      this.field("tags", { boost: 5 });

      allProducts.forEach((product) => {
        if (product && product.handle) {
          this.add({
            handle: product.handle,
            title: product.title,
            body_html: product.body_html,
            vendor: product.vendor,
            product_type: product.product_type,
            tags: product.tags?.join(" "),
          });
        }
      });
    });

    const serializedIndex = JSON.stringify(idx);
    await fs.writeFile(searchIndexOutputPath, serializedIndex);
    console.log(`Search index built and saved to ${searchIndexOutputPath}`);
  } catch (error) {
    console.error("Error building search index:", error);
    return;
  }

  // NEW: Delete original JSON files
  console.log(`Deleting original JSON files from ${productsSourceDirectory}...`);
  try {
    await fs.rm(productsSourceDirectory, { recursive: true, force: true });
    console.log("Original JSON files deleted.");
  } catch (error) {
    console.error("Error deleting original JSON files:", error);
  }

  console.log("Data preparation complete.");
}

main().catch(console.error);
