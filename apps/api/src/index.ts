import "dotenv/config";
import { createApp } from "@/app";
import { env } from "@/config/env";

const app = createApp();
const { API_PORT } = env();

app.listen(API_PORT, () => {
  console.log(`Larimar API listening on port ${API_PORT}`);
});
