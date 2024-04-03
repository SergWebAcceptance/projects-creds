import dbConnect from "@/lib/db";
import Project from "@/models/Project";
import DomainRegistrar from "@/models/DomainRegistrar";
import Hosting from "@/models/HostingSchema";
import ProjectsCategory from "@/models/ProjectsCategory";
import { NextResponse } from "next/server";
import DnsAccount from "@/models/DnsSchema";
import FtpAccount from "@/models/FtpAccountSchema";
import GitAccount from "@/models/GitSchema";

export async function POST(req) {
  try {
    await dbConnect();

    const {
      domain,
      domainRegistrar,
      hosting,
      dnsAccount,
      gitAccount,
      ftpAccount,
      wpAdmin,
      registerDate,
      expiredDate,
      projectsCategory,
      ftpSsh,
      testAccess,
    } = await req.json();

    if(domainRegistrar){
      const existingRegistrar = await DomainRegistrar.findById(domainRegistrar);
      if (!existingRegistrar) {
        throw new Error("Domain Registrar not found");
      }
    }
    if(hosting){
      const existingHosting = await Hosting.findById(hosting);
      if (!existingHosting) {
        throw new Error("Hosting Account not found");
      }
    }
    if(dnsAccount){
      const existingDNSAccount = await DnsAccount.findById(dnsAccount);
      if (!existingDNSAccount) {
        throw new Error("DNS Account not found");
      }
    }
    if(ftpAccount){
      const existingFTPAccount = await FtpAccount.findById(ftpAccount);
      if (!existingFTPAccount) {
        throw new Error("FTP Account not found");
      }
    }
    

    const newProject = await Project.create({
      domain,
      domainRegistrar,
      hosting,
      dnsAccount,
      gitAccount,
      ftpAccount,
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
      gitAccount,
      ftpAccount,
      wpAdmin,
      registerDate,
      expiredDate,
      projectsCategory,
      ftpSsh,
      testAccess,
    } = await req.json();

    

    if(domainRegistrar){
      const existingRegistrar = await DomainRegistrar.findById(domainRegistrar);
      if (!existingRegistrar) {
        throw new Error("Domain Registrar not found");
      }
    }
    if(hosting){
      const existingHosting = await Hosting.findById(hosting);
      if (!existingHosting) {
        throw new Error("Hosting Account not found");
      }
    }
    if(dnsAccount){
      const existingDNSAccount = await DnsAccount.findById(dnsAccount);
      if (!existingDNSAccount) {
        throw new Error("DNS Account not found");
      }
    }
    if(ftpAccount){
      const existingFTPAccount = await FtpAccount.findById(ftpAccount);
      if (!existingFTPAccount) {
        throw new Error("FTP Account not found");
      }
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
          gitAccount,
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
        .populate("ftpAccount")
        .populate("gitAccount");

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
        .populate("ftpAccount")
        .populate("gitAccount");

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
