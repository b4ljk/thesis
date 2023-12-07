/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import * as forge from "node-forge";
import { Button } from "~/components/ui/button";
import { cn } from "~/lib/utils";
import toast from "react-hot-toast";
import { use, useCallback, useState } from "react";
import { set } from "zod";

const generateKey = () => {
  return forge.random.getBytesSync(16); // 16 bytes for AES 128-bit key
  // Q: how many bytes for 256-bit key?
  // A: 32 bytes
};

// Generate a secure random IV
const generateIV = () => {
  return forge.random.getBytesSync(16); // block size for AES is always 16
};

// encryption function
const encryptMessage = (plainText: string, key: string, iv: string) => {
  const cipher = forge.cipher.createCipher("AES-CBC", key);
  cipher.start({ iv: iv });
  cipher.update(forge.util.createBuffer(forge.util.encodeUtf8(plainText)));
  cipher.finish();
  return cipher.output.toHex();
};

// decryption function
const decryptMessage = (cipherText: string, key: string, iv: string) => {
  const decipher = forge.cipher.createDecipher("AES-CBC", key);
  decipher.start({ iv: iv });
  decipher.update(forge.util.createBuffer(forge.util.hexToBytes(cipherText)));
  decipher.finish();
  return forge.util.decodeUtf8(decipher.output.getBytes());
};

export default function Cryptography() {
  const [plainText, setPlainText] = useState("");
  const [cipherText, setCipherText] = useState("");
  const [decryptedText, setDecryptedText] = useState("");
  const [bitSize, setBitSize] = useState(2048);
  const [speedMs, setSpeedMs] = useState(0);
  const [key, setKey] = useState(generateKey());
  const [iv, setIv] = useState(generateIV());

  const handleEncrypt = useCallback(() => {
    try {
      const encrypted = encryptMessage(plainText, key, iv);
      setCipherText(encrypted);
    } catch (e) {
      console.error("Failed to encrypt:", e);
      // Handle or display the error to the user
      toast.error("Шифрлэхэд алдаа гарлаа");
    }
  }, [plainText, key, iv]);

  const handleDecrypt = useCallback(() => {
    try {
      const decrypted = decryptMessage(cipherText, key, iv);
      setDecryptedText(decrypted);
    } catch (e) {
      console.error("Failed to decrypt:", e);
      toast.error("Шифр тайлахад алдаа гарлаа");
      throw e;
    }
  }, [cipherText, key, iv]);

  return (
    <div className="container">
      <h1 className="text-3xl font-bold">Криптограф</h1>
      <p className="font-bold text-muted-foreground">AES</p>
      <div className="flex flex-col gap-6">
        <div className="">
          <Label className="text-muted-foreground">Түлхүүр (Нууц)</Label>
          <div className="flex gap-6">
            <Input
              value={forge.util.bytesToHex(key)}
              onChange={(e) => setKey(forge.util.hexToBytes(e.target.value))}
            />
          </div>
        </div>
        <div className="">
          <Label className="text-muted-foreground">
            Шифрлэх мэдээлэл (Энгийн текст)
          </Label>
          <div className="flex gap-6">
            <Input
              value={plainText}
              onChange={(e) => setPlainText(e.target.value)}
            />
            <Button
              onClick={() => {
                const start = new Date().getTime();
                handleEncrypt();
              }}
            >
              Шифрлэх
            </Button>
          </div>
        </div>
        <div className="">
          <Label className="text-muted-foreground">Шифрлэгдсэн мэдээлэл</Label>
          <textarea
            value={cipherText}
            rows={4}
            className={cn(
              "flex  w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
            )}
            onChange={(e) => setCipherText(e.target.value)}
          />
        </div>
        <Button
          onClick={() => {
            const start = new Date().getTime();
            const end = new Date().getTime();
            try {
              handleDecrypt();
              setSpeedMs(end - start);
              toast.success(end - start + " ms");
            } catch (e) {}
          }}
        >
          Тайлах
        </Button>
        <div className="">
          <Label className="text-muted-foreground">Тайлагдсан мэдээлэл</Label>
          <textarea
            value={decryptedText}
            rows={4}
            onChange={(e) => setDecryptedText(e.target.value)}
            className={cn(
              "flex  w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
            )}
          />
        </div>
      </div>
    </div>
  );
}
