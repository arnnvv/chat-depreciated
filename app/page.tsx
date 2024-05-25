"use client";
import Button from "@/components/ui/Button";
import { signOut } from "next-auth/react";
import { redirect } from "next/navigation";
import { toast } from "sonner";

export default function Home() {
  return (
    <div>
      <Button
        onClick={() => {
          signOut();
          toast.success("Signed out");
          redirect("/login");
        }}
      >
        Sign Out
      </Button>
    </div>
  );
}
