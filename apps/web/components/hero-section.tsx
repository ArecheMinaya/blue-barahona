import type { ImageAsset } from '@/lib/types';
import Image from 'next/image';
import Link from 'next/link';

type HeroSectionProps = {
  title: string[];
  image: ImageAsset;
  ctaLabel: string;
  ctaHref: string;
};

export function HeroSection({ title, image, ctaLabel, ctaHref }: HeroSectionProps) {
  return (
    <section className="relative h-screen w-full flex items-center justify-center overflow-hidden bg-surface">
      <Image src={image.src} alt={image.alt} fill priority className="object-cover" sizes="100vw" />
      <div className="absolute inset-0 bg-gradient-to-b from-white/10 via-transparent to-[rgba(248,250,251,0.48)]" />

      <div className="page-shell relative z-10 text-center">
        <h1 className="text-5xl font-extrabold tracking-[-0.05em] text-[var(--color-primary)] opacity-95 sm:text-7xl lg:text-[7rem]">
          {title[0]}
          <br />
          {title[1]}
        </h1>

        <div className="mt-10">
          <Link href={ctaHref} className="button-primary">
            {ctaLabel}
          </Link>
        </div>
      </div>
    </section>
  );
}
