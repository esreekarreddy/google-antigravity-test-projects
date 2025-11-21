import { app } from "../server/app";
import { registerRoutes } from "../server/routes";

// Register routes before exporting
registerRoutes(app);

export default app;
