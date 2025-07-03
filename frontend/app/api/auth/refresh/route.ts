import { NextRequest, NextResponse } from "next/server";
import { auth, setCookies } from "@/lib/auth/auth";

// Helper to fetch JWT token
async function getJwtToken(headers: Headers) {
  // Note: Use absolute URL in Next.js API routes
  const result = await fetch(
    `${process.env.NEXT_PUBLIC_API_SERVER}/api/auth/token`,
    {
      headers,
      // Optionally, set credentials if needed
      // credentials: 'include'
    },
  );
  if (!result.ok) {
    console.error("Could not refresh JWT token", await result.text());
    return null;
  }
  const body = await result.json();
  return body.token;
}

// Unauthorized response
function unauthorized() {
  return NextResponse.json({}, { status: 401 });
}

// Authorized response with cookies
function authorized(
  userid: string,
  email: string,
  jwt: string,
  name: string,
  image: string,
) {
  const response = NextResponse.json({}, { status: 200 });
  setCookies(response.headers, { userid, email, jwt, name, image });
  return response;
}

// Main route handler
export async function GET(request: NextRequest) {
  const session = await auth.api.getSession({
    headers: request.headers,
  });
  if (!session) {
    console.info("Could not get session");
    return unauthorized();
  }

  const token = await getJwtToken(request.headers);
  if (!token) {
    console.info("Could not get JWT token");
    return unauthorized();
  }

  console.info("Refreshed JWT token");
  return authorized(
    session.user.id,
    session.user.email,
    token,
    session.user.name,
    session.user.image || "",
  );
}
