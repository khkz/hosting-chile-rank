import React from "react";
import { ExternalLink } from "lucide-react";

interface Props {
  url: string;
  label?: string;
}

/** Abre el análisis público de PageSpeed Insights para la URL medida. */
const ReproduceButton: React.FC<Props> = ({ url, label = "Reproducir en PageSpeed" }) => {
  if (!url) return null;
  const psi = `https://pagespeed.web.dev/analysis?url=${encodeURIComponent(url)}`;
  return (
    <a
      href={psi}
      target="_blank"
      rel="nofollow noopener noreferrer"
      aria-label={`${label}: abre PageSpeed Insights con la URL medida (en una pestaña nueva)`}
      className="inline-flex min-h-[44px] items-center gap-1 text-sm font-medium text-ink underline decoration-ink/30 underline-offset-4 hover:decoration-ink lg:min-h-0"
    >
      {label}
      <ExternalLink aria-hidden className="h-3.5 w-3.5" />
    </a>
  );
};

export default ReproduceButton;
