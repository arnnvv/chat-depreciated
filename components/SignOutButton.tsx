"use client";

import { ButtonHTMLAttributes, FC, useState } from "react";
import Button from "./ui/Button";
import { Loader2, LogOut } from "lucide-react";
import { toast } from "sonner";
import { signOut } from "next-auth/react";

interface SignOutButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {}

const SignOutButton: FC<SignOutButtonProps> = ({ ...props }) => {
  const [isSiginingOut, setIsSiginingOut] = useState<boolean>(false);
  return (
    <Button
      {...props}
      variant="ghost"
      onClick={async () => {
        setIsSiginingOut(true);
        try {
          await signOut();
        } catch (e) {
          toast.error("Error Signing Out");
        } finally {
          setIsSiginingOut(false);
        }
      }}
    >
      {isSiginingOut ? (
        <Loader2 className="animate-spin h-4 w-4" />
      ) : (
        <LogOut className="h-4 w-4" />
      )}
    </Button>
  );
};

export default SignOutButton;
