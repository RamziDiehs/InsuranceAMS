import { cookies } from "next/headers";
import { Role } from "@prisma/client";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "plaintext_test_secret";

export function getUserFromToken() {
  const cookieStore = cookies();
  const token = cookieStore.get("token")?.value;
  if (!token) return null;

  try {
    const payload = jwt.verify(token, JWT_SECRET) as {
      userId: string;
      role: Role;
    };
    return payload;
  } catch {
    return null;
  }
}
