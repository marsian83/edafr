import { Hono } from "hono";
import ensureUser from "../middlewares/ensureUser";
import { getPrivyUserFromContext } from "../lib/privy";
import db from "../lib/db";
import { users } from "../lib/db/schema/user";
import { eq } from "drizzle-orm";

const app = new Hono();

app.get("/self", ensureUser, async (ctx) => {
    const { user } = ctx.var;

    return ctx.json({ user }, 200);
});

app.post("/self", async (ctx) => {
    const { name } = await ctx.req.json();

    if (typeof name != "string") return ctx.text("Name is required", 400);

    const privyUser = await getPrivyUserFromContext(ctx);

    if (!privyUser) return ctx.text("Unauthorized", 401);

    const { 0: existingUser } = await db.select().from(users).where(
        eq(users.privyId, privyUser.id),
    ).limit(1);
    if (existingUser) return ctx.text("User already exists", 409);

    await db.insert(users).values({
        privyId: privyUser.id,
        name,
        email: privyUser.google?.email || privyUser.email?.address ||
            "invalid@email.com",
    });

    return ctx.text("Success", 201);
});

app.put("/self", ensureUser, async (ctx) => {

    try {
        const { name } = await ctx.req.json();
        const { user } = ctx.var;
        console.log(user);
        if (typeof name != "string") return ctx.text("Name is required", 400);
        await db.update(users).set({ name }).where(eq(users.id, user.id));
        ctx.text("Success", 200);
        return ctx.json({name},200);

    } catch (error) {
       console.log(error);
       return ctx.json({error: "error"},400); 
    }
   
});

export default app;
