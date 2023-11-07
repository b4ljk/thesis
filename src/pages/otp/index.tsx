import React, { useState } from "react";
import OTPInput from "./OTP";

export default function OTP() {
  const [otp, setOtp] = useState("");
  return (
    <div className="container">
      <OTPInput value={otp} onChange={setOtp} length={6} />
    </div>
  );
}
