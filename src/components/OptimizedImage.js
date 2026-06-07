import React from "react";
import PropTypes from "prop-types";

const CDN = "https://helmo-wiki.vercel.app";
const IS_DEV = process.env.NODE_ENV === "development";

function buildSrc(src, { width, quality = 75 } = {}) {
  if (!src) return src;
  if (src.startsWith("data:") || src.startsWith("blob:")) return src;
  if (IS_DEV) return src;
  if (src.startsWith("http") && !src.startsWith(CDN)) return src;

  const path = src.startsWith("http") ? new URL(src).pathname : src;
  const params = new URLSearchParams();
  params.set("url", path);
  if (width) params.set("w", String(width));
  params.set("q", String(quality));
  return `/_vercel/image?${params.toString()}`;
}

function buildSrcSet(src, sizes, quality = 75) {
  if (!src || src.startsWith("data:") || src.startsWith("blob:")) return undefined;
  if (IS_DEV) return undefined;
  if (src.startsWith("http") && !src.startsWith(CDN)) return undefined;
  const path = src.startsWith("http") ? new URL(src).pathname : src;
  return sizes
    .map((w) => {
      const params = new URLSearchParams({ url: path, w: String(w), q: String(quality) });
      return `/_vercel/image?${params.toString()} ${w}w`;
    })
    .join(", ");
}

export default function OptimizedImage({
  src,
  alt = "",
  width,
  height,
  sizes,
  quality = 75,
  eager = false,
  className,
  style,
  ...rest
}) {
  const widths = Array.isArray(sizes) && sizes.length > 0
    ? sizes
    : width
      ? [Math.round(width * 0.5), width, Math.round(width * 1.5), Math.round(width * 2)]
      : [192, 384, 640, 960];

  const resolvedWidth = width ?? widths[widths.length - 1];
  const resolvedHeight = height ?? Math.round(resolvedWidth * 0.75);

  const finalSrc = buildSrc(src, { width: resolvedWidth, quality });
  const srcSet = buildSrcSet(src, widths, quality);

  return (
    <img
      src={finalSrc}
      srcSet={srcSet}
      sizes={sizes ? (Array.isArray(sizes) ? sizes.join(", ") : sizes) : `${resolvedWidth}px`}
      alt={alt}
      width={resolvedWidth}
      height={resolvedHeight}
      loading={eager ? "eager" : "lazy"}
      decoding={eager ? "sync" : "async"}
      fetchPriority={eager ? "high" : "auto"}
      className={className}
      style={{ display: "block", ...style }}
      {...rest}
    />
  );
}

OptimizedImage.propTypes = {
  src: PropTypes.string,
  alt: PropTypes.string,
  width: PropTypes.number,
  height: PropTypes.number,
  sizes: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.number), PropTypes.string]),
  quality: PropTypes.number,
  eager: PropTypes.bool,
  className: PropTypes.string,
  style: PropTypes.object,
};
