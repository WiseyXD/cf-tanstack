import { drizzle } from "drizzle-orm/d1";
import { users } from "../drizzle/schema";
import { Hono } from "hono";

export type Env = {
  DB: D1Database;
};

const app = new Hono<{ Bindings: Env }>();

app.get("/api/", async (c) => {
  const db = drizzle(c.env.DB);
  const results = await db.select().from(users).all();
  console.log(results);
  return c.json("Hello World!");
});

export default app;
