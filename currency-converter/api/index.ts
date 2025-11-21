import { app } from "../server/app.js";
import { registerRoutes } from "../server/routes.js";

// Register routes before exporting
registerRoutes(app);

export default app;
