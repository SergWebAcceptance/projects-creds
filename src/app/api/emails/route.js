import dbConnect from "@/lib/db";
import EmailAccounts from "@/models/EmailAccounts";
import { NextResponse } from "next/server";
import ProjectsCategory from "@/models/ProjectsCategory";
import { encryptText, decryptText } from "@/lib/cryptoUtils";

export async function POST(req) {
  await dbConnect();
  try {
    const { email, password, aliases, emailCategory } = await req.json();

    // Перевірка на наявність Hosting з таким name і login
    let newEmail = await EmailAccounts.findOne({ email });

    if (!newEmail) {
      const encryptedEmail = encryptText(email);
      const encryptedPassword = encryptText(password);
      newEmail = await EmailAccounts.create({
        email: encryptedEmail,
        password: encryptedPassword,
        aliases,
        emailCategory,
      });
      return new Response(JSON.stringify(newEmail), { status: 201 });
    } else {
      // Якщо знайдено, повертаємо існуючий
      return new Response(JSON.stringify(newEmail), { status: 200 });
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

    const { emailId, email, password, aliases, projectsCategory } =
      await req.json();
    const encryptedEmail = encryptText(email);
    const encryptedPassword = encryptText(password);
    const newEmail = await EmailAccounts.updateOne(
      { _id: emailId }, // Умова, за якою знаходиться документ. Наприклад, за ID.
      {
        $set: {
          email: encryptedEmail,
          password: encryptedPassword,
          aliases,
          projectsCategory,
        },
      }
    );

    return new Response(JSON.stringify(newEmail), { status: 201 });
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
      const email = await EmailAccounts.findOne({ _id: id }).populate(
        "emailCategory"
      );

      if (!email) {
        return NextResponse.json(
          { message: "Project not found" },
          { status: 404 }
        );
      } else {
        // Decrypt login and password here
        email.email = decryptText(email.email);
        email.password = decryptText(email.password);
      }
      return NextResponse.json({ email }, { status: 200 });
    } else if (category) {
      let matchStage = {};
      if (category) {
        matchStage["emailCategory.name"] = category;
      }

      // Додавання умови пошуку за доменом, якщо search присутній
      if (search) {
        matchStage["$or"] = [
          { email: { $regex: search, $options: "i" } }, // Додавання пошуку по полю email
          { aliases: { $regex: search, $options: "i" } }, // Додавання пошуку по полю aliases
        ];
      }

      const totalEmails = await EmailAccounts.aggregate([
        {
          $lookup: {
            from: "projectscategories", // the collection to join
            localField: "emailCategory", // field from the input documents
            foreignField: "_id", // field from the documents of the "from" collection
            as: "emailCategory", // output array field
          },
        },
        {
          $unwind: "$emailCategory", // Deconstructs the array
        },
        {
          $match: matchStage,
        }
      ]);

      const total = totalEmails.length > 0 ? totalEmails.length : 0;

      let emails = await EmailAccounts.aggregate([
        {
          $lookup: {
            from: "projectscategories", // the collection to join
            localField: "emailCategory", // field from the input documents
            foreignField: "_id", // field from the documents of the "from" collection
            as: "emailCategory", // output array field
          },
        },
        {
          $unwind: "$emailCategory", // Deconstructs the array
        },
        {
          $match: matchStage,
        },
        { $skip: skip },
        { $limit: limit },
      ]);

      emails = emails.map(email => ({
        ...email,
        email: decryptText(email.email),
        password: decryptText(email.password),
      }));

      if(search) {
        return NextResponse.json({ emails: totalEmails, total, page, limit }, { status: 200 });
      } else {
        return NextResponse.json({ emails, total, page, limit }, { status: 200 });
      }
    } else {
      // Якщо slug не передано, завантажуємо всі проекти
      let emails = await EmailAccounts.find({}).populate("emailCategory");
      emails = emails.map(email => ({
        ...email,
        email: decryptText(email.email),
        password: decryptText(email.password),
      }));
      return NextResponse.json({ emails }, { status: 200 });
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

    const deletedEmail = await EmailAccounts.findByIdAndDelete(id);

    if (!deletedEmail) {
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
