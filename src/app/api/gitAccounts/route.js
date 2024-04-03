import dbConnect from "@/lib/db";
import GitAccount from "@/models/GitSchema";
import { NextResponse } from "next/server";
import ProjectsCategory from "@/models/ProjectsCategory";

export async function POST(req) {
    await dbConnect();
    try {
        const { name, login, password, projectCategory } = await req.json();

        // Перевірка на наявність GitAccount з таким name і login
        let gitAccount = await GitAccount.findOne({ name, login });

        if (!gitAccount) {
            // Якщо не знайдено, створюємо новий
            gitAccount = await GitAccount.create({ name, login, password, projectCategory });
            return new Response(JSON.stringify(gitAccount), {status: 201});
        } else {
            // Якщо знайдено, повертаємо існуючий
            return new Response(JSON.stringify(gitAccount), {status: 200});
        }
    } catch (error) {
        return new Response(JSON.stringify({ message: error.message }), {status: 500});
    }
}


export async function PATCH(req) {
    try {
      await dbConnect();
  
      const { gitAccountId, login, password, projectCategory } =
        await req.json();
  
      const newGitAccount = await GitAccount.updateOne(
        { _id: gitAccountId }, // Умова, за якою знаходиться документ. Наприклад, за ID.
        {
          $set: {
            login,
            password,
            projectCategory,
          },
        }
      );
  
      return new Response(JSON.stringify(newGitAccount), { status: 201 });
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
          const gitAccount = await GitAccount.findOne({ _id: id }).populate(
            "projectCategory"
          );
    
          if (!gitAccount) {
            return NextResponse.json(
              { message: "Project not found" },
              { status: 404 }
            );
          }
          return NextResponse.json({ gitAccount }, { status: 200 });
        } else if (category) {
          let matchStage = {};
          if (category) {
            matchStage["projectCategory.name"] = category;
          }
    
          // Додавання умови пошуку за доменом, якщо search присутній
          if (search) {
            matchStage["$or"] = [
              { login: { $regex: search, $options: "i" } }, // Додавання пошуку по полю aliases
            ];
          }
    
          const totalGitAccounts = await GitAccount.aggregate([
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
    
          const total = totalGitAccounts.length > 0 ? totalGitAccounts.length : 0;
    
          const gitAccounts = await GitAccount.aggregate([
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
            return NextResponse.json({ gitAccounts: totalGitAccounts, total, page, limit }, { status: 200 });
          } else {
            return NextResponse.json({ gitAccounts, total, page, limit }, { status: 200 });
          }
        } else {
          // Якщо slug не передано, завантажуємо всі проекти
          const gitAccounts = await GitAccount.find({}).populate("projectCategory");
    
          return NextResponse.json({ gitAccounts }, { status: 200 });
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
    
        const deletedGitAccount = await GitAccount.findByIdAndDelete(id);
    
        if (!deletedGitAccount) {
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