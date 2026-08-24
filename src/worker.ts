import { handle } from "@astrojs/cloudflare/handler";
export { ProposalWorkflow } from "./proposal-workflow";

export default {
  async fetch(request: Request, env: any, ctx: ExecutionContext) {
    return handle(request, env, ctx);
  },
} satisfies ExportedHandler<any>;
