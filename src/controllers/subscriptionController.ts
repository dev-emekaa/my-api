import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const subscribeUser = async (req: Request, res: Response) => {
  const { plan } = req.body;
  const userId = req.user.id;

  const subscription = await prisma.subscription.create({
    data: { userId, plan, status: "active" },
  });

  res.json({ message: "Subscription successful", subscription });
};

export const getSubscription = async (req: Request, res: Response) => {
  const subscription = await prisma.subscription.findUnique({
    where: { userId: req.user.id },
  });

  if (!subscription) {
    res.status(404).json({ message: "No subscription found" });
    return;
  }

  res.json(subscription);
};

export const updateSubscription = async (req: Request, res: Response) => {
  const { plan } = req.body;
  const subscription = await prisma.subscription.update({
    where: { userId: req.user.id },
    data: { plan },
  });

  res.json({ message: "Subscription updated", subscription });
};

export const cancelSubscription = async (req: Request, res: Response) => {
  await prisma.subscription.delete({ where: { userId: req.user.id } });

  res.json({ message: "Subscription canceled" });
};
