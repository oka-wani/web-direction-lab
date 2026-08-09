type BrandLogoProps = {
  compact?: boolean;
  className?: string;
};

export function WaniMark({ className = "" }: { className?: string }) {
  return <svg className={className} viewBox="0 0 190 88" role="img" aria-label="横向きのワニをWの形で表したWani san Webのシンボル">
    <path d="M7 34c0-8 6-14 14-14h51c8 0 13-4 17-11C93 3 99 0 108 0h7c10 0 17 5 21 14l13 28 14-16c5-6 13-7 19-3 7 5 8 14 3 21l-22 27c-6 7-17 8-24 1l-17-18-13 18c-6 8-18 9-25 2L66 57H21C13 57 7 51 7 43v-9Z" fill="currentColor" />
    <circle cx="109" cy="18" r="10" fill="#fff" />
    <circle cx="112" cy="18" r="4" fill="currentColor" />
    <path d="M7 42h48" stroke="#fff" strokeWidth="5" strokeLinecap="round" />
    <circle cx="20" cy="31" r="3" fill="#fff" />
  </svg>;
}

export function BrandLogo({ compact = false, className = "" }: BrandLogoProps) {
  return <span className={`brand-logo ${compact ? "brand-logo--compact" : ""} ${className}`.trim()}>
    <WaniMark className="brand-logo-mark" />
    {!compact && <span className="brand-logo-type">Wani san <b>Web</b></span>}
  </span>;
}
