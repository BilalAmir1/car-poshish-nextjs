import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/site-config";

// Next.js auto-generates /robots.txt from this file.
//
// Beyond standard search crawlers, this explicitly allows known AI/LLM
// crawlers (ChatGPT, Perplexity, Claude, Google's AI training crawler,
// etc). Blocking them is a common reason local businesses don't get
// mentioned when people ask AI assistants for recommendations — this does
// the opposite. Remove any of these lines if you'd rather opt out.
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: "*", allow: "/" },
      { userAgent: "GPTBot", allow: "/" },
      { userAgent: "ChatGPT-User", allow: "/" },
      { userAgent: "Google-Extended", allow: "/" },
      { userAgent: "PerplexityBot", allow: "/" },
      { userAgent: "ClaudeBot", allow: "/" },
      { userAgent: "anthropic-ai", allow: "/" },
      { userAgent: "CCBot", allow: "/" },
    ],
    sitemap: `${siteConfig.url}/sitemap.xml`,
  };
}
