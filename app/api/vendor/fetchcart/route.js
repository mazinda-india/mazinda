import User from "@/models/User";
import connectDB from "@/lib/mongoose";
import { NextResponse } from "next/server";

import jwt from 'jsonwebtoken'

export async function POST(req) {
    try {
        const { token } = await req.json();

        const data = jwt.verify(token, 'this is jwt secret')
        const email = data.email

        // Connecting to database
        await connectDB()

        // Checking if the user already exists
        let user = await User.findOne({ email });

        if (user) {
            return NextResponse.json({ success: true, message: "Cart fetched successfully", cart: user.food_cart[0]});
        } else {
            return NextResponse.json({ success: false, message: "User doesn't exist" });
        }
    } catch (error) {
        return NextResponse.json({ success: false, error: "An error occurred while logging in the User : " + error });
    }
}
