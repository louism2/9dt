import express from "express";

const app = express();
app.use(express.json({ limit: '100mb' }));

app.listen("9000", () => {
    process.stdout.write("Server started on port 9000");
});