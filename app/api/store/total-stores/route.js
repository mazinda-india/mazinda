import connectDB from "@/libs/mongoose";
import Store from "@/models/Store";
import { NextResponse } from "next/server";

export async function POST() {
    try {
        await connectDB()
        const totalStores = await Store.countDocuments()
        return NextResponse.json({ success: true, totalStores });
    } catch (error) {
        return NextResponse.json({ success: false, error: "An error occurred while logging in the Store : " + error });
    }
}