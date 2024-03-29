import dbConnect from "@/lib/db";
import Category from "@/models/ProjectsCategory";

export async function GET(res) {
    await dbConnect();
    try {
        const categories = await Category.find({});
        return new Response(JSON.stringify(categories), {status: 200});
    } catch (error) {
        return new Response(JSON.stringify({ message: error.message }), {status: 500});
    }
}