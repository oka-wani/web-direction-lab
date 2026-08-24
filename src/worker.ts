import { handle } from "@astrojs/cloudflare/handler";
export { ProposalWorkflowV2 } from "./proposal-workflow-v2";

export default {
  async fetch(request: Request, env: any, ctx: ExecutionContext) {
    return handle(request, env, ctx);
  },
} satisfies ExportedHandler<any>;
