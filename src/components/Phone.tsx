/*
 * A real app screen in a drawn iPhone (CSS only, no frame image).
 * Screens are 393:852 at 3x, exported as <src>-600/900/1179.webp by
 * scripts/site-shots.mjs. The status bar is in the screenshot; the
 * Dynamic Island is drawn here.
 */
export function Phone({
  src,
  alt,
  priority = false,
  onDark = false,
  sizes = "(min-width: 768px) 300px, 72vw",
  className = "",
}: {
  src: string;
  alt: string;
  priority?: boolean;
  onDark?: boolean;
  sizes?: string;
  className?: string;
}) {
  return (
    <div
      className={`phone relative w-full rounded-[15.5%/7.45%] bg-[#1d1c19] p-[3.2%] ${onDark ? "phone-dark" : "phone-light"} ${className}`}
    >
      <div className="relative overflow-hidden rounded-[14%/6.46%] bg-paper">
        {/* eslint-disable-next-line @next/next/no-img-element -- static export, images are pre-sized */}
        <img
          src={`${src}-900.webp`}
          srcSet={`${src}-600.webp 600w, ${src}-900.webp 900w, ${src}-1179.webp 1179w`}
          sizes={sizes}
          alt={alt}
          width={1179}
          height={2556}
          loading={priority ? "eager" : "lazy"}
          fetchPriority={priority ? "high" : undefined}
          decoding={priority ? "sync" : "async"}
          className="block aspect-[393/852] h-auto w-full"
        />
        <span aria-hidden="true" className="absolute left-1/2 top-[1.3%] h-[4.34%] w-[32%] -translate-x-1/2 rounded-full bg-black" />
      </div>
    </div>
  );
}
