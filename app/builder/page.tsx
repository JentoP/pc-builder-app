import {createClient} from "@/utils/supabase/server";
import {redirect} from "next/navigation";
// import {useProfile} from "@/app/api/hooks/fetch-user";

export default async function Dashboard() {
    const supabase = await createClient();
    // const { profile, loading } = useProfile()
    //
    // const userData = {
    //     name: `${profile.firstName} ${profile.lastName}`.trim() || "Loading...",
    //     email: profile.email || "Loading...",
    //     avatar: `${profile.avatarUrl}` || " @public/images/avatar.png",
    // }
    const {
        data: {user},
    } = await supabase.auth.getUser();

    if (!user) {
        return redirect("/sign-in");
    }

    return (
        <div className="flex flex-col gap-6">
            <div className="text-2xl font-medium">Welcome to the PC Builder</div>
            <div className="flex gap-4 ">
                <div className="text-lg font-medium">Get started</div>

            </div>
        </div>
    );
}