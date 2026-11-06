import http from "node:http";

const PORT = Number(process.env.PORT ?? 8080);

const server = http.createServer((req, res) => {
  try {
    const url = new URL(req.url ?? "/", `http://localhost:${PORT}`);

    if (req.method === "GET" && url.pathname === "/") {
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(
        JSON.stringify({
          name: "Node.js 26 TypeScript Starter",
          endpoints: [
            { method: "GET", path: "/", description: "List the endpoints" },
            {
              method: "GET",
              path: "/health",
              description: "Service health and uptime",
            },
            {
              method: "GET",
              path: "/echo?message=hi",
              description: "Echo the message query parameter",
            },
          ],
        }),
      );
      return;
    }

    if (req.method === "GET" && url.pathname === "/health") {
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(
        JSON.stringify({
          status: "ok",
          uptimeSeconds: Math.floor(process.uptime()),
        }),
      );
      return;
    }

    if (req.method === "GET" && url.pathname === "/echo") {
      const message = url.searchParams.get("message");
      if (message === null || message === "") {
        res.writeHead(400, { "Content-Type": "application/json" });
        res.end(
          JSON.stringify({
            error: "Missing required query parameter: message",
          }),
        );
        return;
      }
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ message }));
      return;
    }

    res.writeHead(404, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ error: "Not found" }));
  } catch (err) {
    console.error(err);
    if (res.headersSent) {
      res.end();
      return;
    }
    res.writeHead(500, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ error: "Internal server error" }));
  }
});

server.listen(PORT, "0.0.0.0", () => {
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
