import Image from "next/image";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "../ui/button";
import { Label } from "@radix-ui/react-label";
import { Input } from "../ui/input";
import { type LoginInput } from "~/utils/schemas";
import { type SubmitHandler, useForm } from "react-hook-form";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useState } from "react";
import { signIn } from "next-auth/react";

export default function LoginButton() {
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  return (
    <Dialog open={isLoginModalOpen} onOpenChange={setIsLoginModalOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">Нэвтрэх</Button>
      </DialogTrigger>
      <DialogContent className="p-0 sm:max-w-[425px]">
        <LoginModal />
      </DialogContent>
    </Dialog>
  );
}

const LoginModal: React.FC = () => {
  const {
    handleSubmit,
    register,
    getValues,
    formState: { errors, isSubmitting },
  } = useForm<LoginInput>();

  async function submitData(data: LoginInput) {
    // await
    console.log(data);
    const res = await signIn("credentials", {
      redirect: false,
      email: data.email, // changed from "test"
      password: data.password, // changed from "test"
      callbackUrl: "/",
    });
    console.log(res);
  }

  return (
    <Card className="m-0 border-0 p-0 shadow-none">
      <CardHeader className="space-y-1">
        <CardTitle className="text-center text-3xl">Нэвтрэх</CardTitle>
        <CardDescription>
          {/* <div className="flex items-center mt-4">
            <Image
              src="/images/verified.png"
              alt="student"
              style={{ objectFit: "cover" }}
              className="mr-2 h-6 w-6"
              width={24}
              height={24}
              loading="lazy"
            />
            <p className="text-center">
              @stud.num.edu.mn мэйлээрээ нэвтэрч орвол санал баталгаажсан
              badge-тай бичигдэнэ
            </p>
          </div> */}
        </CardDescription>
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
      </CardContent>
    </Card>
  );
};
// {/* <div className="grid grid-cols-2 gap-6">
//           <Button
//             onClick={() => {
//               signInWithFacebook().then((response) => {
//                 const { user } = response;

//                 toast({
//                   className:
//                     "bg-green-400 flex items-center border-1 border-green-700",
//                   duration: 5000,
//                   children: <ToastNode email={user.email || ""} />,
//                 });
//               });
//             }}
//             variant="outline"
//           >
//             {/* <Icons.gitHub className="mr-2 h-4 w-4" /> */}
//             <FaFacebook size="22" className="mr-2" color="#4267B2" />
//             Facebook
//           </Button>
//           <Button
//             onClick={() => {
//               signInWithGoogle().then((response) => {
//                 const { user } = response;

//                 toast({
//                   className:
//                     "bg-green-400 flex items-center border-1 border-green-700",
//                   duration: 5000,
//                   children: <ToastNode email={user.email || ""} />,
//                 });
//               });
//             }}
//             variant="outline"
//           >
//             {/* <Icons.google className="mr-2 h-4 w-4" /> */}
//             <FcGoogle size="23" className="mr-2" />
//             Google
//           </Button>
//         </div> */}
