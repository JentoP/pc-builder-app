import {createClient} from "@/utils/supabase/server";
import {redirect} from "next/navigation";
import UpdateUserProfile from "@/components/user/UpdateUserInfo";
import BackButton from '@/components/ui/BackButton';

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
            <div className="flex items-center justify-between mb-8">
                <BackButton/>
                <h1 className="text-2xl font-bold flex-1 text-center">Settings</h1>
            </div>
            <div className="gap-4 left-0">
                <h2 className="text-lg font-medium">Account Info</h2>
                <UpdateUserProfile />
            </div>
        </div>
    );
}
