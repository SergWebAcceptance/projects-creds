import dbConnect from "@/lib/db";
import DomainRegistrar from "@/models/DomainRegistrar";
import { NextResponse } from "next/server";
import ProjectsCategory from "@/models/ProjectsCategory";

export async function POST(req) {
    await dbConnect();
    try {
        const { name, login, password, projectCategory } = await req.json();

        // Перевірка на наявність DomainRegistrar з таким name і login
        let registrar = await DomainRegistrar.findOne({ name, login });

        if (!registrar) {
            // Якщо не знайдено, створюємо новий
            registrar = await DomainRegistrar.create({ name, login, password, projectCategory });
            return new Response(JSON.stringify(registrar), {status: 201});
        } else {
            // Якщо знайдено, повертаємо існуючий
            return new Response(JSON.stringify(registrar), {status: 200});
        }
    } catch (error) {
        return new Response(JSON.stringify({ message: error.message }), {status: 500});
    }
}

export async function PATCH(req) {
    try {
      await dbConnect();
  
      const { domainRegistrarId, name, login, password, projectCategory } =
        await req.json();
  
      const newDomainRegistrar = await DomainRegistrar.updateOne(
        { _id: domainRegistrarId }, // Умова, за якою знаходиться документ. Наприклад, за ID.
        {
          $set: {
            name,
            login,
            password,
            projectCategory,
          },
        }
      );
  
      return new Response(JSON.stringify(newDomainRegistrar), { status: 201 });
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
          const registrar = await DomainRegistrar.findOne({ _id: id }).populate(
            "projectCategory"
          );
    
          if (!registrar) {
            return NextResponse.json(
              { message: "Project not found" },
              { status: 404 }
            );
          }
          return NextResponse.json({ registrar }, { status: 200 });
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
    
          const totalDomainRegistrars = await DomainRegistrar.aggregate([
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
    
          const total = totalDomainRegistrars.length > 0 ? totalDomainRegistrars.length : 0;
    
          const registrars = await DomainRegistrar.aggregate([
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
            return NextResponse.json({ registrars: totalDomainRegistrars, total, page, limit }, { status: 200 });
          } else {
            return NextResponse.json({ registrars, total, page, limit }, { status: 200 });
          }
        } else {
          // Якщо slug не передано, завантажуємо всі проекти
          const registrars = await DomainRegistrar.find({}).populate("projectCategory");
    
          return NextResponse.json({ registrars }, { status: 200 });
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
    
        const deletedDomainRegistrar = await DomainRegistrar.findByIdAndDelete(id);
    
        if (!deletedDomainRegistrar) {
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