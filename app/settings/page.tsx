import {createClient} from "@/utils/supabase/server";
import {redirect} from "next/navigation";
import UpdateUserProfile from "@/components/update-user-info";

export default async function Settings() {
    const supabase = await createClient();

    const {
        data: {user},
    } = await supabase.auth.getUser();

    if (!user) {
        return redirect("/sign-in");
    }

    return (
        <div className="flex flex-col gap-6">
            <h1 className="text-2xl font-bold">Settings</h1>
            <div className="gap-4 left-0">
                <h2 className="text-lg font-medium">Account Info</h2>
                <UpdateUserProfile/>

            </div>
        </div>
    );
}
