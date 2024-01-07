import { OpenAPIHono } from "@hono/zod-openapi";
import { formDataRoute, pathAndQueryRoute } from "../schema/example";
import path = require("node:path");
import { appendFile } from "node:fs";

export const app = new OpenAPIHono();

app.openapi(pathAndQueryRoute, (c) => {
	const { id } = c.req.valid("param");
	const { a, b } = c.req.valid("query");
	return c.json({ id, a, b: b || null }, 200);
});

app.openapi(formDataRoute, async (c) => {
	const { foo, bar, image } = c.req.valid("form");

	// Save file in Hono
	if (image instanceof File) {
		const buff = await image.arrayBuffer();
		const uploadPath = path.join(__dirname, "..", "..", "storage", image.name);
		appendFile(uploadPath, Buffer.from(buff), (err) => {
			if (err) {
				console.error(err);
			}
		});
	}

	return c.json(
		{
			foo,
			bar,
			image: image instanceof File ? image.name : null,
		},
		200,
	);
});
