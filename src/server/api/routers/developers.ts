import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export const chatCompletionRouter = createTRPCRouter({
  message: publicProcedure
    .input(z.object({ text: z.string() }))
    .query(async ({ input }) => {
      /*
        Accepting a single atharo.yaml file
        Accepting .ts files
        Require some auth token
      */
      /*
        1. Load denoTemplate file
        
        2. Populate imports
        const commandMap = {};
        for (cont command of commands) {
          imports += `import ${command.split(".")[0]} from "./${command}";\n`;
        }

        3. Populate routes
        for (const command of commands) {
          router.post("/", (ctx) => {
            TODO: GET POST BODY TO PASS AS PARAMS
            ctx.response.body = listPlugins();
          });
        
        4. Create Deno project and rename accordingly
        5. Execute deployctl
      */
    }),
});
