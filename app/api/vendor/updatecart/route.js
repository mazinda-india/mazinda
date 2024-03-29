import User from "@/models/User";
import connectDB from "@/lib/mongoose";
import { NextResponse } from "next/server";

import jwt from 'jsonwebtoken'

export async function PUT(req) {
    try {
        const { token, cart } = await req.json();

        const data = jwt.verify(token, 'this is jwt secret')
        const email = data.email
        
        // Connecting to database
        await connectDB()

        // Checking if the user already exists
        let user = await User.findOne({ email });

        if (user) {
            user.food_cart = cart;
            await user.save();
            return NextResponse.json({ success: true, message: "Cart updated successfully"});
        } else {
            return NextResponse.json({ success: false, message: "User doesn't exist" });
        }
    } catch (error) {
        return NextResponse.json({ success: false, error: "An error occurred while logging in the User : " + error });
    }
}
