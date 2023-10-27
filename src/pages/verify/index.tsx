import { type Prisma } from "@prisma/client";
import {
  FileLock2,
  FileText,
  FileX2,
  ShieldCheck,
  ShieldX,
  XCircle,
  ShieldQuestion,
  BadgeCheck,
  Check,
  X,
} from "lucide-react";
import { type ChangeEvent, useState, type PropsWithChildren } from "react";
import toast from "react-hot-toast";
import { Button } from "~/components/ui/button";
import { Progress } from "~/components/ui/progress";
import UploadComponent from "~/components/upload";
import { uploadToSignedUrl } from "~/lib/awsHelper";
import { api } from "~/utils/api";
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
import { Separator } from "@/components/ui/separator";

interface FileInformation {
  validity: boolean;
  fileName: string;
  createdAt?: Date;
  owner?: Prisma.UserGetPayload<{
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    select?: any;
  }>;
}

export default function Verify() {
  const [files, setFiles] = useState<File[]>([]);
  const [validFiles, setValidFiles] = useState<FileInformation[]>([]);
  const preSign = api.s3_router.getSignedUrl.useMutation();
  const verifyFile = api.sign_router.verifyDocument.useMutation();

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
        .then(() => {
          toast.success("Амжилттай илгээлээ");

          verifyFile
            .mutateAsync({
              file_id: signedUploadUrl.db_id,
            })
            .then((res) => {
              if (res.validity) {
                setValidFiles((prev) => [
                  ...prev,
                  {
                    validity: res.validity,
                    fileName: file.name,
                    createdAt: res.signedDate,
                    owner: res.user ?? undefined,
                  },
                ]);
              } else {
                setValidFiles((prev) => [
                  ...prev,
                  {
                    validity: res.validity,
                    fileName: file.name,
                  },
                ]);
              }
            })
            .catch((err) => {
              console.log(err);
              setValidFiles((prev) => [
                ...prev,
                {
                  validity: false,
                  fileName: file.name,
                },
              ]);
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
        icon={<ShieldQuestion size={50} strokeWidth={2.5} />}
      />
      {files.length > 0 && (
        <div className="mt-5">
          <div className="flex justify-between">
            <p className="text-2xl font-bold">Оруулсан файлын жагсаалт</p>
            <Button
              onClick={() => {
                uploadAllFiles(files);
              }}
            >
              Илгээх
            </Button>
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
      {validFiles.length > 0 && (
        <div className="mt-5">
          <div className="flex items-center">
            <p className="text-2xl font-bold">Баталгаажсан файлын жагсаалт</p>
            <ShieldCheck size={30} color="green" />
          </div>
          <div className="my-2 flex flex-wrap gap-4">
            {validFiles
              .filter((e) => e.validity)
              .map((file, index) => {
                console.log("file", file);
                return (
                  <FileItem
                    key={index}
                    file={file}
                    icon={
                      <FileLock2 size={32} className="m-auto text-green-700" />
                    }
                  />
                );
              })}
          </div>
        </div>
      )}
      {validFiles.length > 0 && (
        <div className="mt-5">
          <div className="flex items-center">
            <p className="text-2xl font-bold">Хуурамч файлын жагсаалт</p>
            <ShieldX size={30} className="text-red-500" />
          </div>
          <div className="my-2 flex flex-wrap gap-4">
            {validFiles
              .filter((e) => !e.validity)
              .map((file, index) => {
                console.log("file", file);
                return (
                  <FileItem
                    key={index}
                    file={file}
                    icon={<FileX2 size={30} className="m-auto text-red-600" />}
                  />
                );
              })}
          </div>
        </div>
      )}
    </div>
  );
}

interface FileItemProps {
  icon: React.ReactNode;
  file: FileInformation;
}

const FileItem: React.FC<PropsWithChildren<FileItemProps>> = ({
  children,
  icon,
  file,
}) => {
  const [open, setOpen] = useState(false);
  const handleClose = (setOpen: React.Dispatch<boolean>) => {
    setOpen(false);
  };

  const ValidIcon = file.validity ? (
    <Check size={24} strokeWidth={3} className="text-green-600" />
  ) : (
    <X size={26} strokeWidth={3} color="red" />
  );
  return (
    <Dialog
      onOpenChange={(e) => {
        setOpen(e);
      }}
      open={open}
    >
      <DialogTrigger>
        <div
          className="group relative flex max-h-40 w-40 cursor-pointer flex-col rounded-md 
border-2 border-slate-200 p-1 shadow-sm transition-colors
duration-200 hover:border-primary hover:bg-slate-100 dark:hover:bg-slate-800"
          key={file.fileName}
        >
          {icon}
          <p className="line-clamp-1">{file.fileName}</p>
        </div>
      </DialogTrigger>
      <DialogContent className="lg:max-w-xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-1">
            <p className="text-2xl">Баталгаажуулалт</p>
            <BadgeCheck color="white" size={30} fill="#17a3f2" />
          </DialogTitle>
          <DialogDescription>
            Баталгаажсан бичиг баримтын мэдээлэл
          </DialogDescription>
        </DialogHeader>
        {
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              {ValidIcon}
              <Label>бичиг баримт хөндөгдөөгүй</Label>
            </div>
            <div className="flex items-center gap-2">
              {ValidIcon}
              {file.createdAt && (
                <p className="text-sm font-bold">
                  {file.createdAt?.toLocaleString()}
                </p>
              )}
              <Label>Баталгаажуулалтын огноо</Label>
            </div>
            {file.owner && (
              <div className="flex items-center gap-2">
                {ValidIcon}
                <p className="text-sm font-bold"> {file.owner?.email}</p>
                <Label>баталгаажуулсан</Label>
              </div>
            )}
            <div className="flex items-center gap-2">
              {ValidIcon}
              <p className="text-sm font-bold">CloudSign.mn</p>
              <Label>баталгаажуулагч</Label>
            </div>
            <div className="flex items-center gap-2">
              {ValidIcon}
              <Label>Баталгаажуулалт</Label>
            </div>
          </div>
        }

        <DialogFooter>
          <Button
            onClick={() => {
              handleClose(setOpen);
            }}
          >
            Хаах
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
