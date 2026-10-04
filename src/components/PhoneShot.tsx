/** A real screen from the /app demo in a simple phone frame. Images are 600x1298. */
export function PhoneShot({ src, alt, className = "" }: { src: string; alt: string; className?: string }) {
  return (
    <div className={`overflow-hidden rounded-[28px] border-[6px] border-[#1b2333] bg-[#0a1424] ${className}`}>
      {/* eslint-disable-next-line @next/next/no-img-element -- static export, images are pre-sized */}
      <img src={`${src}.webp`} alt={alt} width={600} height={1298} loading="lazy" decoding="async" className="block h-auto w-full" />
    </div>
  );
}
