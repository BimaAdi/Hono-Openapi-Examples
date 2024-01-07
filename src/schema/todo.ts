import { createRoute } from "@hono/zod-openapi";
import { z } from "zod";
import {
	InternalServerErrorResponse,
	NotFoundResponse,
	UnauthorizedResponse,
} from "./common";

const listTodoQueries = z.object({
	page: z.string().openapi({
		param: {
			name: "page",
			in: "query",
		},
		example: "1",
	}),
	page_size: z.string().openapi({
		param: {
			name: "page_size",
			in: "query",
		},
		example: "10",
	}),
});

const listTodoResponse = z.object({
	page: z.number(),
	page_size: z.number(),
	num_page: z.number(),
	num_data: z.number(),
	results: z.array(
		z.object({
			id: z.number(),
			name: z.string(),
			is_done: z.boolean(),
		}),
	),
});

export const listTodoRoute = createRoute({
	method: "get",
	path: "/",
	request: {
		query: listTodoQueries,
	},
	responses: {
		200: {
			content: {
				"application/json": {
					schema: listTodoResponse,
				},
			},
			description: "list todo",
		},
		401: {
			content: {
				"application/json": {
					schema: UnauthorizedResponse,
				},
			},
			description: "Unautorized",
		},
		500: {
			content: {
				"application/json": {
					schema: InternalServerErrorResponse,
				},
			},
			description: "Internal Server Error",
		},
	},
	tags: ["Todo"],
});

const detailTodoParam = z.object({
	todo_id: z.string().openapi({
		param: {
			name: "todo_id",
			in: "path",
		},
		example: "1",
	}),
});

const detailTodoResponse = z.object({
	id: z.number(),
	name: z.string(),
	is_done: z.boolean(),
});

export const detailTodoRoute = createRoute({
	method: "get",
	path: "/{todo_id}",
	request: {
		params: detailTodoParam,
	},
	responses: {
		200: {
			content: {
				"application/json": {
					schema: detailTodoResponse,
				},
			},
			description: "detail todo",
		},
		404: {
			content: {
				"application/json": {
					schema: NotFoundResponse,
				},
			},
			description: "todo not found",
		},
		500: {
			content: {
				"application/json": {
					schema: InternalServerErrorResponse,
				},
			},
			description: "Internal server error",
		},
	},
	tags: ["Todo"],
});

const createTodoBody = z.object({
	name: z.string(),
	is_done: z.boolean(),
});

export const createTodoRoute = createRoute({
	method: "post",
	path: "/",
	request: {
		body: {
			content: {
				"application/json": {
					schema: createTodoBody,
				},
			},
		},
	},
	responses: {
		201: {
			content: {
				"application/json": {
					schema: detailTodoResponse,
				},
			},
			description: "todo created",
		},
		500: {
			content: {
				"application/json": {
					schema: InternalServerErrorResponse,
				},
			},
			description: "Internal server error",
		},
	},
	tags: ["Todo"],
});

const updateTodoParam = z.object({
	todo_id: z.string().openapi({
		param: {
			name: "todo_id",
			in: "path",
		},
		example: "1",
	}),
});

const updateTodoBody = z.object({
	name: z.string(),
	is_done: z.boolean(),
});

export const updateTodoRoute = createRoute({
	method: "put",
	path: "/{todo_id}",
	request: {
		params: updateTodoParam,
		body: {
			content: {
				"application/json": {
					schema: updateTodoBody,
				},
			},
		},
	},
	responses: {
		200: {
			content: {
				"application/json": {
					schema: detailTodoResponse,
				},
			},
			description: "todo created",
		},
		404: {
			content: {
				"application/json": {
					schema: NotFoundResponse,
				},
			},
			description: "todo not found",
		},
		500: {
			content: {
				"application/json": {
					schema: InternalServerErrorResponse,
				},
			},
			description: "Internal server error",
		},
	},
	tags: ["Todo"],
});

const deleteTodoParam = z.object({
	todo_id: z.string().openapi({
		param: {
			name: "todo_id",
			in: "path",
		},
		example: "1",
	}),
});

export const deleteTodoRoute = createRoute({
	method: "delete",
	path: "/{todo_id}",
	request: {
		params: deleteTodoParam,
	},
	responses: {
		204: {
			content: {
				"application/json": {
					schema: z.null(),
				},
			},
			description: "detail todo",
		},
		404: {
			content: {
				"application/json": {
					schema: NotFoundResponse,
				},
			},
			description: "todo not found",
		},
		500: {
			content: {
				"application/json": {
					schema: InternalServerErrorResponse,
				},
			},
			description: "Internal server error",
		},
	},
	tags: ["Todo"],
});
