import Center from "~/components/ui/center";
import { Input } from "@/components/ui/input";
import { Label } from "~/components/ui/label";
import { decryptMessage, encryptMessage } from "~/utils/encryption";
import { useState } from "react";

export default function MainHome() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [key, setKey] = useState("");

  const encryptionHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    const encrypted = encryptMessage(e.target.value, key);
    setOutput(encrypted);
    setInput(e.target.value);
  };

  const decrypted = decryptMessage(output, key);
  return (
    <Center>
      <div className="grid grid-cols-2 gap-2">
        <Input placeholder="input" onChange={encryptionHandler} />
        <Input placeholder="key" onChange={(e) => setKey(e.target.value)} />
        <Input
          className="col-span-2"
          value={output}
          disabled
          placeholder="output"
        />
        <Input
          className="col-span-2"
          value={decrypted}
          disabled
          placeholder="output"
        />
        <div className="col-span-2 grid w-full max-w-sm items-center gap-1.5">
          <Label className="cursor-pointer" htmlFor="file_upload">
            <div className="flex h-24 items-center justify-center rounded-md border-2 border-dashed border-blue-600 transition-colors duration-200 hover:bg-slate-200">
              Гарын үсэг зурах бичиг баримтыг оруулна уу
            </div>
          </Label>
          <Input className="hidden" id="file_upload" type="file" />
        </div>
      </div>
    </Center>
  );
}
