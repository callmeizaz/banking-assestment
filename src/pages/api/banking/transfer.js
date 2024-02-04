import { PrismaClient } from "@prisma/client";

export default async function handle(req, res) {
  if (req.method === "PATCH") {
    // update funds
    await transferFund(req, res);
  } else {
    return res.status(405).json({ message: "Method Not allowed" });
  }
}

// function to update funds in our database
async function transferFund(req, res) {
  const prisma = new PrismaClient();

  const { id, amount, to, from } = req.body;

  try {
    const prevAccount = await prisma.user.findFirst({
      where: { id },
    });

    console.log(prevAccount);
    const updatedUser = await prisma.user.update({
      where: { id },
      data: {
        [to]: amount,
        [from]: prevAccount[from] - amount,
      },
    });

    return res.status(200).json({
      message: "Account updated successfully",
      user: updatedUser,
    });
  } catch (e) {
    console.log("Error ", e);
    throw new Error(e);
  }
}
