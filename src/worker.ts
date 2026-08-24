import { handle } from "@astrojs/cloudflare/handler";
export { ProposalWorkflow } from "./proposal-workflow";

export default {
  async fetch(request: Request, env: unknown, ctx: ExecutionContext) {
    return handle(request, env, ctx);
  },
} satisfies ExportedHandler;
