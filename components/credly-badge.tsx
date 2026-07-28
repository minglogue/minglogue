"use client";

import Script from "next/script";

export function CredlyBadge() {
  return (
    <div className="credly-badge">
      <div
        data-iframe-width="150"
        data-iframe-height="270"
        data-share-badge-id="e188a4b4-2117-484b-959e-b2200fb9acec"
        data-share-badge-host="https://www.credly.com"
      />
      <Script
        id="credly-badge-script"
        src="https://cdn.credly.com/assets/utilities/embed.js"
        strategy="afterInteractive"
      />
    </div>
  );
}

