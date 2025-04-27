import {createClient} from "@/app/api/supabase/server";
import {redirect} from "next/navigation";

export default async function Dashboard() {
    const supabase = await createClient();

    const {
        data: {user},
    } = await supabase.auth.getUser();

    if (!user) {
        return redirect("/sign-in");
    }

    return (
        <div className="flex flex-col gap-6">
            <h1 className="text-2xl font-medium">Projects</h1>
            <h2>These are your builds, you can delete, edit or share them with others.</h2>
            <div className="justify-center flex gap-4">
            {/*List of projects*/}
            </div>
        </div>
    );
}
