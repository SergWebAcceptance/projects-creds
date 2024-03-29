import dbConnect from "@/lib/db";
import DomainRegistrar from "@/models/DomainRegistrar";

export async function POST(req) {
    await dbConnect();
    try {
        const { name, login, password } = await req.json();

        // Перевірка на наявність DomainRegistrar з таким name і login
        let registrar = await DomainRegistrar.findOne({ name, login });

        if (!registrar) {
            // Якщо не знайдено, створюємо новий
            registrar = await DomainRegistrar.create({ name, login, password });
            return new Response(JSON.stringify(registrar), {status: 201});
        } else {
            // Якщо знайдено, повертаємо існуючий
            return new Response(JSON.stringify(registrar), {status: 200});
        }
    } catch (error) {
        return new Response(JSON.stringify({ message: error.message }), {status: 500});
    }
}

export async function GET(res) {
    await dbConnect();
    try {
        const registrars = await DomainRegistrar.find({});
        return new Response(JSON.stringify(registrars), {status: 200});
    } catch (error) {
        return new Response(JSON.stringify({ message: error.message }), {status: 500});
    }
}