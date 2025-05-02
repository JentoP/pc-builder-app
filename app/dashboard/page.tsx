import {createClient} from "@/supabase/server";
import {redirect} from "next/navigation";
import {hasEnvVars} from "@/supabase/check-env-vars";
import {EnvVarWarning} from "@/components/nextjs/env-var-warning";
import HeaderAuth from "@/components/nextjs/header-auth";

export default async function Dashboard() {
  const supabase = await createClient();

  const {
    data: {user},
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/sign-in");
  }

  return (
      <div className="text-2xl">
        Dashboard
      </div>

  );
}
