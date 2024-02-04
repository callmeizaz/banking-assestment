import { PrismaClient } from "@prisma/client";

import { hashPassword } from "./register";

export default async function handle(req, res) {
  if (req.method === "POST") {
    // login user
    await loginUserHandler(req, res);
  } else {
    return res.status(405).json({ message: "Method Not allowed" });
  }
}
// function to login user
export async function loginUserHandler(req, res) {
  const prisma = new PrismaClient();

  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ message: "invalid inputs" });
  }
  try {
    const user = await prisma.user.findUnique({
      where: { username },
      select: {
        id: true,
        username: true,
        checkingBalance: true,
        savingBalance: true,
        password: true,
      },
    });
    if (!user) return res.status(404).json({ message: "User not found" });

    if (user && user.password === hashPassword(password)) {
      delete user.password;
      // exclude password from json response
      return res.status(200).json({ user });
    } else {
      return res.status(401).json({ message: "invalid credentials" });
    }
  } catch (e) {
    throw new Error(e);
  }
}
