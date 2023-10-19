import { useRouter } from "next/router";
import { Button } from "~/components/ui/button";
import { api } from "~/utils/api";

export default function CreateKey() {
  const createKey = api.key_router.createKey.useMutation();
  const router = useRouter();
  return (
    <div>
      <Button
        onClick={() => {
          createKey
            .mutateAsync({
              secretPassphrase: "test",
            })
            .then((res) => {
              window.open(res.downloadUrl);
            })
            .catch((err) => {
              console.log(err);
            });
        }}
      >
        test
      </Button>
    </div>
  );
}
