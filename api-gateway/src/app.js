import axios from "axios";
import cors from "cors";
import express from "express";
import helmet from "helmet";

function safeForwardHeaders(headers) {
  const blocked = new Set([
    "connection",
    "content-length",
    "host",
    "transfer-encoding"
  ]);

  return Object.fromEntries(
    Object.entries(headers).filter(
      ([name]) => !blocked.has(name.toLowerCase())
    )
  );
}

export function createApp(options = {}) {
  const app = express();
  const springServiceUrl =
    options.springServiceUrl ||
    process.env.SPRING_SERVICE_URL ||
    "http://localhost:8081";
  const frontendUrl =
    process.env.FRONTEND_URL || "http://localhost:5173";
  const upstreamTimeoutMs = Number(
    options.upstreamTimeoutMs ||
      process.env.UPSTREAM_TIMEOUT_MS ||
      30000
  );
  const chatbotTimeoutMs = Number(
    options.chatbotTimeoutMs ||
      process.env.CHATBOT_TIMEOUT_MS ||
      90000
  );

  app.disable("x-powered-by");
  app.use(helmet());
  app.use(
    cors({
      origin: frontendUrl.split(",").map((value) => value.trim()),
      credentials: true
    })
  );

  app.use((request, response, next) => {
    console.log(
      `[Gateway] ${new Date().toISOString()} ${request.method} ${request.originalUrl}`
    );
    next();
  });
  app.get("/health", (_request, response) => {
    response.json({
      status: "UP",
      service: "skillforge-api-gateway"
    });
  });

  app.use(
    "/api",
    express.raw({ type: "*/*", limit: "10mb" }),
    async (request, response) => {
      const targetUrl =
        springServiceUrl.replace(/\/$/, "") +
        request.originalUrl;
      const timeout = request.originalUrl.startsWith(
        "/api/chatbot/"
      )
        ? chatbotTimeoutMs
        : upstreamTimeoutMs;

      try {
        const upstream = await axios({
          method: request.method,
          url: targetUrl,
          headers: safeForwardHeaders(request.headers),
          data:
            request.method === "GET" ||
            request.method === "HEAD"
              ? undefined
              : request.body,
          responseType: "arraybuffer",
          timeout,
          validateStatus: () => true
        });

        const responseHeaders = safeForwardHeaders(
          upstream.headers
        );

        for (const [name, value] of Object.entries(
          responseHeaders
        )) {
          if (value !== undefined) {
            response.setHeader(name, value);
          }
        }

        response.status(upstream.status).send(upstream.data);
      } catch (error) {
        const timedOut = error.code === "ECONNABORTED";

        response.status(502).json({
          timestamp: new Date().toISOString(),
          status: 502,
          error: "Bad Gateway",
          message: timedOut
            ? "The main service did not respond in time"
            : "The main service is unavailable",
          path: request.originalUrl
        });
      }
    }
  );

  app.use((request, response) => {
    response.status(404).json({
      status: 404,
      error: "Not Found",
      message: "Gateway route not found",
      path: request.originalUrl
    });
  });

  return app;
}
