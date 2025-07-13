import { drizzle } from "drizzle-orm/d1";
import { trips } from "../drizzle/schema";
import { Hono } from "hono";
import { cors } from "hono/cors";
import { bearerAuth } from "hono/bearer-auth";
export type Env = {
  DB: D1Database;
};

const app = new Hono<{ Bindings: Env }>();
const token = "secret";

app.use("*", cors());
app.use("*", bearerAuth({ token }));

app.get("/api/", async (c) => {
  const db = drizzle(c.env.DB);
  const results = await db.select().from(trips).all();
  console.log(results);
  return c.json("Hello World!");
});

app.get("/api/trips", async (c) => {
  const db = drizzle(c.env.DB);
  const results = await db.select().from(trips).all();
  console.log(results);
  return c.json(results);
});

export default app;
