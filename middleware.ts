import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
    let response = NextResponse.next({
        request: {
            headers: request.headers,
        },
    });

    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                get(name: string) {
                    return request.cookies.get(name)?.value;
                },
                set(name: string, value: string, options: CookieOptions) {
                    request.cookies.set({
                        name,
                        value,
                        ...options,
                    });
                    response = NextResponse.next({
                        request: {
                            headers: request.headers,
                        },
                    });
                    response.cookies.set({
                        name,
                        value,
                        ...options,
                    });
                },
                remove(name: string, options: CookieOptions) {
                    request.cookies.set({
                        name,
                        value: "",
                        ...options,
                    });
                    response = NextResponse.next({
                        request: {
                            headers: request.headers,
                        },
                    });
                    response.cookies.set({
                        name,
                        value: "",
                        ...options,
                    });
                },
            },
        }
    );

    const {
        data: { user },
    } = await supabase.auth.getUser();

    // Protected routes pattern
    const isCompanyRoute = request.nextUrl.pathname.startsWith("/company");
    const isPlatformRoute = request.nextUrl.pathname.startsWith("/platform");
    const isAuthRoute = request.nextUrl.pathname.startsWith("/login");

    // 1. If trying to access protected route but not logged in -> Redirect to login
    // if (!user && (isCompanyRoute || isPlatformRoute)) {
    //     return NextResponse.redirect(new URL("/login", request.url));
    // }

    // 2. If logged in and trying to access login page -> Redirect to dashboard
    // if (user && isAuthRoute) {
    //     // Check role to redirect correctly (this is basic, more granular role checks in layout)
    //     // For now safe default is company dashboard, layout will redirect again if wrong role
    //     return NextResponse.redirect(new URL("/company/dashboard", request.url));
    // }

    return response;
}

export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         * - public folder
         * - api/auth (auth routes)
         */
        "/((?!_next/static|_next/image|favicon.ico|auth|api|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
    ],
};
