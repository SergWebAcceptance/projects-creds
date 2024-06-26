import dbConnect from "@/lib/db";
import GitAccount from "@/models/GitSchema";
import { NextResponse } from "next/server";
import ProjectsCategory from "@/models/ProjectsCategory";
import { encryptText, decryptText } from "@/lib/cryptoUtils";
import { countPerPage } from "@/lib/constants";

export async function POST(req) {
  await dbConnect();
  try {
    const { name, login, password, projectCategory } = await req.json();

    // Перевірка на наявність GitAccount з таким name і login
    let gitAccount = await GitAccount.findOne({ name, login });

    if (!gitAccount) {
      const encryptedLogin = encryptText(login);
      const encryptedPassword = encryptText(password);
      gitAccount = await GitAccount.create({
        login: encryptedLogin,
        password: encryptedPassword,
        projectCategory,
      });
      return new Response(JSON.stringify(gitAccount), { status: 201 });
    } else {
      // Якщо знайдено, повертаємо існуючий
      return new Response(JSON.stringify(gitAccount), { status: 200 });
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

    const { gitAccountId, login, password, projectCategory } = await req.json();

    const encryptedLogin = encryptText(login);
    const encryptedPassword = encryptText(password);
    const newGitAccount = await GitAccount.updateOne(
      { _id: gitAccountId }, // Умова, за якою знаходиться документ. Наприклад, за ID.
      {
        $set: {
          login: encryptedLogin,
          password: encryptedPassword,
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
    const limit = parseInt(url.searchParams.get("limit")) || countPerPage;
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
      } else {
        gitAccount.login = decryptText(gitAccount.login);
        gitAccount.password = decryptText(gitAccount.password);
      }

      return NextResponse.json({ gitAccount }, { status: 200 });
    } else if (category) {
      let matchStage = {};
      if (category) {
        matchStage["projectCategory.name"] = category;
      }

      /*if (search) {
        matchStage["login"] = { $regex: search, $options: "i" };
      }*/

      let totalGitAccounts = await GitAccount.aggregate([
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

      const total = totalGitAccounts.length > 0 ? totalGitAccounts.length : 0;

      let gitAccounts = await GitAccount.aggregate([
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

      gitAccounts = gitAccounts.map((gitAccount) => ({
        ...gitAccount,
        login: decryptText(gitAccount.login),
        password: decryptText(gitAccount.password),
      }));

      if (search) {
        const searchLower = search.toLowerCase();
        totalGitAccounts = totalGitAccounts
          .map((gitAccount) => ({
            ...gitAccount,
            login: decryptText(gitAccount.login),
            password: decryptText(gitAccount.password),
          }))
          .filter((hosting) => {
            return hosting.login.toLowerCase().includes(searchLower);
          });
        return NextResponse.json(
          { gitAccounts: totalGitAccounts, total, page, limit },
          { status: 200 }
        );
      } else {
        return NextResponse.json(
          { gitAccounts, total, page, limit },
          { status: 200 }
        );
      }
    } else {
      // Якщо slug не передано, завантажуємо всі проекти
      let gitAccounts = await GitAccount.find({}).populate("projectCategory");

      gitAccounts = gitAccounts.map((gitAccount) => ({
        ...gitAccount.toObject(),
        login: decryptText(gitAccount.login),
        password: decryptText(gitAccount.password),
      }));

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
