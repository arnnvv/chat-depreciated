import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { FC } from "react";

const Dashboard: FC = async (): Promise<JSX.Element> => {
  const session = await getServerSession(authOptions);
  return (
    <div>
      <pre>{JSON.stringify(session)}</pre>
    </div>
  );
};

export default Dashboard;
