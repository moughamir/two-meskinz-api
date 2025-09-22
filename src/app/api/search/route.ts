import { NextResponse } from "next/server";
import { getSearchIndex, getProductMap } from "@/lib/data-loader";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("q");

  if (!query) {
    return NextResponse.json(
      { message: "Search query is required" },
      { status: 400 }
    );
  }

  try {
    // Get the cached search index and product map
    const idx = await getSearchIndex();
    const productMap = await getProductMap();

    const searchResults = idx.search(query);
    const products = searchResults.map((result) => productMap.get(result.ref));

    return NextResponse.json(products);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Error reading or searching data" },
      { status: 500 }
    );
  }
}