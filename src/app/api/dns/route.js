import dbConnect from "@/lib/db";
import DnsAccount from "@/models/DnsSchema";
import { NextResponse } from "next/server";

export async function POST(req) {
    await dbConnect();
    try {
        const { name, login, password, projectCategory } = await req.json();

        // Перевірка на наявність DnsAccount з таким name і login
        let dnsAccount = await DnsAccount.findOne({ name, login });

        if (!dnsAccount) {
            // Якщо не знайдено, створюємо новий
            dnsAccount = await DnsAccount.create({ name, login, password, projectCategory });
            return new Response(JSON.stringify(dnsAccount), {status: 201});
        } else {
            // Якщо знайдено, повертаємо існуючий
            return new Response(JSON.stringify(dnsAccount), {status: 200});
        }
    } catch (error) {
        return new Response(JSON.stringify({ message: error.message }), {status: 500});
    }
}


export async function PATCH(req) {
    try {
      await dbConnect();
  
      const { dnsAccountId, name, login, password, projectCategory } =
        await req.json();
  
      const newDnsAccount = await DnsAccount.updateOne(
        { _id: dnsAccountId }, // Умова, за якою знаходиться документ. Наприклад, за ID.
        {
          $set: {
            name,
            login,
            password,
            projectCategory,
          },
        }
      );
  
      return new Response(JSON.stringify(newDnsAccount), { status: 201 });
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
          const dnsAccount = await DnsAccount.findOne({ _id: id }).populate(
            "projectCategory"
          );
    
          if (!dnsAccount) {
            return NextResponse.json(
              { message: "Project not found" },
              { status: 404 }
            );
          }
          return NextResponse.json({ dnsAccount }, { status: 200 });
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
    
          const totalDnsAccounts = await DnsAccount.aggregate([
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
    
          const total = totalDnsAccounts.length > 0 ? totalDnsAccounts.length : 0;
    
          const dnsAccounts = await DnsAccount.aggregate([
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
            return NextResponse.json({ dnsAccounts: totalDnsAccounts, total, page, limit }, { status: 200 });
          } else {
            return NextResponse.json({ dnsAccounts, total, page, limit }, { status: 200 });
          }
        } else {
          // Якщо slug не передано, завантажуємо всі проекти
          const dnsAccounts = await DnsAccount.find({}).populate("projectCategory");
    
          return NextResponse.json({ dnsAccounts }, { status: 200 });
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
    
        const deletedDnsAccount = await DnsAccount.findByIdAndDelete(id);
    
        if (!deletedDnsAccount) {
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