import { Todos } from "../model/todo";

export const PaginateTodo = ({
	page = 1,
	page_size = 5,
}: { page?: number; page_size?: number }) => {
	const start = (page - 1) * page_size;
	let end = start + page_size;
	if (end > Todos.length) {
		end = Todos.length;
	}

	return {
		data: Todos.slice(start, end),
		numData: Todos.length,
		numPage: Math.ceil(Todos.length / page_size),
	};
};

export const DetailTodo = (id: number) => {
	const todo_item = Todos.filter((todo) => todo.id === id);
	if (todo_item.length >= 1) {
		return todo_item[0];
	}
	return null;
};
