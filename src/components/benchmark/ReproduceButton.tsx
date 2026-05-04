import React from "react";
import { ExternalLink } from "lucide-react";

interface Props {
  url: string;
  label?: string;
}

const ReproduceButton: React.FC<Props> = ({ url, label = "Reproducir en PageSpeed" }) => {
  if (!url) return null;
  const psi = `https://pagespeed.web.dev/analysis?url=${encodeURIComponent(url)}`;
  return (
    <a
      href={psi}
      target="_blank"
      rel="nofollow noopener noreferrer"
      className="inline-flex items-center gap-1 text-xs text-primary hover:underline"
      title="Abrir el análisis público de PageSpeed Insights para esta URL"
    >
      {label}
      <ExternalLink className="w-3 h-3" />
    </a>
  );
};

export default ReproduceButton;
