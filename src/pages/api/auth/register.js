import { SHA256 as sha256 } from "crypto-js";
// Prisma will help handle and catch errors
import { Prisma } from "@prisma/client";

import { PrismaClient } from "@prisma/client";

export default async function handle(req, res) {
  if (req.method === "POST") {
    // create user
    await createUserHandler(req, res);
  } else {
    return res.status(405).json({ message: "Method Not allowed" });
  }
}
export const hashPassword = (string) => {
  return sha256(string).toString();
};

// function to create user in our database
async function createUserHandler(req, res) {
  const prisma = new PrismaClient();

  console.log("Request", req.body);
  const { password } = req.body;

  if (password.length < 6) {
    return res
      .status(400)
      .json({ message: "password length should be more than 6 characters" });
  }
  try {
    const user = await prisma.user.create({
      data: { ...req.body, password: hashPassword(req.body.password) },
    });
    return res.status(201).json({ user });
  } catch (e) {
    console.log("ERROR", e);
    if (e instanceof Prisma.PrismaClientKnownRequestError) {
      if (e.code === "P2002") {
        if (e.meta && e.meta.target && e.meta.target.includes("username")) {
          // Unique constraint failed on the `username` field
          return res.status(400).json({ message: "Username is already taken" });
        }
      }
      return res.status(400).json({ message: e.message });
    }
    // Send a generic error response
    return res.status(500).json({ message: "Internal Server Error" });
  }
}
