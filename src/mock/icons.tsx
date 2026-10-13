/*
 * Thin line icons drawn for the app, one stroke weight, like iOS.
 * All decorative: the button or link around each one carries the label.
 */
type P = { size?: number; className?: string; strokeWidth?: number };

const svg = (size: number, sw: number, className: string | undefined, children: React.ReactNode, fill = "none") => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={fill} stroke="currentColor" strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className={className}>
    {children}
  </svg>
);

export const IBack = ({ size = 22, className, strokeWidth = 2.2 }: P) => svg(size, strokeWidth, className, <path d="M15 5l-7 7 7 7" />);
export const IChev = ({ size = 16, className, strokeWidth = 2.2 }: P) => svg(size, strokeWidth, className, <path d="M9 6l6 6-6 6" />);
export const IClose = ({ size = 20, className, strokeWidth = 2.2 }: P) => svg(size, strokeWidth, className, <path d="M6 6l12 12M18 6L6 18" />);
export const ISearch = ({ size = 22, className, strokeWidth = 2 }: P) => svg(size, strokeWidth, className, <><circle cx="11" cy="11" r="7" /><path d="M20 20l-3.5-3.5" /></>);
export const ICheck = ({ size = 20, className, strokeWidth = 2.6 }: P) => svg(size, strokeWidth, className, <path d="M20 6L9 17l-5-5" />);
export const IHeart = ({ size = 22, className, strokeWidth = 2 }: P) =>
  svg(size, strokeWidth, className, <path d="M12 20s-7.5-4.6-9.3-9.2C1.4 7.4 3.6 4 7 4c2 0 3.5 1.2 5 3 1.5-1.8 3-3 5-3 3.4 0 5.6 3.4 4.3 6.8C19.5 15.4 12 20 12 20z" />);
export const IShare = ({ size = 21, className, strokeWidth = 2 }: P) => svg(size, strokeWidth, className, <><path d="M12 3v12M8 7l4-4 4 4" /><path d="M6 11H5v9h14v-9h-1" /></>);
export const IGear = ({ size = 22, className, strokeWidth = 1.8 }: P) =>
  svg(size, strokeWidth, className, <><circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.7 1.7 0 00.3 1.8l.1.1a2 2 0 11-2.8 2.8l-.1-.1a1.7 1.7 0 00-1.8-.3 1.7 1.7 0 00-1 1.5V21a2 2 0 11-4 0v-.1a1.7 1.7 0 00-1.1-1.5 1.7 1.7 0 00-1.8.3l-.1.1a2 2 0 11-2.8-2.8l.1-.1a1.7 1.7 0 00.3-1.8 1.7 1.7 0 00-1.5-1H3a2 2 0 110-4h.1a1.7 1.7 0 001.5-1.1 1.7 1.7 0 00-.3-1.8l-.1-.1a2 2 0 112.8-2.8l.1.1a1.7 1.7 0 001.8.3H9a1.7 1.7 0 001-1.5V3a2 2 0 114 0v.1a1.7 1.7 0 001 1.5 1.7 1.7 0 001.8-.3l.1-.1a2 2 0 112.8 2.8l-.1.1a1.7 1.7 0 00-.3 1.8V9a1.7 1.7 0 001.5 1H21a2 2 0 110 4h-.1a1.7 1.7 0 00-1.5 1z" /></>);
export const IMail = ({ size = 20, className, strokeWidth = 1.9 }: P) => svg(size, strokeWidth, className, <><rect x="3" y="5" width="18" height="14" rx="2.5" /><path d="M3.5 6.5L12 13l8.5-6.5" /></>);
export const IPlay = ({ size = 18, className }: P) => svg(size, 0, className, <path d="M8 5.5v13a1 1 0 001.5.9l10.4-6.5a1 1 0 000-1.8L9.5 4.6A1 1 0 008 5.5z" fill="currentColor" />);
export const IReset = ({ size = 20, className, strokeWidth = 1.9 }: P) => svg(size, strokeWidth, className, <><path d="M3 12a9 9 0 103-6.7" /><path d="M3 4v5h5" /></>);
export const IPlus = ({ size = 20, className, strokeWidth = 2.2 }: P) => svg(size, strokeWidth, className, <path d="M12 5v14M5 12h14" />);
export const IMinus = ({ size = 20, className, strokeWidth = 2.2 }: P) => svg(size, strokeWidth, className, <path d="M5 12h14" />);
export const ICamera = ({ size = 20, className, strokeWidth = 1.9 }: P) => svg(size, strokeWidth, className, <><path d="M4 8h3l2-3h6l2 3h3v11H4z" /><circle cx="12" cy="13" r="3.5" /></>);
export const IEye = ({ size = 20, className, strokeWidth = 1.9 }: P) => svg(size, strokeWidth, className, <><path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12z" /><circle cx="12" cy="12" r="3" /></>);

// Tab bar icons, 1.6 stroke, filled look when selected comes from colour only (like iOS line tabs).
export const IExplore = ({ size = 26, className, strokeWidth = 1.6 }: P) => svg(size, strokeWidth, className, <><circle cx="12" cy="12" r="9" /><path d="M15.5 8.5l-2 5-5 2 2-5z" /></>);
export const IPass = ({ size = 26, className, strokeWidth = 1.6 }: P) => svg(size, strokeWidth, className, <><rect x="3" y="5" width="18" height="14" rx="3" /><path d="M3 10h18" /></>);
export const IStore = ({ size = 26, className, strokeWidth = 1.6 }: P) => svg(size, strokeWidth, className, <path d="M4 9l1.5-5h13L20 9M4 9v11h16V9M4 9h16M9 20v-6h6v6" />);
