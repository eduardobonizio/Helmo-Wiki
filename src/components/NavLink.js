import React, { useRef, useCallback } from "react";
import PropTypes from "prop-types";
import { Link, useLocation } from "react-router-dom";

const prefetched = new Set();

function prefetchRoute(to) {
  if (prefetched.has(to)) return;
  prefetched.add(to);
  const map = {
    "/monsters": () => import("../routes/monsters/monsters"),
    "/bosses": () => import("../routes/bosses/bosses"),
    "/items": () => import("../routes/items/items"),
    "/updates": () => import("../routes/updates/updates"),
  };
  const loader = map[to];
  if (loader) loader();
}

export default function NavLink({ to, className, style, children, end = false, ...rest }) {
  const ref = useRef(null);
  const location = useLocation();
  const isActive = end ? location.pathname === to : location.pathname.startsWith(to);

  const handleEnter = useCallback(() => prefetchRoute(to), [to]);

  return (
    <Link
      ref={ref}
      to={to}
      className={className}
      style={style}
      onMouseEnter={handleEnter}
      onFocus={handleEnter}
      onTouchStart={handleEnter}
      aria-current={isActive ? "page" : undefined}
      {...rest}
    >
      {children}
    </Link>
  );
}

NavLink.propTypes = {
  to: PropTypes.string.isRequired,
  className: PropTypes.string,
  style: PropTypes.object,
  children: PropTypes.node,
  end: PropTypes.bool,
};
