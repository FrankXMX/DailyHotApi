import type { Tool } from "@modelcontextprotocol/sdk/types.js";
import { requireApiKey } from "../auth.js";
import { getHotList, getAllRoutes } from "../client.js";
import type { HotListResponse } from "../types.js";

export const getListTool: Tool = {
  name: "get_hot_list",
  description: "Get hot list data for a specific platform",
  inputSchema: {
    type: "object",
    properties: {
      api_key: { type: "string", description: "API key for authentication" },
      platform: {
        type: "string",
        description: "Platform name (e.g., bilibili, weibo, zhihu)",
      },
      limit: {
        type: "number",
        description: "Maximum number of items to return (optional)",
        minimum: 1,
        maximum: 100,
      },
      no_cache: {
        type: "boolean",
        description: "Skip cache and fetch fresh data (optional)",
      },
    },
    required: ["api_key", "platform"],
  },
};

export interface GetListArgs {
  api_key?: string;
  platform: string;
  limit?: number;
  no_cache?: boolean;
}

export async function handleGetList(args: GetListArgs): Promise<HotListResponse> {
  requireApiKey(args.api_key);

  const routes = await getAllRoutes();
  const validPlatforms = routes.map((r) => r.name);

  if (!validPlatforms.includes(args.platform)) {
    const error = new Error(`Unknown platform: ${args.platform}`);
    (error as any).error = `Unknown platform: ${args.platform}`;
    throw error;
  }

  const data = await getHotList(args.platform, {
    limit: args.limit,
    noCache: args.no_cache,
  });

  return {
    name: data.name,
    title: data.title,
    type: data.type,
    total: data.total,
    data: data.data,
    updateTime: data.updateTime,
    fromCache: data.fromCache,
    message: data.message,
  };
}
