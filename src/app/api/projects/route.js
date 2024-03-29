import dbConnect from "@/lib/db";
import Project from "@/models/Project";
import DomainRegistrar from "@/models/DomainRegistrar";
import Hosting from "@/models/HostingSchema";
import ProjectsCategory from "@/models/ProjectsCategory";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    await dbConnect();

    const {
      domain,
      domainRegistrar,
      hosting,
      dns,
      github,
      wpAdmin,
      registerDate,
      expiredDate,
      projectsCategory,
      ftpSsh,
      testAccess,
    } = await req.json();

    // Перевірте, чи існують domainRegistrar і hosting по ID
    const existingRegistrar = await DomainRegistrar.findById(domainRegistrar);
    const existingHosting = await Hosting.findById(hosting);

    if (!existingRegistrar || !existingHosting) {
      throw new Error("Domain Registrar or Hosting not found");
    }

    const newProject = await Project.create({
      domain,
      domainRegistrar,
      hosting,
      dns, // За умови, що це об'єкт з login та password
      github, // Також об'єкт з login та password
      wpAdmin,
      registerDate,
      expiredDate,
      projectsCategory,
      ftpSsh,
      testAccess,
    });

    return new Response(JSON.stringify(newProject), { status: 201 });
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
      projectId,
      domain,
      domainRegistrar,
      hosting,
      dns,
      github,
      wpAdmin,
      registerDate,
      expiredDate,
      projectsCategory,
      ftpSsh,
      testAccess,
    } = await req.json();

    // Перевірте, чи існують domainRegistrar і hosting по ID
    const existingRegistrar = await DomainRegistrar.findById(domainRegistrar);
    const existingHosting = await Hosting.findById(hosting);

    if (!existingRegistrar || !existingHosting) {
      throw new Error("Domain Registrar or Hosting not found");
    }

    const newProject = await Project.updateOne(
      { _id: projectId }, // Умова, за якою знаходиться документ. Наприклад, за ID.
      {
        $set: {
          domain,
          domainRegistrar,
          hosting,
          dns,
          github,
          wpAdmin,
          registerDate,
          expiredDate,
          projectsCategory,
          ftpSsh,
          testAccess,
        },
      }
    );

    return new Response(JSON.stringify(newProject), { status: 201 });
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

    if (id) {
      // Якщо slug передано, шукаємо конкретний проект
      const project = await Project.findOne({ _id: id })
        .populate("domainRegistrar")
        .populate("hosting")
        .populate("projectsCategory");

      if (!project) {
        return NextResponse.json(
          { message: "Project not found" },
          { status: 404 }
        );
      }
      return NextResponse.json({ project }, { status: 200 });
    } else if (category) {
      let matchStage = {};
      if (category) {
        matchStage["projectsCategory.name"] = category;
      }

      // Додавання умови пошуку за доменом, якщо search присутній
      if (search) {
        matchStage["domain"] = { $regex: search, $options: "i" }; // Додавання нечутливого до регістру пошуку
      }

      const projects = await Project.aggregate([
        {
          $lookup: {
            from: "projectscategories",
            localField: "projectsCategory",
            foreignField: "_id",
            as: "projectsCategory",
          },
        },
        {
          $unwind: "$projectsCategory",
        },
        // Додавання умови пошуку
        {
          $match: matchStage,
        },
      ]);

      return NextResponse.json({ projects }, { status: 200 });
    } else {
      // Якщо slug не передано, завантажуємо всі проекти
      const projects = await Project.find({})
        .populate("domainRegistrar")
        .populate("hosting")
        .populate("projectsCategory");

      return NextResponse.json({ projects }, { status: 200 });
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

    const deletedProject = await Project.findByIdAndDelete(id);

    if (!deletedProject) {
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
