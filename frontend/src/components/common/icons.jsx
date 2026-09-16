// Small inline icon set (stroke-based, 20x20 viewBox) so the app doesn't need
// an external icon library dependency for a handful of glyphs.
const base = {
  fill: 'none',
  viewBox: '0 0 20 20',
  stroke: 'currentColor',
  strokeWidth: 1.6,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
};

export function IconPlus(props) {
  return (
    <svg {...base} {...props}>
      <path d="M10 4v12M4 10h12" />
    </svg>
  );
}

export function IconUpload(props) {
  return (
    <svg {...base} {...props}>
      <path d="M10 13V4M6.5 7.5 10 4l3.5 3.5M4 14v1a1 1 0 0 0 1 1h10a1 1 0 0 0 1-1v-1" />
    </svg>
  );
}

export function IconShare(props) {
  return (
    <svg {...base} {...props}>
      <circle cx="15" cy="5" r="2" />
      <circle cx="5" cy="10" r="2" />
      <circle cx="15" cy="15" r="2" />
      <path d="m6.7 9 6.6-3.1M6.7 11l6.6 3.1" />
    </svg>
  );
}

export function IconTrash(props) {
  return (
    <svg {...base} {...props}>
      <path d="M4 6h12M8 6V4.5A1.5 1.5 0 0 1 9.5 3h1A1.5 1.5 0 0 1 12 4.5V6M6 6l.6 9a1 1 0 0 0 1 .9h4.8a1 1 0 0 0 1-.9l.6-9" />
    </svg>
  );
}

export function IconLogOut(props) {
  return (
    <svg {...base} {...props}>
      <path d="M8 4H5a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h3M13 14l3.5-4L13 6M16 10H7" />
    </svg>
  );
}

export function IconArrowLeft(props) {
  return (
    <svg {...base} {...props}>
      <path d="M12 15l-5-5 5-5M7.5 10H16" />
    </svg>
  );
}

export function IconFileText(props) {
  return (
    <svg {...base} {...props}>
      <path d="M6 3h5l3 3v11a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1Z" />
      <path d="M11 3v3a1 1 0 0 0 1 1h3M7 11h6M7 14h6" />
    </svg>
  );
}

export function IconClose(props) {
  return (
    <svg {...base} {...props}>
      <path d="M5 5l10 10M15 5 5 15" />
    </svg>
  );
}

export function IconCheck(props) {
  return (
    <svg {...base} {...props}>
      <path d="M4 10.5 8 14l8-8" />
    </svg>
  );
}

export function IconAlert(props) {
  return (
    <svg {...base} {...props}>
      <path d="M10 7v4M10 14h.01" />
      <circle cx="10" cy="10" r="7.5" />
    </svg>
  );
}

export function IconEye(props) {
  return (
    <svg {...base} {...props}>
      <path d="M2 10s2.7-5.5 8-5.5S18 10 18 10s-2.7 5.5-8 5.5S2 10 2 10Z" />
      <circle cx="10" cy="10" r="2.3" />
    </svg>
  );
}

export function IconPencil(props) {
  return (
    <svg {...base} {...props}>
      <path d="m12.5 4.5 3 3-8.5 8.5H4v-3l8.5-8.5Z" />
    </svg>
  );
}
