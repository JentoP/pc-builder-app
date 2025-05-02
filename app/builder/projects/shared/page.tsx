import {createClient} from "@/supabase/server";
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
            <h1>Shared Projects</h1>
            <h2>Welcome {user.email} to the PC Builder</h2>
            <div className="justify-center flex gap-4">

            </div>
        </div>
    );
}
