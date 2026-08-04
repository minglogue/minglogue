/** Cloudflare Worker entry point for the vinext-starter template. */
import { handleImageOptimization, DEFAULT_DEVICE_SIZES, DEFAULT_IMAGE_SIZES } from "vinext/server/image-optimization";
import handler from "vinext/server/app-router-entry";

interface ExecutionContext {
  waitUntil(promise: Promise<unknown>): void;
  passThroughOnException(): void;
}

type StudioPost = {
  title: string;
  slug: string;
  kind: "coding" | "daily" | "portfolio" | "pudding";
  status: "drafts" | "published";
  category: string;
  excerpt: string;
  tags: string;
  body: string;
  date: string;
  markdown: string;
  updatedAt: string;
};

const JSON_HEADERS = {
  "content-type": "application/json; charset=utf-8",
  "cache-control": "no-store",
};

function json(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), { status, headers: JSON_HEADERS });
}

function studioEmail(request: Request) {
  return (
    request.headers.get("cf-access-authenticated-user-email") ??
    request.headers.get("oai-authenticated-user-email") ??
    ""
  ).trim().toLowerCase();
}

function canWriteStudio(request: Request, env: Env) {
  return studioEmail(request) === env.STUDIO_OWNER_EMAIL.toLowerCase();
}

function safeSegment(value: string) {
  return /^[a-z0-9가-힣][a-z0-9가-힣._-]{0,119}$/i.test(value);
}

function postKey(kind: string, slug: string) {
  return `posts/${kind}/${slug}.json`;
}

async function listStudioPosts(env: Env) {
  const listed = await env.CONTENT.list({ prefix: "posts/", limit: 1000 });
  const posts = await Promise.all(
    listed.objects.map(async ({ key }) => {
      const object = await env.CONTENT.get(key);
      return object ? object.json<StudioPost>() : null;
    }),
  );

  return posts
    .filter((post): post is StudioPost => post !== null)
    .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
}

async function listPublishedPosts(env: Env) {
  const posts = await listStudioPosts(env);
  return posts.filter((post) => post.status === "published");
}

async function handleStudioApi(request: Request, env: Env, url: URL) {
  if (!canWriteStudio(request, env)) {
    return json({ error: "밍띠 계정으로 로그인해야 합니다." }, 401);
  }

  if (url.pathname === "/api/studio/posts" && request.method === "GET") {
    return json({ posts: await listStudioPosts(env), owner: studioEmail(request) });
  }

  if (url.pathname === "/api/studio/backup" && request.method === "GET") {
    const posts = await listStudioPosts(env);
    return new Response(JSON.stringify({ exportedAt: new Date().toISOString(), posts }, null, 2), {
      headers: {
        "content-type": "application/json; charset=utf-8",
        "content-disposition": `attachment; filename="minglogue-backup-${new Date().toISOString().slice(0, 10)}.json"`,
        "cache-control": "no-store",
      },
    });
  }

  const postMatch = url.pathname.match(/^\/api\/studio\/posts\/([^/]+)\/([^/]+)$/);
  if (postMatch) {
    const [, kind, slug] = postMatch.map(decodeURIComponent);
    if (!safeSegment(kind) || !safeSegment(slug)) return json({ error: "잘못된 글 주소입니다." }, 400);
    const key = postKey(kind, slug);

    if (request.method === "GET") {
      const object = await env.CONTENT.get(key);
      return object ? json({ post: await object.json<StudioPost>() }) : json({ error: "글을 찾지 못했습니다." }, 404);
    }

    if (request.method === "PUT") {
      const post = await request.json<StudioPost>();
      if (post.kind !== kind || post.slug !== slug || !post.title.trim() || !post.body.trim()) {
        return json({ error: "제목과 본문을 확인해주세요." }, 400);
      }
      const saved = { ...post, updatedAt: new Date().toISOString() };
      await env.CONTENT.put(key, JSON.stringify(saved), {
        httpMetadata: { contentType: "application/json; charset=utf-8" },
        customMetadata: { title: saved.title, status: saved.status, updatedAt: saved.updatedAt },
      });
      return json({ post: saved });
    }
  }

  const mediaMatch = url.pathname.match(/^\/api\/studio\/media\/([^/]+)\/([^/]+)\/([^/]+)$/);
  if (mediaMatch && request.method === "PUT") {
    const [, kind, slug, fileName] = mediaMatch.map(decodeURIComponent);
    if (![kind, slug, fileName].every(safeSegment) || !fileName.endsWith(".webp")) {
      return json({ error: "잘못된 사진 이름입니다." }, 400);
    }
    if (!request.body) return json({ error: "사진이 비어 있습니다." }, 400);
    const key = `media/${kind}/${slug}/${fileName}`;
    await env.CONTENT.put(key, request.body, {
      httpMetadata: { contentType: "image/webp", cacheControl: "public, max-age=31536000, immutable" },
    });
    return json({ key, url: `/content/${key}` });
  }

  return json({ error: "지원하지 않는 요청입니다." }, 404);
}

async function servePublishedContent(env: Env, url: URL) {
  const key = decodeURIComponent(url.pathname.slice("/content/".length));
  if (!key.startsWith("media/") || key.includes("..")) return new Response("Not Found", { status: 404 });
  const [, kind, slug] = key.split("/");
  const post = await env.CONTENT.get(postKey(kind, slug));
  if (!post || (await post.json<StudioPost>()).status !== "published") {
    return new Response("Not Found", { status: 404 });
  }
  const object = await env.CONTENT.get(key);
  if (!object) return new Response("Not Found", { status: 404 });
  const headers = new Headers();
  object.writeHttpMetadata(headers);
  headers.set("etag", object.httpEtag);
  return new Response(object.body, { headers });
}

// Image security config. SVG sources with .svg extension auto-skip the
// optimization endpoint on the client side (served directly, no proxy).
// To route SVGs through the optimizer (with security headers), set
// dangerouslyAllowSVG: true in next.config.js and uncomment below:
// const imageConfig: ImageConfig = { dangerouslyAllowSVG: true };

const worker = {
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    const url = new URL(request.url);
    const studioApiUrl = new URL(url);
    const studioApiPrefix = "/studio/api/studio";
    const usesStudioSession = url.pathname.startsWith(`${studioApiPrefix}/`);
    if (usesStudioSession) {
      studioApiUrl.pathname = url.pathname.replace(studioApiPrefix, "/api/studio");
    }

    if (url.pathname.startsWith("/api/studio/") || usesStudioSession) {
      try {
        return await handleStudioApi(request, env, usesStudioSession ? studioApiUrl : url);
      } catch (error) {
        console.error(JSON.stringify({ event: "studio_api_error", path: url.pathname, error: String(error) }));
        return json({ error: "저장소 요청을 처리하지 못했습니다." }, 500);
      }
    }

    if (url.pathname === "/api/public/posts" && request.method === "GET") {
      try {
        return json({ posts: await listPublishedPosts(env) }, 200);
      } catch (error) {
        console.error(JSON.stringify({ event: "public_posts_error", error: String(error) }));
        return json({ error: "공개 글을 불러오지 못했습니다." }, 500);
      }
    }

    const publicPostMatch = url.pathname.match(/^\/api\/public\/posts\/([^/]+)$/);
    if (publicPostMatch && request.method === "GET") {
      const slug = decodeURIComponent(publicPostMatch[1]);
      const post = (await listPublishedPosts(env)).find((item) => item.slug === slug);
      return post ? json({ post }) : json({ error: "글을 찾지 못했습니다." }, 404);
    }

    if (url.pathname.startsWith("/content/")) {
      return servePublishedContent(env, url);
    }

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

    return handler.fetch(request, env, ctx);
  },
};

export default worker;
