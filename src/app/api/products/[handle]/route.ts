import { NextRequest, NextResponse } from "next/server";
import { getProductMap } from "@/lib/data-loader";
import fs from "fs/promises";
import path from "path";

const productsDirectory = path.join(process.cwd(), "data", "products");

// This function is now only used for the optimized msgpack response.
async function findProductBuffer(handle: string): Promise<Buffer | null> {
  try {
    const collections = await fs.readdir(productsDirectory);
    for (const collection of collections) {
      const collectionPath = path.join(productsDirectory, collection);
      const stats = await fs.stat(collectionPath);
      if (stats.isDirectory()) {
        const productFilePath = path.join(collectionPath, `${handle}.mp.gz`);
        try {
          // Check if file exists and return its buffer
          await fs.access(productFilePath);
          return await fs.readFile(productFilePath);
        } catch {
          // File doesn't exist in this collection, continue
        }
      }
    }
  } catch (error) {
    console.error("Error reading products directory for buffer:", error);
  }
  return null; // Product not found
}

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ handle: string }> }
) {
  const params = await context.params;
  const handle = params.handle;

  if (!handle) {
    return NextResponse.json({ message: "Handle is required" }, { status: 400 });
  }

  try {
    const acceptHeader = request.headers.get("accept");

    // Optimized path for MessagePack clients
    if (acceptHeader?.includes("application/msgpack")) {
      const buffer = await findProductBuffer(handle);
      if (buffer) {
        return new NextResponse(new Blob([new Uint8Array(buffer)]), {
          status: 200,
          headers: {
            "Content-Type": "application/msgpack",
            "Content-Encoding": "gzip",
          },
        });
      }
    }

    // Default path for JSON clients (uses the cache)
    const productMap = await getProductMap();
    const product = productMap.get(handle);

    if (product) {
      return NextResponse.json(product);
    } else {
      return NextResponse.json(
        { message: "Product not found" },
        { status: 404 }
      );
    }
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Error reading product data" },
      { status: 500 }
    );
  }
}
