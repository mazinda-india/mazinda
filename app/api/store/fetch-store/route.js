import Store from "@/models/Store";
import connectDB from "@/lib/mongoose";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const { storeId } = await req.json();

    // Connecting to database
    await connectDB();

    // Checking if the Vendor already exists
    let store = await Store.findById(storeId).select(
      "-mobileNumber -alternateMobileNumber -password"
    );

    if (store) {
      return NextResponse.json({
        success: true,
        message: "Store fetched successfully",
        store,
      });
    } else {
      return NextResponse.json({
        success: false,
        message: "Store doesn't exist",
      });
    }
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: "An error occurred while fetching the store : " + error,
    });
  }
}
