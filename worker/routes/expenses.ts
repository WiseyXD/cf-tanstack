import { Hono } from "hono";
import { drizzle } from "drizzle-orm/d1";
import { expenses, trips } from "../../drizzle/schema";
import { eq } from "drizzle-orm";

type Env = {
  DB: D1Database;
};

const expensesRouter = new Hono<{ Bindings: Env }>();

// get all expenses for the trip
expensesRouter.get("/:tripId", async (c) => {
  const db = drizzle(c.env.DB);
  const tripId = parseInt(c.req.param("tripId"));
  try {
    const tripDetails = await db
      .select()
      .from(trips)
      .where(eq(trips.id, tripId))
      .get();

    if (!tripDetails) {
      return c.json({
        ok: false,
        message: "Trip not found or wrong share code.",
      });
    }
  } catch (error) {
    console.error(error);
    return c.json({
      ok: false,
      message: "Failed to get expenses.",
    });
  }
});

// create expense
expensesRouter.post("/:tripId", async (c) => {
  const db = drizzle(c.env.DB);
  const { paidById, amount, description, category } = await c.req.json();
  const tripId = parseInt(c.req.param("tripId"));

  try {
    const tripDetails = await db
      .select()
      .from(trips)
      .where(eq(trips.id, tripId))
      .get();

    if (!tripDetails) {
      return c.json({
        ok: false,
        message: "Trip not found or wrong share code.",
      });
    }

    const results = await db.insert(expenses).values({
      paidById,
      amount,
      description,
      category,
      tripId,
    });

    return c.json({
      ok: true,
      message: results,
    });
  } catch (error) {
    console.error(error);
    return c.json({
      ok: false,
      message: "Failed to create expense.",
    });
  }
});

export default expensesRouter;
