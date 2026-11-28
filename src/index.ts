import express, {
  type NextFunction,
  type Request,
  type Response,
} from "express";
import path from "node:path";
import { fileURLToPath } from "node:url";

const PORT = Number(process.env.PORT ?? 8080);
const __dirname = path.dirname(fileURLToPath(import.meta.url));

const app = express();
app.use(express.json());

// Serve the landing page and static files from public/.
// The built app runs from dist/, so public/ sits one level up.
app.use(express.static(path.join(__dirname, "..", "public")));

app.get("/health", (_req: Request, res: Response) => {
  res.json({
    status: "ok",
    uptimeSeconds: Math.floor(process.uptime()),
  });
});

app.get("/echo", (req: Request, res: Response) => {
  const message = req.query.message;
  if (typeof message !== "string" || message === "") {
    res.status(400).json({ error: "Missing required query parameter: message" });
    return;
  }
  res.json({ message });
});

app.use((_req: Request, res: Response) => {
  res.status(404).json({ error: "Not found" });
});

app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
  console.error(err);
  res.status(500).json({ error: "Internal server error" });
});

const server = app.listen(PORT, "0.0.0.0", () => {
  console.log(`Listening on port ${PORT}`);
});

function shutdown(signal: string): void {
  console.log(`Received ${signal}, shutting down gracefully...`);
  server.close(() => {
    process.exit(0);
  });
}

process.on("SIGTERM", () => shutdown("SIGTERM"));
process.on("SIGINT", () => shutdown("SIGINT"));
