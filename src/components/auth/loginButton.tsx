/* eslint-disable @typescript-eslint/no-misused-promises */
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "../ui/button";
import { Label } from "@radix-ui/react-label";
import { Input } from "../ui/input";
import { type LoginInput } from "~/utils/schemas";
import { useForm } from "react-hook-form";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { useState } from "react";
import { signIn } from "next-auth/react";
import { api } from "~/utils/api";
import toast from "react-hot-toast";
import { useRouter } from "next/router";
import { useModalStore } from "~/stores";

export default function LoginButton() {
  // const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isLoginModal, setIsLoginModal] = useState(true);
  const { isModalOpen: isLoginModalOpen, setModal: setIsLoginModalOpen } =
    useModalStore();
  const handleModal = () => {
    setIsLoginModalOpen(!isLoginModalOpen);
  };

  const handleModalType = () => {
    setIsLoginModal(!isLoginModal);
  };

  return (
    <Dialog open={isLoginModalOpen} onOpenChange={setIsLoginModalOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">Нэвтрэх</Button>
      </DialogTrigger>
      <DialogContent className="p-0 sm:max-w-[425px]">
        {isLoginModal ? (
          <LoginModal
            handleModal={handleModal}
            handleModalType={handleModalType}
          />
        ) : (
          <RegisterModal
            handleModal={handleModal}
            handleModalType={handleModalType}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}

interface ModalProps {
  handleModal: () => void;
  handleModalType: () => void;
}

const LoginModal: React.FC<ModalProps> = ({ handleModal, handleModalType }) => {
  const router = useRouter();
  const {
    handleSubmit,
    register,
    getValues,
    formState: { errors, isSubmitting },
  } = useForm<LoginInput>();

  async function submitData(data: LoginInput) {
    // await
    const res = await signIn("credentials", {
      redirect: false,
      email: data.email, // changed from "test"
      password: data.password, // changed from "test"
      callbackUrl: "/otp/create",
    });
    if (res?.ok) {
      handleModal();
      router.push(res.url ?? "/").then(() => {
        toast.success("Амжилттай нэвтэрлээ");
      });
    } else {
      console.log(res);
      toast.error("Нэвтрэх нэр эсвэл нууц үг буруу байна.", {
        style: {
          textAlign: "center",
        },
      });
    }
  }

  return (
    <Card className="m-0 border-0 p-0 shadow-none">
      <CardHeader className="space-y-1">
        <CardTitle className="text-center text-3xl">Нэвтрэх</CardTitle>
        <CardDescription></CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4">
        <form onSubmit={handleSubmit(submitData)}>
          <>
            <div className="grid gap-2">
              <Label htmlFor="email">Цахим шуудан</Label>
              <Input
                id="email"
                type="email"
                placeholder={"info@cloudsign.mn"}
                {...register("email", {
                  required: {
                    value: true,
                    message: "Цахим шуудан оруулна уу",
                  },
                })}
              />
              <p className="mb-2 text-sm font-bold text-red-500">
                {errors.email?.message}
              </p>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="password">Нууц үг</Label>
              <Input
                id="password"
                type="password"
                placeholder={"*********"}
                {...register("password", {
                  required: true,
                  minLength: {
                    value: 2,
                    message: "Нууц үг 8 тэмдэгтээс их байна",
                  },
                })}
              />
              <p className="mb-2 text-sm font-bold text-red-500">
                {errors.password?.message}
              </p>
            </div>
            <Button type="submit" className="w-full ">
              Нэвтрэх
            </Button>
          </>
        </form>
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-2 text-muted-foreground">
              Эсвэл
            </span>
          </div>
        </div>
        <Button
          type="submit"
          onClick={handleModalType}
          variant={"secondary"}
          className="w-full "
        >
          Бүртгүүлэх
        </Button>
      </CardContent>
    </Card>
  );
};

interface RegisterInput {
  email: string;
  password: string;
  confirm_password: string;
}

const RegisterModal: React.FC<ModalProps> = ({
  handleModal,
  handleModalType,
}) => {
  const {
    handleSubmit,
    register,
    getValues,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<RegisterInput>();
  const registUser = api.auth_router.register.useMutation();

  function submitData(data: RegisterInput) {
    const res = registUser
      .mutateAsync(data)
      .then((res) => {
        toast.success("Амжилттай бүртгэгдлээ");
        handleModal();
      })
      .catch((err) => {
        console.log(err);
        toast.error("Бүртгэл амжилтгүй боллоо");
      });
    console.log(res);
  }

  return (
    <Card className="m-0 border-0 p-0 shadow-none">
      <CardHeader className="space-y-1">
        <CardTitle className="text-center text-3xl">Бүртгүүлэх</CardTitle>
        <CardDescription></CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4">
        <form onSubmit={handleSubmit(submitData)}>
          <>
            <div className="grid gap-2">
              <Label htmlFor="email">Цахим шуудан</Label>
              <Input
                id="email"
                type="email"
                placeholder={"info@cloudsign.mn"}
                {...register("email", {
                  required: {
                    value: true,
                    message: "Цахим шуудан оруулна уу",
                  },
                })}
              />
              <p className="mb-2 text-sm font-bold text-red-500">
                {errors.email?.message}
              </p>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="password">Нууц үг</Label>
              <Input
                id="password"
                type="password"
                placeholder={"*********"}
                {...register("password", {
                  required: true,
                  minLength: {
                    value: 2,
                    message: "Нууц үг 8 тэмдэгтээс их байна",
                  },
                })}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="confirm_password">Нууц үг давтах</Label>
              <Input
                id="confirm_password"
                type="password"
                placeholder={"*********"}
                {...register("confirm_password", {
                  required: true,
                  validate: (val: string) => {
                    if (watch("password") != val) {
                      return "Нууц үг таарахгүй байна";
                    }
                  },
                })}
              />
              <p className="mb-2 text-sm font-bold text-red-500">
                {errors.confirm_password?.message}
              </p>
            </div>
            <Button type="submit" className="w-full ">
              Бүртгүүлэх
            </Button>
          </>
        </form>
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-2 text-muted-foreground">
              Эсвэл
            </span>
          </div>
        </div>
        <Button
          type="submit"
          onClick={handleModalType}
          variant={"secondary"}
          className="w-full "
        >
          Нэвтрэх
        </Button>
      </CardContent>
    </Card>
  );
};
