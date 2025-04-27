import {createClient} from "@/app/api/supabase/server";
import {redirect} from "next/navigation";

export default async function EditBuild() {
    const supabase = await createClient();

    const {
        data: {user},
    } = await supabase.auth.getUser();

    if (!user) {
        return redirect("/sign-in");
    }

    return (
        <div className="flex flex-col gap-6">
            <h1>Edit a PC Build</h1>
        </div>
    );
}
