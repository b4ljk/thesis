import React, { useEffect, useState } from "react";
import OTPInput from "./one-time-pass";
import { api } from "~/utils/api";
import { Button } from "~/components/ui/button";
import QRCode from "qrcode";
import { set } from "zod";
import Image from "next/image";
import { CheckCircle } from "lucide-react";
import toast from "react-hot-toast";
import { useRouter } from "next/router";

const generateQR = async (text?: string) => {
  if (!text) {
    return;
  }
  try {
    return await QRCode.toDataURL(text);
  } catch (err) {
    console.error(err);
  }
};

export default function OTP() {
  const router = useRouter();
  const query = api.otp_router.generateUrl.useQuery();
  const confirm = api.otp_router.confirm.useMutation();
  const ifActivated = api.otp_router.ifActivated.useQuery();
  const [qrImage, setQrImage] = useState("");
  const [otp, setOtp] = useState("");

  useEffect(() => {
    if (otp.length === 6) {
      confirm
        .mutateAsync({ secret: query.data?.secret ?? "", otp: otp })
        .then((res) => {
          console.log(res);
          ifActivated.refetch();
          toast.success("Амжилттай идэвхжлээ");
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, [otp]);

  useEffect(() => {
    if (ifActivated.data?.isActivated) {
      router.replace("/profile");
    }
  }, [ifActivated.data?.isActivated]);

  if (query.isLoading) {
    return (
      <div className="flex flex-1 items-center justify-center">
        <Button isLoading={true}></Button>
      </div>
    );
  }
  const qrCodeImage = generateQR(query.data?.qrUrl).then((res) => {
    if (!res || qrImage) return;
    setQrImage(res);
  });

  return (
    <div className="container flex flex-1 flex-col items-center justify-center gap-4 ">
      <div className="text-center">
        <h1 className="text-3xl font-bold">Two factor authentication</h1>
        <p className="text-sm text-muted-foreground">
          Та дараах QR кодыг Microsoft Authenticator эвсэл Google Authenticator
          аппликейшн дээрээс уншуулна уу.
        </p>
      </div>
      {!ifActivated?.data?.isActivated && (
        <div className="flex flex-col items-center">
          <Image
            src={qrImage}
            alt="qrcode"
            width={200}
            height={200}
            className="z-50"
          />
          <p className="text-center text-sm text-muted-foreground">
            Өөрийн Authenticator app дээр шинээр ирсэн 6 оронтой баталгаажуулах
            <br />
            кодыг идэвхтэй хугацаанд нь амжиж доорх хэсэгт оруулна.
          </p>
          <OTPInput value={otp} onChange={setOtp} length={6} />
        </div>
      )}

      <Button
        isLoading={confirm.isLoading}
        onClick={async () => {
          if (!otp || ifActivated?.data?.isActivated) return;
          const response = await confirm.mutateAsync({
            secret: query.data?.secret ?? "",
            otp: otp,
          });
          ifActivated.refetch();
          toast.success("Амжилттай идэвхжлээ");
        }}
      >
        {!ifActivated?.data?.isActivated ? (
          "Баталгаажуулах"
        ) : (
          <div className="flex items-center gap-3">
            <CheckCircle strokeWidth={3} className="text-green-500" /> 2FA
            идэвхитэй
          </div>
        )}
      </Button>
    </div>
  );
}
