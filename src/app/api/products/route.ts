import { NextResponse } from "next/server";
import { getProducts } from "@/lib/data-loader";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const page = parseInt(searchParams.get("page") || "1", 10);
  const limit = parseInt(searchParams.get("limit") || "12", 10);

  try {
    const allProducts = await getProducts();

    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const paginatedProducts = allProducts.slice(startIndex, endIndex);

    return NextResponse.json({
      products: paginatedProducts,
      total: allProducts.length,
      page,
      limit,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Error reading product data" },
      { status: 500 }
    );
  }
}