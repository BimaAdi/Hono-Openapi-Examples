import { OpenAPIHono } from "@hono/zod-openapi";
import {
	downloadFileRoute,
	formDataRoute,
	formMultipleRoute,
	pathAndQueryRoute,
	protectedBearerRoute,
	protectedApiKeyRoute,
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
app.openapi(downloadFileRoute, async (c) => {
	const { contentType } = await c.req.valid("query");
	const payload = readFileSync(path.join("static", "Wikipedia-logo.png"));
	if (contentType === "image/png") {
		return new Response(payload, {
			headers: {
				"content-type": "image/png",
			},
			status: 200,
		});
	} else {
		return new Response(payload, {
			headers: {
				"content-type": "application/octet-stream",
				"Content-Disposition": 'attachment; filename="wikipedia.png"',
			},
			status: 200,
		});
	}
});

app.openapi(protectedApiKeyRoute, (c) => {
	const { "x-api-key": apiKey } = c.req.valid("header");
	// or
	console.log(c.req.header()["x-api-key"]);
	if (apiKey) {
		return c.json(
			{
				message: "Hello",
			},
			200,
		);
	}
	return c.json(
		{
			error: "Unauthorized",
		},
		401,
	);
});

app.openapi(protectedBearerRoute, (c) => {
	const { authorization } = c.req.valid("header");
	// or
	console.log(c.req.header()["authorization"]);
	if (authorization) {
		return c.json(
			{
				message: "Hello",
			},
			200,
		);
	}
	return c.json(
		{
			error: "Unauthorized",
		},
		401,
	);
});
