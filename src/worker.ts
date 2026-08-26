import { handle } from "@astrojs/cloudflare/handler";
import { handleBookingReply } from "./booking-reply";
export { ProposalWorkflowV2 } from "./proposal-workflow-v2";

export default {
  async fetch(request: Request, env: any, ctx: ExecutionContext) {
    const url = new URL(request.url);
    if (url.protocol !== "https:" || url.hostname === "wani-san.com") {
      url.protocol = "https:";
      url.hostname = "www.wani-san.com";
      url.port = "";
      return Response.redirect(url.toString(), 301);
    }
    return handle(request, env, ctx);
  },
  async email(message: ForwardableEmailMessage, env: any) {
    await handleBookingReply(message, env);
  },
} satisfies ExportedHandler<any>;
