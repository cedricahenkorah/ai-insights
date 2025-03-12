import { Request, Response } from "express";
import { logger } from "../config/logger";
import { errorResponse, successResponse } from "../utils/response";
import User from "../models/user-model";
import { generateJWT } from "../helpers/generate-jwt";

export async function googleAuth(req: Request, res: Response) {
  const logTag = "[auth-controller.ts] [googleAuth]";
  const { id, name, email, image } = req.body;

  logger.info(`${logTag} Authenticating google user: ${email}`);

  if (!name || !email) {
    logger.error(`${logTag} Missing required field in the request body`);
    errorResponse(res, 400, "Missing required field");
    return;
  }

  try {
    const userExists = await User.findOne({ email: email }).lean().exec();

    if (!userExists) {
      const newUser = await User.create({
        name: name,
        email: email,
        image: image,
      });

      const accessToken = await generateJWT(newUser);

      logger.info(
        `${logTag} Authenticated and created a new user account for ${email}`
      );
      successResponse(res, 201, "User created and authenticated", {
        accessToken,
        newUser,
      });
      return;
    }

    const accessToken = await generateJWT(userExists);

    logger.info(`${logTag} Authenticated ${email} successfully`);
    successResponse(res, 200, "User authenticated", {
      accessToken,
      userExists,
    });
    return;
  } catch (error) {
    logger.error(`${logTag} Internal Server Error ${error}`);
    errorResponse(res, 500, "Internal Server Error");
    return;
  }
}
