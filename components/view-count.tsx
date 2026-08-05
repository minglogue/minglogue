"use client";

import { useEffect, useState } from "react";

const countCache = new Map<string, number>();
const listeners = new Map<string, Set<(count: number) => void>>();
const pendingSlugs = new Set<string>();
let batchTimer: ReturnType<typeof setTimeout> | null = null;

function publish(slug: string, count: number) {
  countCache.set(slug, count);
  listeners.get(slug)?.forEach((listener) => listener(count));
}

function queueCount(slug: string) {
  pendingSlugs.add(slug);
  if (batchTimer) return;

  batchTimer = setTimeout(async () => {
    const slugs = [...pendingSlugs];
    pendingSlugs.clear();
    batchTimer = null;

    try {
      const response = await fetch(`/api/views?slugs=${encodeURIComponent(slugs.join(","))}`);
      if (!response.ok) return;
      const data = await response.json() as { counts?: Record<string, number> };
      for (const item of slugs) publish(item, Number(data.counts?.[item] ?? 0));
    } catch {
      // 조회수 장애가 글 읽기를 방해하지 않도록 표시만 생략한다.
    }
  }, 0);
}

function useViewCount(slug: string) {
  const [count, setCount] = useState<number | null>(countCache.get(slug) ?? null);

  useEffect(() => {
    const slugListeners = listeners.get(slug) ?? new Set();
    slugListeners.add(setCount);
    listeners.set(slug, slugListeners);
    if (!countCache.has(slug)) queueCount(slug);

    return () => {
      slugListeners.delete(setCount);
      if (!slugListeners.size) listeners.delete(slug);
    };
  }, [slug]);

  return count;
}

export function ViewCount({ slug }: { slug: string }) {
  const count = useViewCount(slug);
  return <span className="view-count">조회 {count ?? "–"}</span>;
}

export function PostViewTracker({ slug }: { slug: string }) {
  const count = useViewCount(slug);

  useEffect(() => {
    const now = new Date();
    const day = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
    const storageKey = `minglogue-view:${slug}:${day}`;
    if (window.localStorage.getItem(storageKey)) return;
    window.localStorage.setItem(storageKey, "1");

    void fetch("/api/views", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ slug }),
      keepalive: true,
    }).then(async (response) => {
      if (!response.ok) {
        window.localStorage.removeItem(storageKey);
        return;
      }
      const data = await response.json() as { views?: number };
      if (typeof data.views === "number") publish(slug, data.views);
    }).catch(() => window.localStorage.removeItem(storageKey));
  }, [slug]);

  return <span className="view-count">조회 {count ?? "–"}</span>;
}
