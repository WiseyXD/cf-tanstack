// worker/routes/trips.ts
import { Hono } from "hono";
import { drizzle, DrizzleD1Database } from "drizzle-orm/d1";
import { customAlphabet } from "nanoid";
import { tripMembers, trips } from "../../drizzle/schema";
import { eq } from "drizzle-orm";

type Env = {
  DB: D1Database;
};

const tripsRouter = new Hono<{ Bindings: Env }>();

// Define a type for your Drizzle client instance
type MyDrizzleDb = DrizzleD1Database<Record<string, never>>; // or appropriate schema type if you have one

// Strictly type the 'db' parameter
async function generateShareCode(db: MyDrizzleDb): Promise<string> {
  let code: string; // Declare code as string
  let isUnique = false;
  let attempts = 0;
  const maxAttempts = 10;

  while (!isUnique && attempts < maxAttempts) {
    code = customAlphabet("23456789ABCDEFGHJKMNPQRSTUVWXYZ", 6)();

    // The .get() method returns either the row or undefined if not found
    const result = await db
      .select()
      .from(trips)
      .where(eq(trips.shareCode, code))
      .get(); // result will be Trip | undefined

    isUnique = !result; // If result is undefined, it's unique
    attempts++;
  }

  if (!isUnique) {
    // If we exit the loop without a unique code, throw an error
    throw new Error(
      "Failed to generate unique share code after multiple attempts.",
    );
  }

  return code!; // 'code' will definitely be assigned here
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
  console.log("generating share code", shareCode);
  console.log("name", name);

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
