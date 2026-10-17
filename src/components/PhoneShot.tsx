/** A real screen from the app, drawn as an iPhone (the status bar is in the image). Images are 600x1298. */
export function PhoneShot({ src, alt, className = "", priority = false }: { src: string; alt: string; className?: string; priority?: boolean }) {
  return (
    <div className={`overflow-hidden rounded-[40px] bg-paper shadow-[0_0_0_7px_#16140f,0_0_0_8px_#3a3732,0_28px_56px_-24px_rgba(22,20,15,0.45)] ${className}`}>
      {/* eslint-disable-next-line @next/next/no-img-element -- static export, images are pre-sized */}
      <img src={`${src}.webp`} alt={alt} width={600} height={1298} loading={priority ? "eager" : "lazy"} fetchPriority={priority ? "high" : undefined} decoding="async" className="block h-auto w-full" />
    </div>
  );
}
