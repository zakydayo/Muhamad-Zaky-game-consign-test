import {cookies} from "next/headers";
import {logout} from "@/actions/logout";
import {redirect} from 'next/navigation';
import Link from 'next/link';

export default function Page() {
    const cookie = cookies().get('auth');
    if (!cookie) {
        redirect('auth/login');
    };

    return (
        <div className="flex flex-col gap-5 p-5 bg-zinc-100 w-full h-dvh">
            <div className="flex justify-between items-baseline">
                <h1 className='font-bold text-2xl'>Form Page</h1>
                <form action={logout}>
                    <button type="submit" className="mt-3 bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-xl focus:outline-none focus:shadow-outline">Logout</button>
                </form>
            </div>

            <ul className="text-xl font-semibold p-5 bg-white w-fit rounded-xl text-sky-950">
                <Link href={"/form"}>Form Link</Link>
            </ul>
        </div>
    );

}