import dbConnect from "@/lib/db";
import FtpAccount from "@/models/FtpAccountSchema";
import { NextResponse } from "next/server";
import ProjectsCategory from "@/models/ProjectsCategory";
import Hosting from "@/models/HostingSchema";
import { encryptText, decryptText } from "@/lib/cryptoUtils";
import { countPerPage } from "@/lib/constants";

export async function POST(req) {
  await dbConnect();
  try {
    const {
      protocol,
      host,
      login,
      password,
      port,
      hostingAccount,
      hostingAccountName,
      projectCategory,
    } = await req.json();

    // Перевірка на наявність FtpAccount з таким name і login
    let ftpAccount = await FtpAccount.findOne({ host, login });

    if (!ftpAccount) {
      const encryptedHost = encryptText(host);
      const encryptedLogin = encryptText(login);
      const encryptedPassword = encryptText(password);
      ftpAccount = await FtpAccount.create({
        protocol,
        host: encryptedHost,
        login: encryptedLogin,
        password: encryptedPassword,
        port,
        hostingAccount,
        hostingAccountName,
        projectCategory,
      });
      return new Response(JSON.stringify(ftpAccount), { status: 201 });
    } else {
      // Якщо знайдено, повертаємо існуючий
      return new Response(JSON.stringify(ftpAccount), { status: 200 });
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

    const {
      ftpAccountId,
      protocol,
      host,
      login,
      password,
      port,
      hostingAccount,
      hostingAccountName,
      projectCategory,
    } = await req.json();

    const encryptedHost = encryptText(host);
    const encryptedLogin = encryptText(login);
    const encryptedPassword = encryptText(password);
    const newFtpAccount = await FtpAccount.updateOne(
      { _id: ftpAccountId }, // Умова, за якою знаходиться документ. Наприклад, за ID.
      {
        $set: {
          protocol,
          host: encryptedHost,
          login: encryptedLogin,
          password: encryptedPassword,
          port,
          hostingAccount,
          hostingAccountName,
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
    const limit = parseInt(url.searchParams.get("limit")) || countPerPage;
    const skip = (page - 1) * limit;

    if (id) {
      // Якщо slug передано, шукаємо конкретний проект
      const ftpAccount = await FtpAccount.findOne({ _id: id })
        .populate("projectCategory")
        .populate("hostingAccount");

      if (!ftpAccount) {
        return NextResponse.json(
          { message: "Project not found" },
          { status: 404 }
        );
      } else {
        ftpAccount.host = decryptText(ftpAccount.host);
        ftpAccount.login = decryptText(ftpAccount.login);
        ftpAccount.password = decryptText(ftpAccount.password);
        if (ftpAccount.hostingAccount) {
          ftpAccount.hostingAccount.login = decryptText(
            ftpAccount.hostingAccount.login
          );
          ftpAccount.hostingAccount.password = decryptText(
            ftpAccount.hostingAccount.password
          );
        }
      }
      return NextResponse.json({ ftpAccount }, { status: 200 });
    } else if (category) {
      let matchStage = {};
      if (category) {
        matchStage["projectCategory.name"] = category;
      }

      // Додавання умови пошуку за доменом, якщо search присутній
      /*if (search) {
        matchStage["$or"] = [
          { host: { $regex: search, $options: "i" } },
          { login: { $regex: search, $options: "i" } },
          { hostingAccountName: { $regex: search, $options: "i" } },
        ];
      }*/

      let totalFtpAccounts = await FtpAccount.aggregate([
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

      const total = totalFtpAccounts.length > 0 ? totalFtpAccounts.length : 0;

      let ftpAccounts = await FtpAccount.aggregate([
        {
          $lookup: {
            from: "projectscategories", // the collection to join
            localField: "projectCategory", // field from the input documents
            foreignField: "_id", // field from the documents of the "from" collection
            as: "projectCategory", // output array field
          },
        },
        {
          $lookup: {
            from: "hostings",
            localField: "hostingAccount",
            foreignField: "_id",
            as: "hostingAccount",
          },
        },
        {
          $unwind: "$projectCategory", // Deconstructs the array
        },
        {
          $unwind: {
            path: "$hostingAccount",
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $match: matchStage,
        },
        { $skip: skip },
        { $limit: limit },
      ]);

      ftpAccounts = ftpAccounts.map((ftpAccount) => ({
        ...ftpAccount,
        host: decryptText(ftpAccount.host),
        login: decryptText(ftpAccount.login),
        password: decryptText(ftpAccount.password),
      }));

      if (search) {
        const searchLower = search.toLowerCase();
        totalFtpAccounts = totalFtpAccounts
          .map((ftpAccount) => ({
            ...ftpAccount,
            host: decryptText(ftpAccount.host),
            login: decryptText(ftpAccount.login),
            password: decryptText(ftpAccount.password),
          }))
          .filter((hosting) => {
            return (
              hosting.host.toLowerCase().includes(searchLower) ||
              hosting.login.toLowerCase().includes(searchLower) ||
              hosting.hostingAccountName.toLowerCase().includes(searchLower)
            );
          });
        return NextResponse.json(
          { ftpAccounts: totalFtpAccounts, total, page, limit },
          { status: 200 }
        );
      } else {
        return NextResponse.json(
          { ftpAccounts, total, page, limit },
          { status: 200 }
        );
      }
    } else {
      // Якщо slug не передано, завантажуємо всі проекти
      let ftpAccounts = await FtpAccount.find({})
        .populate("projectCategory")
        .populate("hostingAccount");

      ftpAccounts = ftpAccounts.map((ftpAccount) => ({
        ...ftpAccount.toObject(),
        host: decryptText(ftpAccount.host),
        login: decryptText(ftpAccount.login),
        password: decryptText(ftpAccount.password),
      }));

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
