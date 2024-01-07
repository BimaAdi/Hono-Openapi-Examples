import { appendFile } from "node:fs";
import { serve } from "@hono/node-server";
import { swaggerUI } from "@hono/swagger-ui";
import { OpenAPIHono } from "@hono/zod-openapi";
import { validator } from "hono/validator";
import { z } from "zod";
import { app as todoApp } from "./route/todo";
import { app as exampleApp } from "./route/example";
import path = require("node:path");

const app = new OpenAPIHono();
app.route("/todo", todoApp);
app.route("/examples", exampleApp);

// The OpenAPI documentation will be available at /doc
app.doc("/doc", {
	openapi: "3.0.0",
	info: {
		version: "1.0.0",
		title: "My API",
	},
});

app.get("/ui", swaggerUI({ url: "/doc" }));
app.get("/", (c) => {
	return c.text("Hello Hono!");
});

const formSchema = z.object({
	foo: z.string(),
	bar: z.instanceof(File),
});
app.post(
	"/form/",
	validator("form", (value, c) => {
		const parsed = formSchema.safeParse(value);
		if (!parsed.success) {
			return c.text("Invalid!", 400);
		}

		return value;
	}),
	async (c) => {
		const { foo, bar } = c.req.valid("form");
		console.log(foo);
		const file: File | string = bar;
		if (file instanceof File) {
			const data = await file.arrayBuffer();
			const uploadPath = path.join(__dirname, "..", "storage", file.name);
			appendFile(uploadPath, Buffer.from(data), (err) => {
				if (err) {
					console.error(err);
				}
			});
		}
		return c.text("Hello world");
	},
);

const port = 3000;
const hostname = "127.0.0.1";
console.log(`Server is running on port ${port}`);

serve({
	fetch: app.fetch,
	port: port,
	hostname: hostname,
});
