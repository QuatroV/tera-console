import { Instance, Prisma, User } from "@prisma/client";
import customConfig from "../config/default";
import redisClient from "../utils/connectRedis";
import { signJwt } from "../utils/jwt";
import { prisma } from "../utils/prisma";

export const createUser = async (input: Prisma.UserCreateInput) => {
  return (await prisma.user.create({
    data: input,
  })) as User;
};

export const findUser = async (
  where: Prisma.UserWhereInput,
  select?: Prisma.UserSelect
) => {
  return await prisma.user.findFirst({
    where,
    select,
  });
};

export const findUsers = async (
  where?: Prisma.UserWhereInput,
  select?: Prisma.UserSelect
) => {
  return await prisma.user.findMany({
    where,
    select,
  });
};

export const findUniqueUser = async (
  where: Prisma.UserWhereUniqueInput,
  select?: Prisma.UserSelect
) => {
  return (await prisma.user.findUnique({
    where,
    select,
  })) as User;
};

export const updateUser = async (
  where: Prisma.UserWhereUniqueInput,
  data: Prisma.UserUpdateInput,
  select?: Prisma.UserSelect
) => {
  return (await prisma.user.update({ where, data, select })) as User;
};

export const signTokens = async (user: Prisma.UserCreateInput) => {
  // 1. Create Session
  redisClient.set(`${user.id}`, JSON.stringify(user), {
    EX: customConfig.redisCacheExpiresIn * 60,
  });

  // 2. Create Access and Refresh tokens
  const access_token = signJwt({ sub: user.id }, "accessTokenPrivateKey", {
    expiresIn: `${customConfig.accessTokenExpiresIn}m`,
  });

  const refresh_token = signJwt({ sub: user.id }, "refreshTokenPrivateKey", {
    expiresIn: `${customConfig.refreshTokenExpiresIn}m`,
  });

  return { access_token, refresh_token };
};

export const createInstance = async (
  input: Omit<Prisma.InstanceCreateInput, "user"> & { userId: string }
) => {
  const { userId, ...other } = input;
  return (await prisma.instance.create({
    data: {
      ...other,
      user: {
        connect: { id: userId },
      },
    },
  })) as Instance;
};

export const findUserInstances = async (userId?: string) => {
  return await prisma.instance.findMany({ where: { userId } });
};

export const findInstance = async (
  where: Prisma.InstanceWhereInput,
  select?: Prisma.InstanceSelect
) => {
  return await prisma.instance.findFirst({
    where,
    select,
  });
};

export const deleteInstance = async (
  where: Prisma.InstanceWhereUniqueInput,
  select?: Prisma.InstanceSelect
) => {
  return await prisma.instance.delete({
    where,
    select,
  });
};

export const updateInstance = async (
  where: Prisma.InstanceWhereUniqueInput,
  data: Prisma.InstanceUpdateInput,
  select?: Prisma.InstanceSelect
) => {
  return await prisma.instance.update({
    where,
    data,
    select,
  });
};
