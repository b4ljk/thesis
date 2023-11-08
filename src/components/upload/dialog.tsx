import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { set } from "zod";
import OTPInput from "~/pages/otp/OTP";

interface DialogComponentProps {
  uploadAllFiles: (password: string, otp: string, Files: File[]) => void;
  files: File[];
}

export function DialogComponent({
  uploadAllFiles,
  files,
}: DialogComponentProps) {
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
      <Button
        onClick={() => {
          setIsModalOpen(true);
        }}
      >
        Илгээх
      </Button>
      <DialogContent className="sm:max-w-[525px]">
        <DialogTitle>Нууц үгээ оруулах</DialogTitle>
        <DialogHeader>
          <DialogDescription>
            Өөрийн утасны 2FA болон гарын үсгийн нууц үгээ оруулна уу
          </DialogDescription>
        </DialogHeader>
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="password" className="text-right">
            Нууц үг
          </Label>
          <Input
            id="password"
            className="col-span-3"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Нууц үгээ оруулна уу"
          />
        </div>
        <div className="flex items-center justify-end gap-2">
          <Label className="text-right">2FA Нууц үг</Label>
          <OTPInput value={otp} onChange={setOtp} length={6} />
        </div>

        <DialogFooter>
          <Button
            onClick={() => {
              uploadAllFiles(password, otp, files);
              setIsModalOpen(false);
            }}
          >
            Илгээх
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
