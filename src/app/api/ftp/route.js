import dbConnect from "@/lib/db";
import FtpAccount from "@/models/FtpAccountSchema";
import { NextResponse } from "next/server";

export async function POST(req) {
    await dbConnect();
    try {
        const { protocol, host, login, password, port, projectCategory } = await req.json();

        // Перевірка на наявність FtpAccount з таким name і login
        let ftpAccount = await FtpAccount.findOne({ host, login });

        if (!ftpAccount) {
            // Якщо не знайдено, створюємо новий
            ftpAccount = await FtpAccount.create({ protocol, host, login, password, port, projectCategory });
            return new Response(JSON.stringify(ftpAccount), {status: 201});
        } else {
            // Якщо знайдено, повертаємо існуючий
            return new Response(JSON.stringify(ftpAccount), {status: 200});
        }
    } catch (error) {
        return new Response(JSON.stringify({ message: error.message }), {status: 500});
    }
}


export async function PATCH(req) {
    try {
      await dbConnect();
  
      const { ftpAccountId, protocol, host, login, password, port, projectCategory } =
        await req.json();
  
      const newFtpAccount = await FtpAccount.updateOne(
        { _id: ftpAccountId }, // Умова, за якою знаходиться документ. Наприклад, за ID.
        {
          $set: {
            protocol,
            host,
            login,
            password,
            port,
            projectCategory,
          },
        }
      );
  
      return new Response(JSON.stringify(newFtpAccount), { status: 201 });
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
          const ftpAccount = await FtpAccount.findOne({ _id: id }).populate(
            "projectCategory"
          );
    
          if (!ftpAccount) {
            return NextResponse.json(
              { message: "Project not found" },
              { status: 404 }
            );
          }
          return NextResponse.json({ ftpAccount }, { status: 200 });
        } else if (category) {
          let matchStage = {};
          if (category) {
            matchStage["projectCategory.name"] = category;
          }
    
          // Додавання умови пошуку за доменом, якщо search присутній
          if (search) {
            matchStage["$or"] = [
              { host: { $regex: search, $options: "i" } }, // Додавання пошуку по полю email
              { login: { $regex: search, $options: "i" } }, // Додавання пошуку по полю aliases
            ];
          }
    
          const totalFtpAccounts = await FtpAccount.aggregate([
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
    
          const total = totalFtpAccounts.length > 0 ? totalFtpAccounts.length : 0;
    
          const ftpAccounts = await FtpAccount.aggregate([
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
            return NextResponse.json({ ftpAccounts: totalFtpAccounts, total, page, limit }, { status: 200 });
          } else {
            return NextResponse.json({ ftpAccounts, total, page, limit }, { status: 200 });
          }
        } else {
          // Якщо slug не передано, завантажуємо всі проекти
          const ftpAccounts = await FtpAccount.find({}).populate("projectCategory");
    
          return NextResponse.json({ ftpAccounts }, { status: 200 });
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
    
        const deletedFtpAccount = await FtpAccount.findByIdAndDelete(id);
    
        if (!deletedFtpAccount) {
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