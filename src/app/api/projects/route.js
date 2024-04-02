import dbConnect from "@/lib/db";
import Project from "@/models/Project";
import DomainRegistrar from "@/models/DomainRegistrar";
import Hosting from "@/models/HostingSchema";
import ProjectsCategory from "@/models/ProjectsCategory";
import { NextResponse } from "next/server";
import DnsAccount from "@/models/DnsSchema";
import FtpAccount from "@/models/FtpAccountSchema";


export async function POST(req) {
  try {
    await dbConnect();

    const {
      domain,
      domainRegistrar,
      hosting,
      dnsAccount,
      ftpAccount,
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
    const existingDNSAccount = await DnsAccount.findById(dnsAccount);
    const existingFTPAccount = await FtpAccount.findById(ftpAccount);

    if (!existingRegistrar || !existingHosting || !existingDNSAccount || !existingFTPAccount) {
      throw new Error("Domain Registrar or Hosting not found");
    }

    const newProject = await Project.create({
      domain,
      domainRegistrar,
      hosting,
      dnsAccount,
      ftpAccount,
      github,
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
      dnsAccount,
      ftpAccount,
      github,
      wpAdmin,
      registerDate,
      expiredDate,
      projectsCategory,
      ftpSsh,
      testAccess,
    } = await req.json();

    const existingRegistrar = await DomainRegistrar.findById(domainRegistrar);
    const existingHosting = await Hosting.findById(hosting);
    const existingDNSAccount = await DnsAccount.findById(dnsAccount);
    const existingFTPAccount = await FtpAccount.findById(ftpAccount);

    if (!existingRegistrar || !existingHosting || !existingDNSAccount || !existingFTPAccount) {
      throw new Error("Domain Registrar or Hosting not found");
    }

    const newProject = await Project.updateOne(
      { _id: projectId },
      {
        $set: {
          domain,
          domainRegistrar,
          hosting,
          dnsAccount,
          ftpAccount,
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
    const page = parseInt(url.searchParams.get("page")) || 1;
    const limit = parseInt(url.searchParams.get("limit")) || 10;
    const skip = (page - 1) * limit;

    if (id) {
      const project = await Project.findOne({ _id: id })
        .populate("domainRegistrar")
        .populate("hosting")
        .populate("projectsCategory")
        .populate("dnsAccount")
        .populate("ftpAccount");

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
      if (search) {
        matchStage["domain"] = { $regex: search, $options: "i" };
      }

      const totalProjects = await Project.aggregate([
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
        {
          $match: matchStage,
        }
      ]);

      const total = totalProjects.length > 0 ? totalProjects.length : 0;

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
        {
          $match: matchStage,
        },
        { $skip: skip },
        { $limit: limit },
      ]);

      if (search) {
        return NextResponse.json(
          { projects: totalProjects, total, page, limit },
          { status: 200 }
        );
      } else {
        return NextResponse.json(
          { projects, total, page, limit },
          { status: 200 }
        );
      }
    } else {
      const projects = await Project.find({})
        .populate("domainRegistrar")
        .populate("hosting")
        .populate("projectsCategory")
        .populate("dnsAccount")
        .populate("ftpAccount");

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
    const { id } = await req.json();

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
