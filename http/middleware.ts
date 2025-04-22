import type { NextFunction, Request, Response } from "express";
import type { ZodSchema } from "zod";
import { verifyAccessToken } from "./service/auth";
export const AuthMiddleware = (
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	const tokenString = req.headers.authorization;
	if (!tokenString) {
		return res.status(401).json({ message: "Unauthorized" });
	}
	const token = tokenString.split(" ")[1];
	try {
		if (!token) {
			return res.status(401).json({ message: "Unauthorized" });
		}
		const decoded = verifyAccessToken(token);
		req.user = decoded;
		next();
	} catch (error) {
		return res.status(401).json({ message: "JWT token is invalid" });
	}
};

export const errorHandler = (
	err: Error,
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	console.error(err.stack);
	res.status(500).json({ message: "Internal server error" });
};

export const validateSchema = <T>(schema: ZodSchema<T>) => {
	return (req: Request, res: Response, next: NextFunction): void => {
		const result = schema.safeParse(req.body);

		if (!result.success) {
			const formattedErrors = Object.entries(result.error.format()).reduce(
				(acc, [key, value]) => {
					if (key === "_errors") return acc; // skip root-level errors
					acc[key] = (value as any)._errors?.[0] || "Invalid value";
					return acc;
				},
				{} as Record<string, string>,
			);

			res.status(400).json({
				message: "Validation failed",
				errors: formattedErrors,
			});
			return;
		}

		req.body = result.data;
		next();
	};
};
