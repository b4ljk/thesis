import Center from "~/components/ui/center";
import { Input } from "@/components/ui/input";
import { Label } from "~/components/ui/label";
import { decryptMessage, encryptMessage } from "~/utils/encryption";
import { useState } from "react";
import { UploadCloud } from "lucide-react";

interface UploadComponentType {
  handleNewFile: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function UploadComponent({
  handleNewFile,
}: UploadComponentType) {
  return (
    <Center>
      <div className="flex-1">
        <Label className="cursor-pointer" htmlFor="file_upload">
          <div className="flex h-56 flex-col items-center justify-center rounded-md border-2 border-dashed border-gray-300 transition-colors duration-200 hover:border-primary hover:bg-slate-100 dark:hover:bg-slate-800">
            <div>
              <UploadCloud size={50} strokeWidth={2.5} />
            </div>
            <p className="my-2 text-2xl">Файл оруулах</p>
            <p className=" text-gray-600">
              Гарын үсэг зурах бичиг баримтыг оруулна уу
            </p>
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
