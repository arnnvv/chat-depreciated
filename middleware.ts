import { JWT, getToken } from "next-auth/jwt";
import { NextRequestWithAuth, withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  async (
    req: NextRequestWithAuth,
  ): Promise<NextResponse<unknown> | undefined> => {
    const pathname: string = req.nextUrl.pathname;

    const isAuth: JWT | null = await getToken({ req });
    const isLoginPage: boolean = pathname.startsWith("/login");

    const sensitiveRoute: string[] = ["dashboard"];
    const isAccessingSensitiveRoute = sensitiveRoute.some(
      (route: string): boolean => pathname.startsWith(`/${route}`),
    );

    if (isLoginPage) {
      if (isAuth) {
        return NextResponse.redirect(new URL("/dashboard", req.url));
      }
      return NextResponse.next();
    }

    if (!isAuth && isAccessingSensitiveRoute) {
      return NextResponse.redirect(new URL("/login", req.url));
    }

    if (pathname === "/") {
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }
  },
  {
    callbacks: {
      async authorized() {
        return true;
      },
    },
  },
);

export const config = {
  matcher: ["/", "/login", "/dashboard/:path*"],
};
