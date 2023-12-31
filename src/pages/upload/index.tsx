/* eslint-disable @typescript-eslint/no-misused-promises */
import { type ReactNode } from "react";
import UploadComponent from "~/components/upload";

import { api } from "~/utils/api";
import { type ChangeEvent, useState } from "react";
import { uploadToSignedUrl } from "~/lib/awsHelper";
import { FileText, XCircle } from "lucide-react";
import { Button } from "~/components/ui/button";
import toast from "react-hot-toast";
import { Progress } from "@/components/ui/progress";
import { set } from "react-hook-form";
import { useRouter } from "next/router";
import { DialogComponent } from "~/components/upload/dialog";

interface UploadProps {
  children: ReactNode;
}
const Upload: React.FC<UploadProps> = ({ children }) => {
  const [files, setFiles] = useState<File[]>([]);
  const router = useRouter();
  const preSign = api.s3_router.getSignedUrl.useMutation();
  const signFile = api.sign_router.signDocument.useMutation();
  const [uploadProgress, setUploadProgress] = useState<number[]>([]);

  const handleNewFile = (event: ChangeEvent<HTMLInputElement>) => {
    const { files } = event.target;
    if (!files?.length) return;

    setFiles((prev) => [...prev, ...files]);
  };

  const deleteItem = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
    setUploadProgress((prev) => prev.filter((_, i) => i !== index));
  };

  const uploadAllFiles = async (
    password: string,
    otp: string,
    files: File[],
  ) => {
    console.log(password, otp);
    let index = 0;
    for (const file of files) {
      const { name, type, size } = file;
      const signedUploadUrl = await preSign
        .mutateAsync({
          filename: name,
          filetype: type,
          size: size,
          otp: otp,
        })
        .catch((err) => {
          console.log(err);
        });
      if (!signedUploadUrl || !file) {
        console.log("Upload URL has not been set or no file selected.");
        return;
      }
      uploadToSignedUrl({
        signedUploadUrl: signedUploadUrl,
        file,
        setUploadProgress,
        index,
      })
        .then(async () => {
          toast.success("Амжилттай илгээлээ");
          const response = await signFile.mutateAsync({
            file_id: signedUploadUrl.db_id,
            passphrase: password,
            otp: otp,
          });
          // open new page
          router.replace(response.downloadUrl);
        })
        .catch((err) => {
          console.log(err);
        });
      index++;
    }
  };

  return (
    <div className="container">
      <p className="my-3 text-3xl font-bold">Гарын үсэг зурах</p>
      <UploadComponent handleNewFile={handleNewFile} />
      {files.length > 0 && (
        <div className="mt-5">
          <div className="flex justify-between">
            <p className="text-2xl font-bold">Оруулсан файлын жагсаалт</p>

            <DialogComponent uploadAllFiles={uploadAllFiles} files={files} />
          </div>
          <div className="my-2 flex flex-wrap gap-4">
            {files.map((file, index) => {
              console.log("file", file);
              return (
                <div
                  className="group relative flex max-h-40 w-40 flex-col rounded-md border-2 
                  border-slate-200 p-1 shadow-sm transition-colors 
                  duration-200 hover:border-primary hover:bg-slate-100 dark:hover:bg-slate-800"
                  key={file.name}
                >
                  <FileText size={32} className="m-auto" />
                  <div
                    onClick={() => deleteItem(index)}
                    className="absolute right-[-10px] top-[-10px] hidden cursor-pointer rounded-full bg-inherit group-hover:block"
                  >
                    <XCircle color="red" className="z-50" />
                  </div>
                  <p className="line-clamp-1">{file.name}</p>
                  <div>
                    <Progress
                      value={uploadProgress[index] ? uploadProgress[index] : 0}
                      color="bg-green-600"
                      className="h-1"
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default Upload;
