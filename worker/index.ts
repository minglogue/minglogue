/** Cloudflare Worker entry point for the vinext-starter template. */
import { handleImageOptimization, DEFAULT_DEVICE_SIZES, DEFAULT_IMAGE_SIZES } from "vinext/server/image-optimization";
import handler from "vinext/server/app-router-entry";

interface Env {
  ASSETS: Fetcher;
  DB: D1Database;
  IMAGES: {
    input(stream: ReadableStream): {
      transform(options: Record<string, unknown>): {
        output(options: { format: string; quality: number }): Promise<{ response(): Response }>;
      };
    };
  };
}

interface ExecutionContext {
  waitUntil(promise: Promise<unknown>): void;
  passThroughOnException(): void;
}

const SLUG_PATTERN = /^[a-z0-9][a-z0-9-]{0,127}$/;

function json(data: unknown, status = 200) {
  return Response.json(data, {
    status,
    headers: {
      "Cache-Control": "no-store",
      "Content-Type": "application/json; charset=utf-8",
    },
  });
}

async function handleViewsApi(request: Request, env: Env, url: URL) {
  if (request.method === "GET" && url.pathname === "/api/views") {
    const slugs = [...new Set((url.searchParams.get("slugs") ?? "").split(","))]
      .filter((slug) => SLUG_PATTERN.test(slug))
      .slice(0, 100);

    if (!slugs.length) return json({ counts: {} });

    const placeholders = slugs.map(() => "?").join(",");
    const result = await env.DB.prepare(
      `SELECT slug, total_count FROM post_views WHERE slug IN (${placeholders})`,
    ).bind(...slugs).all<{ slug: string; total_count: number }>();
    const counts = Object.fromEntries(slugs.map((slug) => [slug, 0]));

    for (const row of result.results) counts[row.slug] = row.total_count;
    return json({ counts });
  }

  if (request.method === "GET" && url.pathname === "/api/views/popular") {
    const result = await env.DB.prepare(`
      SELECT slug, SUM(view_count) AS views
      FROM post_view_days
      WHERE view_date >= date('now', '-29 days')
      GROUP BY slug
      ORDER BY views DESC, slug ASC
      LIMIT 5
    `).all<{ slug: string; views: number }>();

    return json({ posts: result.results });
  }

  if (request.method === "POST" && url.pathname === "/api/views") {
    const origin = request.headers.get("Origin");
    if (origin && origin !== url.origin) return json({ error: "허용되지 않은 요청입니다." }, 403);

    const body = await request.json().catch(() => null) as { slug?: unknown } | null;
    const slug = typeof body?.slug === "string" ? body.slug : "";
    if (!SLUG_PATTERN.test(slug)) return json({ error: "올바르지 않은 글 주소입니다." }, 400);

    const results = await env.DB.batch([
      env.DB.prepare(`
        INSERT INTO post_views (slug, total_count, updated_at)
        VALUES (?, 1, CURRENT_TIMESTAMP)
        ON CONFLICT(slug) DO UPDATE SET
          total_count = total_count + 1,
          updated_at = CURRENT_TIMESTAMP
        RETURNING total_count
      `).bind(slug),
      env.DB.prepare(`
        INSERT INTO post_view_days (slug, view_date, view_count)
        VALUES (?, date('now'), 1)
        ON CONFLICT(slug, view_date) DO UPDATE SET
          view_count = view_count + 1
      `).bind(slug),
    ]);
    const row = results[0].results?.[0] as { total_count?: number } | undefined;

    return json({ views: Number(row?.total_count ?? 1) });
  }

  return json({ error: "찾을 수 없습니다." }, 404);
}

// Image security config. SVG sources with .svg extension auto-skip the
// optimization endpoint on the client side (served directly, no proxy).
// To route SVGs through the optimizer (with security headers), set
// dangerouslyAllowSVG: true in next.config.js and uncomment below:
// const imageConfig: ImageConfig = { dangerouslyAllowSVG: true };

const worker = {
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    const url = new URL(request.url);

    if (url.pathname === "/_vinext/image") {
      const allowedWidths = [...DEFAULT_DEVICE_SIZES, ...DEFAULT_IMAGE_SIZES];
      return handleImageOptimization(request, {
        fetchAsset: (path) => env.ASSETS.fetch(new Request(new URL(path, request.url))),
        transformImage: async (body, { width, format, quality }) => {
          const result = await env.IMAGES.input(body).transform(width > 0 ? { width } : {}).output({ format, quality });
          return result.response();
        },
      }, allowedWidths);
    }

    if (url.pathname === "/api/views" || url.pathname === "/api/views/popular") {
      try {
        return await handleViewsApi(request, env, url);
      } catch (error) {
        console.error("views api error", error);
        return json({ error: "조회수를 불러오지 못했습니다." }, 500);
      }
    }

    return handler.fetch(request, env, ctx);
  },
};

export default worker;
