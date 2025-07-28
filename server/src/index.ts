import dotenv from "dotenv";
import path from "path";

const envPath =
  process.env.NODE_ENV === "production"
    ? path.resolve(__dirname, "../.env.production")
    : path.resolve(__dirname, "../.env.local");

dotenv.config({ path: envPath });

import app from "./app";

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
