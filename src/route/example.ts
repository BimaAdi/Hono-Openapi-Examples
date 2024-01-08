import { OpenAPIHono } from "@hono/zod-openapi";
import {
	downloadFileRoute,
	formDataRoute,
	formMultipleRoute,
	pathAndQueryRoute,
} from "../schema/example";
import path = require("node:path");
import { readFileSync } from "node:fs";
import { saveFile } from "../repository/example";

export const app = new OpenAPIHono();

app.openapi(pathAndQueryRoute, (c) => {
	const { id } = c.req.valid("param");
	const { a, b } = c.req.valid("query");
	return c.json({ id, a, b: b || null }, 200);
});

app.openapi(formDataRoute, async (c) => {
	const { foo, bar, image } = c.req.valid("form");

	if (image instanceof File) {
		await saveFile(image);
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

app.openapi(formMultipleRoute, async (c) => {
	// c.req.valid not working on array form
	const formData = await c.req.formData();

	// Get array string
	const strs = formData.getAll("arrStr");
	const arrStr: string[] = [];
	for (const item of strs) {
		if (typeof item === "string") {
			arrStr.push(item);
		}
	}

	// Get array file
	const files = formData.getAll("arrFile");
	const arrFile: string[] = [];
	for (const file of files) {
		if (file instanceof File) {
			await saveFile(file);
			arrFile.push(file.name);
		}
	}

	return c.json(
		{
			arrStr,
			arrFile,
		},
		200,
	);
});

// disable ts check because hono openapi cannot validate raw response
// @ts-ignore: Unreachable code error
app.openapi(downloadFileRoute, () => {
	const payload = readFileSync(path.join("static", "Wikipedia-logo.png"));
	return new Response(payload, {
		headers: {
			"content-type": "image/png",
		},
		status: 200,
	});
});
