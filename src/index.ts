import { serve } from "@hono/node-server";
import { swaggerUI } from "@hono/swagger-ui";
import { OpenAPIHono } from "@hono/zod-openapi";
import { app as helloApp } from "./route/hello";
import { app as todoApp } from "./route/todo";

const app = new OpenAPIHono();
app.route("/hello", helloApp);
app.route("/todo", todoApp);

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

const port = 3000;
const hostname = "127.0.0.1";
console.log(`Server is running on port ${port}`);

serve({
	fetch: app.fetch,
	port: port,
	hostname: hostname,
});
