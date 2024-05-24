"use client";

import { FC, useState } from "react";
import Button from "./ui/Button";
import { emailSchema, Email, validateEmail } from "@/lib/validate";
import { ZodError } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import add from "@/actions/add";

const AddFriendButton: FC = () => {
  const [showSuccessState, setShowSuccessState] = useState<boolean>(false);

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<Email>({
    resolver: zodResolver(emailSchema),
  });

  const addFriend = async (data: Email) => {
    try {
      if (!validateEmail(data)) {
        toast.error("Enter valid email");
        return;
      }
      await add(data);
      setShowSuccessState(true);
    } catch (e) {
      if (e instanceof ZodError) {
        setError(`email`, { message: `Invalid email${e.message}` });
        toast.error("Invalid email");
        return;
      }
      setError(`email`, {
        message: `Something went wrong in component ${e}`,
      });
    }
  };
  return (
    <form
      action={add}
      onSubmit={handleSubmit(async (data: Email) => await addFriend(data))}
      className="max-w-sm"
    >
      <label
        htmlFor="email"
        className="block text-sm font-medium leading-6 text-gray-900"
      >
        Send friend request
      </label>

      <div className="mt-2 flex gap-4">
        <input
          {...register(`email`)}
          type="text"
          name="email"
          className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
          placeholder="123@xyz.com"
        />
        <Button>Send</Button>
      </div>
      <p className="mt-1 text-sm text-red-600">{errors.email?.message}</p>
      {showSuccessState ? (
        <p className="mt-1 text-sm text-green-600">Request sent!</p>
      ) : null}
    </form>
  );
};

export default AddFriendButton;
