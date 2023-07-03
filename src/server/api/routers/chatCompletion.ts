import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

import chatCompletion from "~/openai/chat";

export const chatCompletionRouter = createTRPCRouter({
  message: publicProcedure
    .input(z.object({ text: z.string() }))
    .query(async ({ input }) => {
      let result;
      try {
        result = await chatCompletion();
      } catch (e) {
        console.error(e?.response || e);
      }
      return {
        message: result?.data?.choices?.[0]?.message?.content,
      };
    }),
});
