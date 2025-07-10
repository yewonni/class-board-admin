import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function Home() {
  const cookieStore = await cookies();
  const refreshToken = cookieStore.get("refreshToken");

  if (refreshToken) {
    redirect("/dashboard");
  } else {
    redirect("/login");
  }
}
