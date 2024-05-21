import Button from "@/components/ui/Button";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { getServerSession } from "next-auth";
import { FC } from "react";

const Dashboard: FC = async ({}) => {
  const session = await getServerSession(authOptions);
  return (
    <div>
      <pre>{JSON.stringify(session)}</pre>
    </div>
  );
};

export default Dashboard;
