import { TRPCError } from "@trpc/server";
import { findUniqueUser } from "../services/db.service";
import { Request, Response } from "express";
import redisClient from "../utils/connectRedis";
import { verifyJwt } from "../utils/jwt";

export const deserializeUser = async ({
  req,
  res,
}: {
  req: Request;
  res: Response;
}) => {
  try {
    // Get the token
    let access_token;

    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      access_token = req.headers.authorization.split(" ")[1];
    } else if (req.cookies?.access_token) {
      access_token = req.cookies.access_token;
    }

    const notAuthenticated = {
      req,
      res,
      user: null,
    };

    if (!access_token) {
      return notAuthenticated;
    }

    // Validate Access Token
    const decoded = verifyJwt<{ sub: string }>(
      access_token,
      "accessTokenPublicKey"
    );

    if (!decoded) {
      return notAuthenticated;
    }

    // Check if user has a valid session
    const session = await redisClient.get(decoded.sub);

    if (!session) {
      return notAuthenticated;
    }

    // Check if user still exist
    const user = await findUniqueUser({ id: JSON.parse(session).id });

    if (!user) {
      return notAuthenticated;
    }

    return {
      req,
      res,
      user,
    };
  } catch (err: any) {
    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: err.message,
    });
  }
};

export const deserializeWsUser = async (token?: string) => {
  try {
    if (!token) return { user: null };

    const decoded = verifyJwt<{ sub: string }>(token, "accessTokenPublicKey");
    if (!decoded) return { user: null };

    const session = await redisClient.get(decoded.sub);
    if (!session) return { user: null };

    const sessionData = JSON.parse(session);
    const user = await findUniqueUser({ id: sessionData.id });

    if (!user) return { user: null };

    return { user };
  } catch (err: any) {
    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: err.message,
    });
  }
};
