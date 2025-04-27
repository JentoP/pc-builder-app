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
        <div className="flex flex-col gap-2">
            <h1 className="text-2xl font-medium">Deleted Projects</h1>
            <h2 className="text-sm">These builds have been deleted, empty trash to permanently delete them.</h2>
            <div className="justify-center flex gap-4">
            {/*List of deleted projects*/}
            </div>
        </div>
    );
}
