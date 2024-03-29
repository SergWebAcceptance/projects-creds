import dbConnect from "@/lib/db";
import Hosting from "@/models/HostingSchema";

export async function POST(req) {
    await dbConnect();
    try {
        const { name, login, password } = await req.json();

        // Перевірка на наявність Hosting з таким name і login
        let hosting = await Hosting.findOne({ name, login });

        if (!hosting) {
            // Якщо не знайдено, створюємо новий
            hosting = await Hosting.create({ name, login, password });
            return new Response(JSON.stringify(hosting), {status: 201});
        } else {
            // Якщо знайдено, повертаємо існуючий
            return new Response(JSON.stringify(hosting), {status: 200});
        }
    } catch (error) {
        return new Response(JSON.stringify({ message: error.message }), {status: 500});
    }
}


export async function GET(res) {
    await dbConnect();
    try {
        const hostings = await Hosting.find({});
        return new Response(JSON.stringify(hostings), {status: 200});
    } catch (error) {
        return new Response(JSON.stringify({ message: error.message }), {status: 500});
    }
}