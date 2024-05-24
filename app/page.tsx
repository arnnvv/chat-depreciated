"use client";
import Button from "@/components/ui/Button";
import { signOut } from "next-auth/react";
import { toast } from "sonner";

export default function Home() {
  return (
    <div>
      <Button
        onClick={() => {
          signOut();
          toast.success("Signed out");
        }}
      >
        Sign Out
      </Button>
    </div>
  );
}
