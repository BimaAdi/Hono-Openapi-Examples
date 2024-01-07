import { z } from "zod";

export const BadRequestResponse = z.object({
	message: z.string(),
});

export const UnauthorizedResponse = z.object({
	message: z.string().default("Unauthorized"),
});

export const NotFoundResponse = z.object({
	message: z.string(),
});

export const InternalServerErrorResponse = z.object({
	error: z.string(),
});
