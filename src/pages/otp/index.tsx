import React, { useState } from "react";
import OTPInput from "./OTP";
import { api } from "~/utils/api";
import { Button } from "~/components/ui/button";
import qrcode from "qrcode";
import { set } from "zod";
import Image from "next/image";

export default function OTP() {
  const data = api.otp_router.generateUrl.useQuery();
  const otpGenerator = api.otp_router.verify.useMutation();

  const [otp, setOtp] = useState("");
  const [qrImage, setQrImage] = useState("");
  return (
    <div className="container">
      <OTPInput value={otp} onChange={setOtp} length={6} />
      <Button
        onClick={async () => {
          const response = await otpGenerator.mutateAsync({
            otp: otp,
          });
          console.log(response);
        }}
      >
        Verify OTP
      </Button>
      {qrImage && (
        <Image
          src={qrImage}
          alt="qrcode"
          width={500}
          height={500}
          className="h-60 w-60"
        />
      )}
    </div>
  );
}
