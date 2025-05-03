import path from "path";
require("dotenv").config({ path: path.join(__dirname, "../../.env") });

const customConfig: {
  port: number;
  accessTokenExpiresIn: number;
  refreshTokenExpiresIn: number;
  origin: string;
  dbUri: string;
  accessTokenPrivateKey: string;
  accessTokenPublicKey: string;
  refreshTokenPrivateKey: string;
  refreshTokenPublicKey: string;
  redisCacheExpiresIn: number;
  frontendUrl: string;
} = {
  port: Number(process.env.PORT) as number,
  accessTokenExpiresIn: 999999999, // TODO: Fix time
  refreshTokenExpiresIn: 60,
  redisCacheExpiresIn: 60,
  origin: process.env.ORIGIN as string,

  dbUri: process.env.DATABASE_URL as string,
  accessTokenPrivateKey: process.env.ACCESS_TOKEN_PRIVATE_KEY as string,
  accessTokenPublicKey: process.env.ACCESS_TOKEN_PUBLIC_KEY as string,
  refreshTokenPrivateKey: process.env.REFRESH_TOKEN_PRIVATE_KEY as string,
  refreshTokenPublicKey: process.env.REFRESH_TOKEN_PUBLIC_KEY as string,
  frontendUrl: process.env.FRONTEND_URL as string,
};

export default customConfig;
