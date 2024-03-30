import dbConnect from "@/lib/db";
import User from "@/models/User";
import { NextResponse } from "next/server";
import bcrypt from "bcrypt";

export async function POST(req) {
  await dbConnect();
  try {
    const { email, password, role } = await req.json();

    const hashedPassword = await bcrypt.hash(password, 10);
    
    let newUser = await User.findOne({ email });

    if (!newUser) {
      // Якщо не знайдено, створюємо новий
      newUser = await User.create({
        email,
        password: hashedPassword,
        role,
      });
      return new Response(JSON.stringify(newUser), { status: 201 });
    } else {
      // Якщо знайдено, повертаємо існуючий
      return new Response(JSON.stringify(newUser), { status: 200 });
    }
  } catch (error) {
    return new Response(JSON.stringify({ message: error.message }), {
      status: 500,
    });
  }
}

export async function PATCH(req) {
  try {
    await dbConnect();

    const { userId, email, role } = await req.json();

    const newUser = await User.updateOne(
      { _id: userId }, // Умова, за якою знаходиться документ. Наприклад, за ID.
      {
        $set: {
          email,
          role,
        },
      }
    );

    return new Response(JSON.stringify(newUser), { status: 201 });
  } catch (error) {
    return new Response(JSON.stringify({ message: error.message }), {
      status: 500,
    });
  }
}

export async function GET(req, res) {
  await dbConnect();
  try {
    const users = await User.find({});

    return NextResponse.json({ users }, { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ message: error.message }), {
      status: 500,
    });
  }
}

export async function DELETE(req) {
  await dbConnect();
  try {
    const { id } = await req.json(); // Отримуємо ID проекту, який потрібно видалити

    const deletedUser = await User.findByIdAndDelete(id);

    if (!deletedUser) {
      throw new Error("Project not found or already deleted");
    }

    return new Response(
      JSON.stringify({ message: "User successfully deleted" }),
      { status: 200 }
    );
  } catch (error) {
    return new Response(JSON.stringify({ message: error.message }), {
      status: 500,
    });
  }
}
