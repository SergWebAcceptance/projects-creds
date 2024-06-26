import dbConnect from "@/lib/db";
import DnsAccount from "@/models/DnsSchema";
import { NextResponse } from "next/server";
import ProjectsCategory from "@/models/ProjectsCategory";
import { encryptText, decryptText } from "@/lib/cryptoUtils";
import { countPerPage } from "@/lib/constants";

export async function POST(req) {
  await dbConnect();
  try {
    const { name, login, password, projectCategory } = await req.json();

    // Перевірка на наявність DnsAccount з таким name і login
    let dnsAccount = await DnsAccount.findOne({ name, login });
    const encryptedLogin = encryptText(login);
    const encryptedPassword = encryptText(password);
    if (!dnsAccount) {
      // Якщо не знайдено, створюємо новий
      dnsAccount = await DnsAccount.create({
        name,
        login: encryptedLogin,
        password: encryptedPassword,
        projectCategory,
      });
      return new Response(JSON.stringify(dnsAccount), { status: 201 });
    } else {
      // Якщо знайдено, повертаємо існуючий
      return new Response(JSON.stringify(dnsAccount), { status: 200 });
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

    const { dnsAccountId, name, login, password, projectCategory } =
      await req.json();
    const encryptedLogin = encryptText(login);
    const encryptedPassword = encryptText(password);
    const newDnsAccount = await DnsAccount.updateOne(
      { _id: dnsAccountId }, // Умова, за якою знаходиться документ. Наприклад, за ID.
      {
        $set: {
          name,
          login: encryptedLogin,
          password: encryptedPassword,
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
    const limit = parseInt(url.searchParams.get("limit")) || countPerPage;
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
      } else {
        // Decrypt login and password here
        dnsAccount.login = decryptText(dnsAccount.login);
        dnsAccount.password = decryptText(dnsAccount.password);
      }
      return NextResponse.json({ dnsAccount }, { status: 200 });
    } else if (category) {
      let matchStage = {};
      if (category) {
        matchStage["projectCategory.name"] = category;
      }

      // Додавання умови пошуку за доменом, якщо search присутній
      /*if (search) {
        matchStage["$or"] = [
          { name: { $regex: search, $options: "i" } }, // Додавання пошуку по полю email
          { login: { $regex: search, $options: "i" } }, // Додавання пошуку по полю aliases
        ];
      }*/

      let totalDnsAccounts = await DnsAccount.aggregate([
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
      ]);

      const total = totalDnsAccounts.length > 0 ? totalDnsAccounts.length : 0;

      let dnsAccounts = await DnsAccount.aggregate([
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

      dnsAccounts = dnsAccounts.map((dnsAccount) => ({
        ...dnsAccount,
        login: decryptText(dnsAccount.login),
        password: decryptText(dnsAccount.password),
      }));

      if (search) {
        const searchLower = search.toLowerCase();
        totalDnsAccounts = totalDnsAccounts
          .map((dnsAccount) => ({
            ...dnsAccount,
            login: decryptText(dnsAccount.login),
            password: decryptText(dnsAccount.password),
          }))
          .filter((hosting) => {
            return (
              hosting.login.toLowerCase().includes(searchLower) || hosting.name.toLowerCase().includes(searchLower)
            );
          });
        return NextResponse.json(
          { dnsAccounts: totalDnsAccounts, total, page, limit },
          { status: 200 }
        );
      } else {
        return NextResponse.json(
          { dnsAccounts, total, page, limit },
          { status: 200 }
        );
      }
    } else {
      // Якщо slug не передано, завантажуємо всі проекти
      let dnsAccounts = await DnsAccount.find({}).populate("projectCategory");
      dnsAccounts = dnsAccounts.map((dnsAccount) => ({
        ...dnsAccount.toObject(),
        login: decryptText(dnsAccount.login),
        password: decryptText(dnsAccount.password),
      }));
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
