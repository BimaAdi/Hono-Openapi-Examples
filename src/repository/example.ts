import { appendFile } from "fs";
import path = require("path");

// only work on nodejs runtime
export const saveFile = async (file: File): Promise<string> => {
	const buff = await file.arrayBuffer();
	const uploadPath = path.join(__dirname, "..", "..", "storage", file.name);
	appendFile(uploadPath, Buffer.from(buff), (err) => {
		if (err) {
			console.error(err);
		}
	});
	return file.name;
};
