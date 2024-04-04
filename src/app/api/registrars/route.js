import dbConnect from "@/lib/db";
import DomainRegistrar from "@/models/DomainRegistrar";
import { NextResponse } from "next/server";
import ProjectsCategory from "@/models/ProjectsCategory";
import { encryptText, decryptText } from "@/lib/cryptoUtils";

export async function POST(req) {
  await dbConnect();
  try {
    const { name, login, password, card, projectCategory } = await req.json();

    // Перевірка на наявність DomainRegistrar з таким name і login
    let registrar = await DomainRegistrar.findOne({ name, login });

    if (!registrar) {
      const encryptedLogin = encryptText(login);
      const encryptedPassword = encryptText(password);
      registrar = await DomainRegistrar.create({
        name,
        login: encryptedLogin,
        password: encryptedPassword,
        card,
        projectCategory,
      });
      return new Response(JSON.stringify(registrar), { status: 201 });
    } else {
      // Якщо знайдено, повертаємо існуючий
      return new Response(JSON.stringify(registrar), { status: 200 });
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

    const { domainRegistrarId, name, login, password, card, projectCategory } =
      await req.json();
    const encryptedLogin = encryptText(login);
    const encryptedPassword = encryptText(password);
    const newDomainRegistrar = await DomainRegistrar.updateOne(
      { _id: domainRegistrarId }, // Умова, за якою знаходиться документ. Наприклад, за ID.
      {
        $set: {
          name,
          login: encryptedLogin,
          password: encryptedPassword,
          card,
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
      } else {
        // Decrypt login and password here
        registrar.login = decryptText(registrar.login);
        registrar.password = decryptText(registrar.password);
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
        },
      ]);

      const total =
        totalDomainRegistrars.length > 0 ? totalDomainRegistrars.length : 0;

      let registrars = await DomainRegistrar.aggregate([
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

      registrars = registrars.map((registrar) => ({
        ...registrar,
        login: decryptText(registrar.login),
        password: decryptText(registrar.password),
      }));

      if (search) {
        return NextResponse.json(
          { registrars: totalDomainRegistrars, total, page, limit },
          { status: 200 }
        );
      } else {
        return NextResponse.json(
          { registrars, total, page, limit },
          { status: 200 }
        );
      }
    } else {
      // Якщо slug не передано, завантажуємо всі проекти
      let registrars = await DomainRegistrar.find({}).populate(
        "projectCategory"
      );

      registrars = registrars.map((registrar) => ({
        ...registrar.toObject(),
        login: decryptText(registrar.login),
        password: decryptText(registrar.password),
      }));

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
