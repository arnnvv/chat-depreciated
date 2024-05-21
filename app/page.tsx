"use client";
import Button from "@/components/ui/Button";
import { toast } from "sonner";

export default function Home() {
  return (
    <div>
      <Button
        onClick={() => {
          toast.success(`CLicked`);
        }}
      >
        Hello
      </Button>
    </div>
  );
}
