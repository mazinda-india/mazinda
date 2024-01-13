// import Order from "@/models/Order";
// import connectDB from "@/lib/mongoose";
// import { NextResponse } from "next/server";
// import jwt from "jsonwebtoken";
// import User from "@/models/User";

// export async function POST(req) {
//   try {
//     const { userToken, userCart, pricing, address, paymentMethod } =
//       await req.json();

//     const userData = jwt.verify(userToken, "this is jwt secret");

//     await connectDB();

//     let user = await User.findOne({ email: userData.email });
//     if (!user) {
//       return NextResponse.json({
//         success: false,
//         error: "User doesn't exists",
//       });
//     }

//     await Order.create({
//       userId: user._id,
//       cart: userCart,
//       address,
//       pricing,
//       paymentMethod,
//     });
//     return NextResponse.json({
//       success: true,
//       message: "Order placed successfully",
//     });
//   } catch (error) {
//     return NextResponse.json({
//       success: false,
//       error: "An error occurred while creating the Order : " + error,
//     });
//   }
// }

import FoodOrder from "@/models/FoodOrder";
import connectDB from "@/lib/mongoose";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const {
      userId,
      vendorId,
      products,
      address,
      amount,
      externalDeliveryRequired,
      cutleryRequirement,
      paymentInfo,
      paymentMethod,
    } = await req.json();
    await connectDB();
    const foodOrder = await FoodOrder.create({
      userId,
      vendorId,
      products,
      address,
      amount,
      externalDeliveryRequired,
      cutleryRequirement,
      paymentInfo,
      paymentMethod,
    });
    return NextResponse.json({
      success: true,
      message: "Food order created successfully",
      order: foodOrder,
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: "An error occurred while creating the order : " + error,
    });
  }
}