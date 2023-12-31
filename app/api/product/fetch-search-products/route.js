import Product from "@/models/Product";
import Store from "@/models/Store";
import connectDB from "@/lib/mongoose";
import { NextResponse } from "next/server";

export async function POST(request) {
  const searchParams = request.nextUrl.searchParams;
  const searchQuery = searchParams.get("searchQuery");

  try {
    await connectDB();

    let products;

    const { availablePincodes } = await request.json();

    const stores = await Store.find({
      "storeAddress.pincode": { $in: availablePincodes },
    });

    // Extract storeIds from the matching stores
    const storeIds = stores.map((store) => store._id);

    // Fetch products based on approvalStatus and storeIds
    products = await Product.find({
      approvalStatus: true,
      storeId: { $in: storeIds },
    }).exec();

    const lowercaseSearchQuery = searchQuery.toLowerCase();

    // Filter products based on productName and tags
    const filteredProducts = products.filter((product) => {
      const productNameLower = product.productName.toLowerCase();

      // Check if productName contains search query
      if (productNameLower.includes(lowercaseSearchQuery)) {
        return true;
      }

      // Check if the search query includes any tag
      if (
        product.tags &&
        product.tags.some((tag) =>
          lowercaseSearchQuery.includes(tag.toLowerCase())
        )
      ) {
        return true;
      }

      return false;
    });

    return NextResponse.json({ success: true, products: filteredProducts });
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: "An error occurred while creating the Product: " + error,
    });
  }
}
