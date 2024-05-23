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
    icon: "UserPlus",
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
              <ul role="list" className="-mx-2 mt-2 space-y-1">
                {sidebarNav.map((opn: SidebarNavProps) => {
                  const Icon = Icons[opn.icon];
                  return (
                    <li key={opn.id}>
                      <Link
                        href={opn.href}
                        className="text-gray-700 hover:text-cyan-500 hover: bg-gray-50 group flex gap-3 rounded-md p-2 text-sm leading-6 font-semibold"
                      >
                        <span className="text-gray-400 border-gray-200 group-hover:border-b group-hover:text-cyan-500 flex h-6 w-6 shrink-0 items-center justify-center rounded-lg border text-[0.625rem] font-medium bg-white">
                          <Icon className="h-4 w-4" />
                        </span>

                        <span className="truncate">{opn.name}</span>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </li>
          </ul>
        </nav>
      </div>
      {children}
    </div>
  );
};

export default Layout;
