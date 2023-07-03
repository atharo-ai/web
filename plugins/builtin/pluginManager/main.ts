import { Application, Router } from "https://deno.land/x/oak/mod.ts";
import listPlugins from "./list.ts";

const port = 8000;
const app = new Application();

const router = new Router();

router.get("/", (ctx) => {
  ctx.response.body = listPlugins();
});

app.use(router.allowedMethods());
app.use(router.routes());

app.addEventListener("listen", () => {
  console.log(`Listening on: localhost:${port}`);
});

await app.listen({ port });
