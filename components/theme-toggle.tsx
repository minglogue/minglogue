"use client";

import { useEffect, useState } from "react";

export function ThemeToggle() {
  const [dark, setDark] = useState(false);

  useEffect(() => {
    setDark(document.documentElement.dataset.theme === "dark");
  }, []);

  function toggleTheme() {
    const nextDark = !dark;
    document.documentElement.dataset.theme = nextDark ? "dark" : "light";
    localStorage.setItem("minglogue-theme", nextDark ? "dark" : "light");
    setDark(nextDark);
  }

  return (
    <button className="theme-toggle" type="button" onClick={toggleTheme} aria-label={dark ? "라이트 모드로 전환" : "다크 모드로 전환"} title={dark ? "라이트 모드" : "다크 모드"}>
      <span aria-hidden="true">{dark ? "☀" : "☾"}</span>
    </button>
  );
}
