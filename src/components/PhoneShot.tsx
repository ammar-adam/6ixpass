/** A real screen from the app demo, drawn as an iPhone (rounded corners, status bar in the image). Images are 600x1298. */
export function PhoneShot({ src, alt, className = "" }: { src: string; alt: string; className?: string }) {
  return (
    <div className={`overflow-hidden rounded-[44px] bg-paper shadow-[0_0_0_8px_#121212,0_0_0_9.5px_#4a4845,0_30px_60px_-24px_rgba(0,0,0,0.6)] ${className}`}>
      {/* eslint-disable-next-line @next/next/no-img-element -- static export, images are pre-sized */}
      <img src={`${src}.webp`} alt={alt} width={600} height={1298} loading="lazy" decoding="async" className="block h-auto w-full" />
    </div>
  );
}
