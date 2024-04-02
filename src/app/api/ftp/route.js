import dbConnect from "@/lib/db";
import FtpAccount from "@/models/FtpAccountSchema";

export async function POST(req) {
    await dbConnect();
    try {
        const { protocol, host, login, password, port, projectCategory } = await req.json();

        // Перевірка на наявність Hosting з таким name і login
        let ftpAccount = await FtpAccount.findOne({ host, login });

        if (!ftpAccount) {
            // Якщо не знайдено, створюємо новий
            ftpAccount = await FtpAccount.create({ protocol, host, login, password, port, projectCategory });
            return new Response(JSON.stringify(ftpAccount), {status: 201});
        } else {
            // Якщо знайдено, повертаємо існуючий
            return new Response(JSON.stringify(ftpAccount), {status: 200});
        }
    } catch (error) {
        return new Response(JSON.stringify({ message: error.message }), {status: 500});
    }
}


export async function GET(res) {
    await dbConnect();
    try {
        const ftpAccounts = await FtpAccount.find({});
        return new Response(JSON.stringify(ftpAccounts), {status: 200});
    } catch (error) {
        return new Response(JSON.stringify({ message: error.message }), {status: 500});
    }
}