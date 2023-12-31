import connectDB from "@/lib/mongoose";
import { NextResponse } from "next/server";
import Order from "@/models/Order";

export async function POST(req) {
    try {
        const { id } = await req.json();

        await connectDB()

        let order = await Order.findById(id)

        if (!order) {
            return NextResponse.json({ success: false, error: "User doesn't exists" });
        }
        return NextResponse.json({ success: true, message: "Current orders fetched successfully", order });
    } catch (error) {
        return NextResponse.json({ success: false, error: "An error occurred while fetching the products : " + error });
    }
}