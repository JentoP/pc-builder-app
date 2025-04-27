import {createClient} from "@/utils/supabase/server";
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
        Hello {user.email}!
      </div>
  );
}
