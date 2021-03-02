import express from "express";

import GameRoutes from "./routes/GameRoutes";
import MoveRoutes from "./routes/MoveRoutes";

const app = express();
app.use(express.json({ limit: '100mb' }));

const routes = [
    MoveRoutes,
    GameRoutes
];

app.use(routes);

app.listen("9000", () => {
    process.stdout.write("Server started on port 9000");
});