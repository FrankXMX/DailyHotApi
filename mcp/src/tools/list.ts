import type { Tool } from "@modelcontextprotocol/sdk/types.js";
import { requireApiKey } from "../auth.js";
import { getAllRoutes } from "../client.js";
import { PLATFORM_METADATA } from "../types.js";

export const listPlatformsTool: Tool = {
  name: "list_hot_platforms",
  description: "List all available hot list platforms from DailyHotApi",
  inputSchema: {
    type: "object",
    properties: {
      api_key: { type: "string", description: "API key for authentication" },
    },
    required: ["api_key"],
  },
};

export interface ListPlatformsResult {
  platforms: Array<{
    name: string;
    path: string;
    title: string;
    description: string;
  }>;
  total: number;
}

export async function handleListPlatforms(args: {
  api_key?: string;
}): Promise<ListPlatformsResult> {
  requireApiKey(args.api_key);

  const routes = await getAllRoutes();

  const platforms = routes.map((route) => ({
    name: route.name,
    path: route.path,
    title: PLATFORM_METADATA[route.name]?.title || route.name,
    description: PLATFORM_METADATA[route.name]?.description || "",
  }));

  return {
    platforms,
    total: platforms.length,
  };
}
