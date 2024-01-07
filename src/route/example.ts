import { OpenAPIHono } from "@hono/zod-openapi";
import {
	formDataRoute,
	formMultipleRoute,
	pathAndQueryRoute,
} from "../schema/example";
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
			const buff = await file.arrayBuffer();
			const uploadPath = path.join(__dirname, "..", "..", "storage", file.name);
			appendFile(uploadPath, Buffer.from(buff), (err) => {
				if (err) {
					console.error(err);
				}
			});
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
