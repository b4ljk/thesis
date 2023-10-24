import { type ChangeEvent, useState } from "react";
import toast from "react-hot-toast";
import UploadComponent from "~/components/upload";
import { uploadToSignedUrl } from "~/lib/awsHelper";
import { api } from "~/utils/api";

export default function Verify() {
  const [files, setFiles] = useState<File[]>([]);
  const preSign = api.s3_router.getSignedUrl.useMutation();
  const verifyFile = api.sign_router.verifyDocument.useMutation();
  const [uploadProgress, setUploadProgress] = useState<number[]>([]);

  const handleNewFile = (event: ChangeEvent<HTMLInputElement>) => {
    const { files } = event.target;
    if (!files?.length) return;

    setFiles((prev) => [...prev, ...files]);
  };

  const uploadAllFiles = async (files: File[]) => {
    let index = 0;
    for (const file of files) {
      const { name, type, size } = file;
      const signedUploadUrl = await preSign
        .mutateAsync({
          filename: name,
          filetype: type,
          size: size,
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
          const response = await verifyFile.mutateAsync({
            file_id: signedUploadUrl.db_id,
          });
        })
        .catch((err) => {
          console.log(err);
        });
      index++;
    }
  };

  return (
    <div className="container">
      <div className="my-3">
        <p className="text-3xl font-bold">Бичиг баримтыг шалгах</p>
        <p className="mt-[-5px] text-gray-400">
          Бичиг баримтын бүрэн бүтэн байдлыг алгоритмоор шалгах
        </p>
      </div>
      <UploadComponent
        handleNewFile={handleNewFile}
        subTitle="Баталгаажуулах бичиг баримтаа оруулна уу."
      />
    </div>
  );
}
