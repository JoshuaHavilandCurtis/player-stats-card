const dotenv = require("dotenv");
const express = require("express");
const http = require("http");
const path = require("path");

//read env vars
dotenv.config();

const env = {
	mode: process.env.NODE_ENV ?? "development",
	port: process.env.PORT ?? 8080
}

//define paths
const paths = {
	src: path.join(__dirname, "src"),
	static: path.join(__dirname, "static")
}

//create app
const app = express();

app.use("/static", express.static(paths.static));
app.use(express.static(__dirname));

//start server
const server = http.createServer(app);
server.listen(env.port, () => console.log(`\x1b[32mHTTP server started successfully: http://localhost:${env.port}/\x1b[0m`));