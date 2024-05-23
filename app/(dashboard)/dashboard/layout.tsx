import { Icons } from "@/components/Icons";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ReactNode } from "react";
import { SidebarNavProps } from "@/types/sidebarNavProps";

interface LayoutProps {
  children: ReactNode;
}

const sidebarNav: SidebarNavProps[] = [
  {
    id: 1,
    name: "Add friend",
    href: "/dashboard/add",
    icon: Icons.UserPlus,
  },
];

const Layout = async ({ children }: LayoutProps) => {
  const session = await getServerSession(authOptions);
  if (!session) {
    notFound();
  }
  return (
    <div className="w-full flex h-screen">
      <div className="flex h-full w-full max-w-xs grow flex-col gap-y-5 overflow-y-auto border-r border-gray-200 bg-white px-6">
        <Link href="/dashboard" className="flex h-16 shrink-10 items-center">
          <Icons.Logo className="h-8 w-auto" />
        </Link>

        <div className="text-xs font-semibold leading-6 text-gray-400">
          Chats
        </div>
        <nav className="flex flex-1 flex-col">
          <ul role="list" className="flex flex-1 flex-col gap-y-7">
            <li>xyz ke sath chats</li>
            <li>
              <div className="text-xs font-semibold leading-6 text-gray-400">
                Archived
              </div>
              <ul role="list" className="-mx-2 mt-2 space-y-1"></ul>
            </li>
          </ul>
        </nav>
      </div>
      {children}
    </div>
  );
};

export default Layout;
