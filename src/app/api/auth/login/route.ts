export const dynamic = 'force-dynamic' // defaults to auto
import { cookies } from "next/headers";

export async function POST(request: Request) {
    const {username, password} = await request.json();
    if (!username || !password) {
        return Response.json({ success: false, error: 'Email and password are required' }, { status: 400 });
    }
    cookies().set({
        httpOnly: true,
        name: 'auth',
        value: '123',
    })
    return Response.json({ success: true });
}