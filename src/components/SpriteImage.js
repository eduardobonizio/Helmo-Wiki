/* eslint-disable react/prop-types */
import React, { useEffect, useRef, useState } from "react";
import PropTypes from "prop-types";

const DIRECTION_LABELS = {
  0: "Sul",
  1: "Norte",
  2: "Leste",
  3: "Oeste",
};

function buildSrc(kind, name, sprite) {
  if (!name) return "";
  const base = kind === "monster" ? "/monsters" : "/items";
  const fallback = kind === "monster" ? "walk_0.png" : "icon.png";
  return `${base}/${name}/${sprite || fallback}`;
}

export default function SpriteImage(props) {
  const {
    kind = "monster",
    name,
    sprite,
    frameSize,
    frameWidth,
    frameHeight,
    framesPerDirection,
    frames,
    directions = 1,
    direction = 0,
    duration = "0.8s",
    className,
    style,
    alt,
    eager = false,
    ...rest
  } = props;

  const url = buildSrc(kind, name, sprite);

  if (kind === "item") {
    return ItemSprite({
      frameSize: frameSize || 32,
      frames: frames || 1,
      url,
      duration,
      className,
      style,
      alt,
      eager,
      rest,
    });
  }
  return MonsterSprite({
    frameWidth: frameWidth || frameSize || 32,
    frameHeight: frameHeight || frameSize || 32,
    framesPerDirection: framesPerDirection || 1,
    directions: directions || 4,
    direction,
    url,
    duration,
    className,
    style,
    alt,
    eager,
    rest,
  });
}

function ItemSprite({ frameSize, frames, url, duration, className, style, alt, eager, rest }) {
  const fs = frameSize;
  const total = Math.max(1, frames);
  return SpriteCanvas({
    frameWidth: fs,
    frameHeight: fs,
    cols: total,
    rows: 1,
    row: 0,
    url,
    duration,
    className,
    style,
    alt,
    eager,
    rest,
  });
}

function MonsterSprite({
  frameWidth,
  frameHeight,
  framesPerDirection,
  directions,
  direction,
  url,
  duration,
  className,
  style,
  alt,
  eager,
  rest,
}) {
  const fw = frameWidth;
  const fh = frameHeight;
  const cols = Math.max(1, framesPerDirection);
  const dirs = Math.max(1, directions);
  const dir = ((direction % dirs) + dirs) % dirs;
  return SpriteCanvas({
    frameWidth: fw,
    frameHeight: fh,
    cols,
    rows: dirs,
    row: dir,
    url,
    duration,
    className,
    style,
    alt,
    eager,
    rest,
    cycleAll: true,
  });
}

function SpriteCanvas({
  frameWidth,
  frameHeight,
  cols,
  rows,
  row,
  url,
  duration,
  className,
  style,
  alt,
  rest,
  cycleAll = false,
}) {
  const fw = frameWidth;
  const fh = frameHeight;
  const totalFrames = cycleAll ? rows * cols : cols;
  const isAnimated = totalFrames > 1;
  const canvasRef = useRef(null);
  const imgRef = useRef(null);
  const frameRef = useRef(0);
  const timerRef = useRef(null);
  const [loaded, setLoaded] = useState(false);

  const frameDuration = isAnimated ? parseFloat(duration) * 1000 / totalFrames : 0;

  useEffect(() => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    imgRef.current = img;

    const handleLoad = () => {
      setLoaded(true);
      drawFrame(0);
      if (isAnimated) startAnimation();
    };

    const handleError = () => {
      console.error(`[SpriteImage] Failed to load: ${url}`);
    };

    img.onload = handleLoad;
    img.onerror = handleError;
    img.src = url;

    return () => {
      img.onload = null;
      img.onerror = null;
      stopAnimation();
    };
  }, [url]);

  useEffect(() => {
    if (loaded && isAnimated) {
      startAnimation();
    }
    return () => stopAnimation();
  }, [loaded, frameDuration]);

  function startAnimation() {
    stopAnimation();
    timerRef.current = setInterval(() => {
      frameRef.current = (frameRef.current + 1) % totalFrames;
      drawFrame(frameRef.current);
    }, frameDuration);
  }

  function stopAnimation() {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }

  function drawFrame(frame) {
    const canvas = canvasRef.current;
    const img = imgRef.current;
    if (!canvas || !img || !img.complete) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.imageSmoothingEnabled = false;
    ctx.clearRect(0, 0, fw, fh);
    let sourceX;
    let sourceY;
    if (cycleAll) {
      const currentRow = Math.floor(frame / cols);
      const currentCol = frame % cols;
      sourceX = currentCol * fw;
      sourceY = currentRow * fh;
    } else {
      sourceX = frame * fw;
      sourceY = row * fh;
    }
    ctx.drawImage(
      img,
      sourceX,
      sourceY,
      fw,
      fh,
      0,
      0,
      fw,
      fh
    );
  }

  const canvasStyle = {
    width: `${fw}px`,
    height: `${fh}px`,
    maxWidth: "100%",
    maxHeight: "100%",
    imageRendering: "pixelated",
    display: "block",
    flexShrink: 0,
    backgroundColor: "transparent",
    ...style,
  };

  const ariaLabel = alt
    ? (row !== undefined && rows > 1
        ? `${alt} (${DIRECTION_LABELS[row] || "Sul"})`
        : alt)
    : undefined;

  return (
    <canvas
      ref={canvasRef}
      width={fw}
      height={fh}
      className={className}
      style={canvasStyle}
      role={ariaLabel ? "img" : "presentation"}
      aria-label={ariaLabel}
      data-loaded={loaded ? "true" : "false"}
      {...rest}
    />
  );
}

SpriteImage.propTypes = {
  kind: PropTypes.oneOf(["monster", "item"]),
  name: PropTypes.string.isRequired,
  sprite: PropTypes.string,
  frameSize: PropTypes.number,
  frameWidth: PropTypes.number,
  frameHeight: PropTypes.number,
  framesPerDirection: PropTypes.number,
  frames: PropTypes.number,
  directions: PropTypes.number,
  direction: PropTypes.oneOf([0, 1, 2, 3]),
  duration: PropTypes.string,
  className: PropTypes.string,
  style: PropTypes.object,
  alt: PropTypes.string,
  eager: PropTypes.bool,
};

SpriteImage.DIRECTIONS = DIRECTION_LABELS;
