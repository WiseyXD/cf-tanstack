import { Hono } from "hono";
import { drizzle } from "drizzle-orm/d1";
import { customAlphabet } from "nanoid";
import { tripMembers, trips } from "../../drizzle/schema";
import { eq } from "drizzle-orm";

type Env = {
  DB: D1Database;
};

const tripsRouter = new Hono<{ Bindings: Env }>();

async function generateShareCode(db: any) {
  let code;
  let isUnique = false;
  let attempts = 0;
  let maxAttempts = 10;

  while (!isUnique && attempts < maxAttempts) {
    code = customAlphabet("23456789ABCDEFGHJKMNPQRSTUVWXYZ", 6)();
    const results = await db
      .select()
      .from(trips)
      .where(eq(trips.shareCode, code))
      .get();
    isUnique = !results;
    attempts++;
  }

  if (!isUnique) {
    throw new Error("Failed to generate unique share code.");
  }

  return code!;
}

// get all trips
tripsRouter.get("/", async (c) => {
  const db = drizzle(c.env.DB);
  const results = await db.select().from(trips).all();
  console.log("getting trips", results);
  return c.json(results);
});

// create a trip
tripsRouter.post("/", async (c) => {
  const db = drizzle(c.env.DB);
  const { name, description } = await c.req.json();
  const shareCode = await generateShareCode(db);

  // generate a random share code
  const results = await db.insert(trips).values({
    name,
    shareCode,
    description,
  });
  console.log("inserting trips", results);
  return c.json({
    ok: true,
    message: results,
  });
});

// join a trip
tripsRouter.post("/:code", async (c) => {
  const db = drizzle(c.env.DB);
  const { name } = await c.req.json();
  const shareCode = c.req.param("code");
  const tripDetails = await db
    .select()
    .from(trips)
    .where(eq(trips.shareCode, shareCode))
    .get();

  if (!tripDetails) {
    return c.json({
      ok: false,
      message: "Trip not found or wrong share code.",
    });
  }

  const results = await db.insert(tripMembers).values({
    name,
    tripId: tripDetails.id,
  });

  return c.json({
    ok: true,
    message: results,
  });
});

export default tripsRouter;
