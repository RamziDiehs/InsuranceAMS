import ClientTable from "@/app/(dashboard)/clients/ClientTable";
import prisma from "@/lib/prisma";
import { Client, Role } from "@prisma/client";
import { cookies } from "next/headers"; // 🔥 Needed for server-side auth
import { redirect } from "next/navigation";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "plaintext_test_secret";

export default async function ClientsPage() {
  // Move getUserFromToken logic directly inside
  const cookieStore = cookies();
  const token = cookieStore.get("token")?.value;
  

  if (!token) {
    redirect("/login");
  }

  let user: { userId: string; role: Role } | null = null;

  try {
    user = jwt.verify(token, JWT_SECRET) as { userId: string; role: Role };
  } catch {
    redirect("/login");
  }
  console.log("Token:", user);
  if (!user) {
    redirect("/login");
  }

  let clients: Client[] = [];

  if (user.role === Role.ADMIN) {
    clients = await prisma.client.findMany({
      orderBy: { createdAt: "desc" },
    });
  } else if (user.role === Role.AGENT) {
    clients = await prisma.client.findMany({
      where: { agentId: user.userId },
      orderBy: { createdAt: "desc" },
    });
  }

  return (
    <div className="p-6">
      <ClientTable clients={clients} />
    </div>
  );
}
