// import { ProfileForm } from "@/app/examples/forms/profile-form"
import { ProfileForm } from "~/components/profile";
import { Separator } from "~/components/ui/separator";

export default function SettingsProfilePage() {
  return (
    <div className="container mt-8 space-y-6">
      <div>
        <h3 className="text-xl font-medium">Профайл</h3>
        <p className="text-sm text-muted-foreground">
          Та өөрийн тухай мэдээллийг оруулна уу.
        </p>
      </div>
      <Separator />
      <ProfileForm />
    </div>
  );
}
