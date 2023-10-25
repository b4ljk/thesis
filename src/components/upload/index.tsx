import Center from "~/components/ui/center";
import { Input } from "@/components/ui/input";
import { Label } from "~/components/ui/label";
import { decryptMessage, encryptMessage } from "~/utils/encryption";
import { useState } from "react";
import { UploadCloud } from "lucide-react";

interface UploadComponentType {
  handleNewFile: (event: React.ChangeEvent<HTMLInputElement>) => void;
  title?: string;
  subTitle?: string;
  icon?: React.ReactNode;
}

export default function UploadComponent({
  handleNewFile,
  title = "Файл оруулах",
  subTitle = "Гарын үсэг зурах бичиг баримтыг оруулна уу",
  icon,
}: UploadComponentType) {
  return (
    <Center>
      <div className="flex-1">
        <Label className="cursor-pointer" htmlFor="file_upload">
          <div className="flex h-56 flex-col items-center justify-center rounded-md border-2 border-dashed border-gray-300 transition-colors duration-200 hover:border-primary hover:bg-slate-100 dark:hover:bg-slate-800">
            <div>
              {!icon ? <UploadCloud size={50} strokeWidth={2.5} /> : icon}
            </div>
            <p className="my-2 text-2xl">{title}</p>
            <p className=" text-gray-600">{subTitle}</p>
          </div>
        </Label>
        {/* only allow pdf */}
        <Input
          className="hidden"
          id="file_upload"
          type="file"
          accept="application/pdf"
          multiple
          onChange={handleNewFile}
        />
      </div>
    </Center>
  );
}
