import { createRoute } from "@hono/zod-openapi";
import { z } from "zod";

// param can only be string
// if it's not string hono will return never on c.req.valid("param")
// if you want type other than string, do parsing and validation on route
const param = z.object({
	id: z.string().openapi({
		param: {
			name: "id",
			in: "path",
		},
		example: "1",
	}),
});

// query can only be string
// if it's not string hono will return never on c.req.valid("query")
// if you want type other than string, do parsing and validation on route
const query = z.object({
	a: z.string().openapi({
		param: {
			name: "a",
			in: "query",
		},
		example: "1",
	}),
	b: z
		.string()
		.optional()
		.openapi({
			param: {
				name: "b",
				in: "query",
				required: false,
			},
			example: "2",
		}),
});

const okQueryParamResponse = z.object({
	id: z.string(),
	a: z.string(),
	b: z.string().nullable().optional(),
});

export const pathAndQueryRoute = createRoute({
	method: "get",
	path: "/path-and-query/{id}",
	request: {
		query: query,
		params: param,
	},
	responses: {
		200: {
			content: {
				"application/json": {
					schema: okQueryParamResponse,
				},
			},
			description: "Ok Response",
		},
	},
	tags: ["Examples"],
});

const formDataBody = z
	.object({
		foo: z.string(),
		bar: z.string(),
		image: z.instanceof(File).or(z.string()).openapi({
			type: "string",
			format: "binary",
		}),
	})
	.openapi({
		required: ["foo"],
	});

const formDataOk = z.object({
	foo: z.string(),
	bar: z.string().nullable(),
	image: z.string().nullable(),
});

export const formDataRoute = createRoute({
	method: "post",
	path: "/form-data/",
	request: {
		body: {
			content: {
				"multipart/form-data": {
					schema: formDataBody,
				},
			},
		},
	},
	responses: {
		200: {
			content: {
				"application/json": {
					schema: formDataOk,
				},
			},
			description: "form data ok response",
		},
	},
	tags: ["Examples"],
});

const formMultipleBody = z.object({
	arrStr: z.string().openapi({
		type: "array",
		items: {
			type: "string",
		},
	}),
	arrFile: z
		.instanceof(File)
		.or(z.string())
		.openapi({
			type: "array",
			items: {
				type: "string",
				format: "binary",
			},
		}),
});

const formMultipleOk = z.object({
	arrStr: z.array(z.string()),
	arrFile: z.array(z.string()),
});

export const formMultipleRoute = createRoute({
	method: "post",
	path: "/form-data-multiple/",
	request: {
		body: {
			content: {
				"multipart/form-data": {
					schema: formMultipleBody,
				},
			},
		},
	},
	responses: {
		200: {
			content: {
				"application/json": {
					schema: formMultipleOk,
				},
			},
			description: "form data ok response",
		},
	},
	tags: ["Examples"],
});

export const downloadFileRoute = createRoute({
	method: "get",
	path: "/download-file/",
	summary: "download file",
	request: {
		query: z.object({
			contentType: z
				.union([z.literal("image/png"), z.literal("application/octet-stream")])
				.default("image/png"),
		}),
	},
	responses: {
		200: {
			content: {
				"image/png": {
					schema: z.any().openapi({
						type: "object",
						format: "binary",
					}),
				},
				"application/octet-stream": {
					schema: z.any().openapi({
						type: "object",
						format: "binary",
					}),
				},
			},
			description:
				"Return file, contentType can be image/png or application/octet-stream",
		},
	},
	tags: ["Examples"],
});

const okProtectedResponse = z.object({
	message: z.string(),
});

const unauthorizedProtectedResponse = z.object({
	error: z.string(),
});

export const protectedApiKeyRoute = createRoute({
	method: "get",
	path: "/protected-api-key/",
	summary: "Protected api-key Example",
	security: [
		{
			AuthorizationApiKey: [],
		},
	],
	request: {
		headers: z.object({
			"x-api-key": z.string().optional(),
		}),
	},
	responses: {
		200: {
			content: {
				"application/json": {
					schema: okProtectedResponse,
				},
			},
			description: "Authorized Response",
		},
		401: {
			content: {
				"application/json": {
					schema: unauthorizedProtectedResponse,
				},
			},
			description: "Unauthorized Response",
		},
	},
	tags: ["Examples"],
});

export const protectedBearerRoute = createRoute({
	method: "get",
	path: "/protected-bearer/",
	summary: "Protected bearer Route Example",
	security: [
		{
			AuthorizationBearer: [],
		},
	],
	request: {
		headers: z.object({
			authorization: z.string().optional(),
		}),
	},
	responses: {
		200: {
			content: {
				"application/json": {
					schema: okProtectedResponse,
				},
			},
			description: "Authorized Response",
		},
		401: {
			content: {
				"application/json": {
					schema: unauthorizedProtectedResponse,
				},
			},
			description: "Unauthorized Response",
		},
	},
	tags: ["Examples"],
});
