import {createClient} from "@/supabase/server";
import {redirect} from "next/navigation";

export default async function NewBuild() {
    const supabase = await createClient();

    const {
        data: {user},
    } = await supabase.auth.getUser();

    if (!user) {
        return redirect("/sign-in");
    }

    return (
        <div className="flex flex-col gap-6">
            <h1>Create a new PC Build</h1>
        </div>
    );
}
