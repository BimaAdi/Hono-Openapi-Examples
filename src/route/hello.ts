import { OpenAPIHono } from "@hono/zod-openapi";
import { helloRoute } from "../schema/hello";

export const app = new OpenAPIHono();

app.openapi(helloRoute, (c) => {
	const { name } = c.req.valid("param");
	return c.json(
		{
			hello: name,
		},
		200,
	);
});
