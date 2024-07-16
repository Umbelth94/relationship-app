import { useUser } from "@auth0/nextjs-auth0/client";
import { useRouter } from "next/navigation";

export default function Navbar() {
    let { user, error, isLoading } = useUser();

    const router = useRouter()  

    return (
            <div className="flex w-screen h-[3.5rem] bg-primary items-center justify-end">
               
               {/* login/logout */}
                <button className="bg-secondary hover:bg-secondary/75 rounded p-[.5rem] mx-[.5rem] text-on-secondary " onClick={() => router.push(`/api/auth/${user ? 'logout' : 'login'}`)}>
                    {user ? 'Log Out' : 'Login'}
                </button>


            </div>
    )
}