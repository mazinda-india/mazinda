import User from "@/models/User";
import connectDB from "@/lib/mongoose";
import { NextResponse } from "next/server";
import jwt from 'jsonwebtoken';
import Order from "@/models/Order";

export async function POST(req) {
    try {
        const { userToken, filter } = await req.json();

        console.log(filter);

        const userData = jwt.verify(userToken, 'this is jwt secret');

        await connectDB()

        let user = await User.findOne({ phoneNumber: userData.phoneNumber })
        if (!user) {
            return NextResponse.json({ success: false, error: "User doesn't exists" });
        }

        let orders;

        if (filter === 'delivered') {
            orders = await Order.find({ userId: user._id, isDelivered: true });
        } else if (filter === 'active') {
            orders = await Order.find({ userId: user._id, isDelivered: false });
        } else {
            orders = await Order.find({ userId: user._id });
        }

        return NextResponse.json({ success: true, message: "Current orders fetched successfully", orders });
    } catch (error) {
        return NextResponse.json({ success: false, error: "An error occurred while fetching the products : " + error });
    }
}