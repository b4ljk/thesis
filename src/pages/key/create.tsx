import { useRouter } from "next/router";
import { useState } from "react";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { api } from "~/utils/api";
import { zodResolver } from "@hookform/resolvers/zod";
import { useFieldArray, useForm } from "react-hook-form";
import * as z from "zod";
import { cn } from "@/lib/utils";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import toast from "react-hot-toast";

const keyFormSchema = z
  .object({
    password: z
      .string()
      .refine(
        (password) =>
          /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/.test(
            password,
          ),
        {
          message:
            "Нууц үг нь дор хаяж 1 жижиг үсэг, 1 том үсэг, 1 тоо, 1 тусгай тэмдэгт агуулсан байх ёстой бөгөөд дор хаяж 8 тэмдэгтээс бүрдэх ёстой.",
        },
      ),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Нууц үг тохирохгүй байна.",
    path: ["confirmPassword"],
  });

type keyForm = z.infer<typeof keyFormSchema>;

export default function CreateKey() {
  const createKey = api.key_router.createKey.useMutation();
  const createdKey = api.key_router.checkIfKeyExists.useQuery();

  const defaultValue: Partial<keyForm> = {
    password: "",
    confirmPassword: "",
  };

  const form = useForm<keyForm>({
    resolver: zodResolver(keyFormSchema),
    mode: "onSubmit",
    defaultValues: defaultValue,
  });

  function onSubmit(data: keyForm) {
    createKey
      .mutateAsync({
        secretPassphrase: data.password,
      })
      .then((resp) => {
        // router.push("/key");
        window.open(resp.downloadUrl, "_blank");
        toast.success("Түлхүүр амжилттай үүслээ.");
        createdKey.refetch();
      })
      .catch((err) => {
        console.error(err);
      });
  }

  return (
    <div className="container">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Гарын үсгийн нууц үг</FormLabel>
                <FormControl>
                  <Input type="password" placeholder="Нууц үг" {...field} />
                </FormControl>
                <FormDescription>
                  Энд оруулсан нууц үгийг та цахим гарын үсгээ ашиглахдаа
                  хэрэглэх болно.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Нууц үг давтах</FormLabel>
                <FormControl>
                  <Input
                    type="password"
                    placeholder="Нууц үгээ давтах"
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  Хэрвээ та нууц үгээ мартсан тохиолдолд шинэ гарын үсэг
                  үүсгэхээс өөр аргагүй гэдгийг анхаарна уу.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button
            disabled={!!createdKey?.data || createKey.isLoading}
            type="submit"
          >
            {!!createdKey?.data
              ? "Танд үүссэн гарын үсэг байна"
              : "Гарын үсэг үүсгэх"}
          </Button>
        </form>
      </Form>
    </div>
  );
}
