import type { APIRoute } from "astro";
import { env } from "cloudflare:workers";

export const prerender=false;
type RuntimeEnv=typeof env&{PROPOSALS?:R2Bucket};

export const GET:APIRoute=async({params})=>{
  const bucket=(env as RuntimeEnv).PROPOSALS;
  if(!bucket)return new Response("Proposal storage is not configured.",{status:503});
  const accessId=params.accessId||"";
  const asset=(params.asset||"proposal").replace(/^\/+|\/+$/g,"");
  if(!/^[A-Za-z0-9-]+$/.test(accessId))return new Response("Not found",{status:404});
  let key:string;
  if(!asset||asset==="proposal")key=`proposals/${accessId}/proposal.html`;
  else if(asset==="rough")key=`proposals/${accessId}/rough/index.html`;
  else if(asset.startsWith("rough/")){const slug=asset.slice(6).replace(/[^a-z0-9-]/gi,"-").toLowerCase();key=`proposals/${accessId}/rough/${slug}.html`;}
  else return new Response("Not found",{status:404});
  const object=await bucket.get(key);
  if(!object)return new Response("Not found",{status:404});
  const headers=new Headers();object.writeHttpMetadata(headers);headers.set("content-type","text/html; charset=utf-8");headers.set("cache-control","private, no-store");headers.set("x-robots-tag","noindex, nofollow");
  return new Response(object.body,{headers});
};
