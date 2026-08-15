// app/(dashboard)/dashboard/profile/page.tsx
import { auth } from "@/auth";
import ProfileForm from "@/components/profile/profile-form";

export default async function ProfilePage() {
  const session = await auth();
  const user = session?.user;

  return (
    <div className="max-w-lg mx-auto py-8 px-4 space-y-6">
      <div>
        <h1 className="text-xl font-semibold">Profile</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Manage your account details.
        </p>
      </div>

      <ProfileForm
        initialName={user?.name ?? ""}
        email={user?.email ?? ""}
      />
    </div>
  );
}