import { createRoute } from "@hono/zod-openapi";
import { z } from "zod";

const HelloParams = z.object({
	name: z
		.string()
		.min(1)
		.openapi({
			param: {
				name: "name",
				in: "path",
			},
			example: "world",
		}),
});

const HelloSchemaResponse = z.object({
	hello: z.string(),
});

export const helloRoute = createRoute({
	method: "get",
	path: "/{name}",
	request: {
		params: HelloParams,
	},
	responses: {
		200: {
			content: {
				"application/json": {
					schema: HelloSchemaResponse,
				},
			},
			description: "Say Helo",
		},
	},
});
