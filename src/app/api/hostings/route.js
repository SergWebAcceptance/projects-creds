import dbConnect from "@/lib/db";
import Hosting from "@/models/HostingSchema";
import { NextResponse } from "next/server";
import ProjectsCategory from "@/models/ProjectsCategory";

export async function POST(req) {
    await dbConnect();
    try {
        const { name, login, password, projectCategory } = await req.json();

        // Перевірка на наявність Hosting з таким name і login
        let hosting = await Hosting.findOne({ name, login });

        if (!hosting) {
            // Якщо не знайдено, створюємо новий
            hosting = await Hosting.create({ name, login, password, projectCategory });
            return new Response(JSON.stringify(hosting), {status: 201});
        } else {
            // Якщо знайдено, повертаємо існуючий
            return new Response(JSON.stringify(hosting), {status: 200});
        }
    } catch (error) {
        return new Response(JSON.stringify({ message: error.message }), {status: 500});
    }
}

export async function PATCH(req) {
  try {
    await dbConnect();

    const { hostingId, name, login, password, projectCategory } =
      await req.json();

    const newHosting = await Hosting.updateOne(
      { _id: hostingId }, // Умова, за якою знаходиться документ. Наприклад, за ID.
      {
        $set: {
          name,
          login,
          password,
          projectCategory,
        },
      }
    );

    return new Response(JSON.stringify(newHosting), { status: 201 });
  } catch (error) {
    return new Response(JSON.stringify({ message: error.message }), {
      status: 500,
    });
  }
}

export async function GET(req, res) {
    await dbConnect();
    try {
      const url = new URL(req.url);
      const id = url.searchParams.get("id");
      const category = url.searchParams.get("category");
      const search = url.searchParams.get("search");
      const page = parseInt(url.searchParams.get("page")) || 1;
      const limit = parseInt(url.searchParams.get("limit")) || 10;
      const skip = (page - 1) * limit;
  
      if (id) {
        // Якщо slug передано, шукаємо конкретний проект
        const hosting = await Hosting.findOne({ _id: id }).populate(
          "projectCategory"
        );
  
        if (!hosting) {
          return NextResponse.json(
            { message: "Project not found" },
            { status: 404 }
          );
        }
        return NextResponse.json({ hosting }, { status: 200 });
      } else if (category) {
        let matchStage = {};
        if (category) {
          matchStage["projectCategory.name"] = category;
        }
  
        // Додавання умови пошуку за доменом, якщо search присутній
        if (search) {
          matchStage["$or"] = [
            { name: { $regex: search, $options: "i" } }, // Додавання пошуку по полю email
            { login: { $regex: search, $options: "i" } }, // Додавання пошуку по полю aliases
          ];
        }
  
        const totalHostings = await Hosting.aggregate([
          {
            $lookup: {
              from: "projectscategories", // the collection to join
              localField: "projectCategory", // field from the input documents
              foreignField: "_id", // field from the documents of the "from" collection
              as: "projectCategory", // output array field
            },
          },
          {
            $unwind: "$projectCategory", // Deconstructs the array
          },
          {
            $match: matchStage,
          }
        ]);
  
        const total = totalHostings.length > 0 ? totalHostings.length : 0;
  
        const hostings = await Hosting.aggregate([
          {
            $lookup: {
              from: "projectscategories", // the collection to join
              localField: "projectCategory", // field from the input documents
              foreignField: "_id", // field from the documents of the "from" collection
              as: "projectCategory", // output array field
            },
          },
          {
            $unwind: "$projectCategory", // Deconstructs the array
          },
          {
            $match: matchStage,
          },
          { $skip: skip },
          { $limit: limit },
        ]);
  
        if(search) {
          return NextResponse.json({ hostings: totalHostings, total, page, limit }, { status: 200 });
        } else {
          return NextResponse.json({ hostings, total, page, limit }, { status: 200 });
        }
      } else {
        // Якщо slug не передано, завантажуємо всі проекти
        const hostings = await Hosting.find({}).populate("projectCategory");
  
        return NextResponse.json({ hostings }, { status: 200 });
      }
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
  
      const deletedHosting = await Hosting.findByIdAndDelete(id);
  
      if (!deletedHosting) {
        throw new Error("Project not found or already deleted");
      }
  
      return new Response(
        JSON.stringify({ message: "Project successfully deleted" }),
        { status: 200 }
      );
    } catch (error) {
      return new Response(JSON.stringify({ message: error.message }), {
        status: 500,
      });
    }
  }