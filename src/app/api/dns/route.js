import dbConnect from "@/lib/db";
import DnsAccount from "@/models/DnsSchema";

export async function POST(req) {
    await dbConnect();
    try {
        const { name, login, password } = await req.json();

        // Перевірка на наявність Hosting з таким name і login
        let dnsAccount = await DnsAccount.findOne({ name, login });

        if (!dnsAccount) {
            // Якщо не знайдено, створюємо новий
            dnsAccount = await DnsAccount.create({ name, login, password });
            return new Response(JSON.stringify(dnsAccount), {status: 201});
        } else {
            // Якщо знайдено, повертаємо існуючий
            return new Response(JSON.stringify(dnsAccount), {status: 200});
        }
    } catch (error) {
        return new Response(JSON.stringify({ message: error.message }), {status: 500});
    }
}


export async function GET(res) {
    await dbConnect();
    try {
        const dnsAccounts = await DnsAccount.find({});
        return new Response(JSON.stringify(dnsAccounts), {status: 200});
    } catch (error) {
        return new Response(JSON.stringify({ message: error.message }), {status: 500});
    }
}