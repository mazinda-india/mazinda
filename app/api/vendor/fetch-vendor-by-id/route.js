import Vendor from "@/models/Vendor";
import connectDB from "@/lib/mongoose";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const { _id } = await req.json();

    await connectDB();

    // Checking if the Vendor already exists
    let vendor = await Vendor.findById(_id).select(
      "-password -number -alternateNumber"
    );

    if (vendor) {
      return NextResponse.json({
        success: true,
        message: "Vendor fetched successfully",
        vendor,
      });
    } else {
      return NextResponse.json({
        success: false,
        message: "Vendor doesn't exist",
      });
    }
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: "An error occurred while fetching the vendor : " + error,
    });
  }
}
