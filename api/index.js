let cachedApp = null;
let bootstrapError = null;

const resolveApp = async () => {
  if (cachedApp || bootstrapError) {
    return cachedApp;
  }

  try {
    const mod = await import("../server.js");
    cachedApp = mod?.default;

    if (typeof cachedApp !== "function") {
      throw new Error("Express app export is invalid");
    }

    return cachedApp;
  } catch (error) {
    bootstrapError = error;
    console.error(
      "Server bootstrap failed:",
      error?.stack || error?.message || error,
    );
    return null;
  }
};

export default async function handler(req, res) {
  const app = await resolveApp();

  if (!app) {
    return res.status(500).json({
      message: "Server bootstrap failed",
      error: bootstrapError?.message || "Unknown runtime error",
    });
  }

  try {
    return app(req, res);
  } catch (error) {
    console.error(
      "Runtime request handling failed:",
      error?.stack || error?.message || error,
    );
    return res.status(500).json({
      message: "Runtime request handling failed",
      error: error?.message || "Unknown runtime error",
    });
  }
}
