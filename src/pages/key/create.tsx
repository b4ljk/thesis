import { useRouter } from "next/router";
import { useState } from "react";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { api } from "~/utils/api";

export default function CreateKey() {
  const createKey = api.key_router.createKey.useMutation();
  const [key, setKey] = useState<string>("");
  const router = useRouter();

  const createKeyHandler = () => {
    createKey
      .mutateAsync({
        secretPassphrase: key,
      })
      .then(() => {
        router.push("/key");
      })
      .catch((err) => {
        console.error(err);
      });
  };

  return (
    <div className="container">
      <Input
        onChange={(e) => {
          setKey(e.target.value);
        }}
      />
      <Button onClick={createKeyHandler}>Гарын үсэг үүсгэх</Button>
    </div>
  );
}
