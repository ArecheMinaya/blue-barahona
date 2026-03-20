import Image from 'next/image';
import Link from 'next/link';
import {
  craftsmanshipHighlights,
  craftsmanshipImages,
  homeCta,
  homeElements,
  homeOrigin,
  storyQuote,
} from '@/data/site';
import { getHomeProducts } from '@/lib/catalog';

export default function HomePage() {
  const featuredProducts = getHomeProducts();

  return (
    <>
      <section className="relative flex h-screen w-full items-center justify-center overflow-hidden bg-[var(--color-surface)]">
        <div className="absolute inset-0 z-0">
          <Image
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuAcGQce28Ev8vKWAO-zO5ddOmCu_8loScq0LJrqrKBf3LGuPDOf5CDBaYc7URxMpfTpGx4L1mlPnqrLW1t-JpsVZF9tROvJh9Wrz361juuKEBuH3yjsWTv7IuRwSDq54uahOwkZIx2l6UHAU4itmQRAkt2qiGFyCUeHWUJOc1rQ4BzOpQfg9zHuOkcz_9YWafNKNhTH-hLiOdUuayZORrJPHoBkr8R19OWGz7OtTTkZJC87MND3rQPjCAAn2Au46pTvNyQdPGtyqm0"
            alt="Cinematic macro shot of a Larimar necklace against a soft white linen background"
            fill
            priority
            className="object-cover"
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[rgba(248,250,251,0.4)]" />
        </div>
        <div className="relative z-10 px-6 text-center">
          <h1 className="font-headline mb-8 text-5xl font-extrabold tracking-tighter text-[var(--color-primary)] opacity-90 md:text-8xl">
            The Ocean,
            <br />
            Captured in Stone
          </h1>
          <div className="flex flex-col items-center gap-6">
            <Link
              href="/collection"
              className="bg-[var(--color-primary)] px-10 py-4 font-label text-xs uppercase tracking-[0.2em] text-white transition-all duration-500 active:scale-[0.98] hover:bg-[var(--color-primary-container)]"
            >
              Discover the Collection
            </Link>
          </div>
        </div>
      </section>

      <section className="flex min-h-screen flex-col items-center bg-[var(--color-surface-container-low)] md:flex-row">
        <div className="h-[614px] w-full overflow-hidden md:h-screen md:w-1/2">
          <Image
            src={homeOrigin.image.src}
            alt={homeOrigin.image.alt}
            width={1200}
            height={1400}
            className="h-full w-full scale-105 object-cover grayscale-[0.2] transition-all duration-1000 hover:scale-100 hover:grayscale-0"
          />
        </div>
        <div className="flex w-full flex-col justify-center gap-8 p-12 md:w-1/2 md:p-24">
          <span className="font-label text-xs uppercase tracking-[0.3em] text-[var(--color-tertiary)]">
            Ethereal Origins
          </span>
          <h2 className="font-headline text-4xl font-light leading-tight text-[var(--color-primary)] md:text-6xl">
            A gift from the Caribbean. <br />
            <span className="font-bold">Rarity in every ripple.</span>
          </h2>
          <p className="max-w-md text-lg font-light leading-relaxed text-[var(--color-on-surface-variant)]">
            {homeOrigin.description}
          </p>
        </div>
      </section>

      <section className="bg-[var(--color-surface)] py-32">
        <div className="mx-auto max-w-7xl px-10">
          <div className="grid grid-cols-1 items-center gap-20 md:grid-cols-2">
            <div className="order-2 flex flex-col gap-12 md:order-1">
              {craftsmanshipHighlights.map((highlight) => (
                <div key={highlight.title} className="space-y-4">
                  <h3 className="font-headline text-3xl font-semibold text-[var(--color-primary)]">
                    {highlight.title}
                  </h3>
                  <p className="text-lg font-light leading-relaxed text-[var(--color-on-surface-variant)]">
                    {highlight.description}
                  </p>
                </div>
              ))}
            </div>

            <div className="order-1 grid h-[600px] grid-cols-2 gap-4 md:order-2">
              {craftsmanshipImages.map((image, index) => (
                <div
                  key={image.src}
                  className={
                    index === 1
                      ? 'mt-12 overflow-hidden rounded-xl shadow-2xl'
                      : 'overflow-hidden rounded-xl shadow-2xl'
                  }
                >
                  <Image
                    src={image.src}
                    alt={image.alt}
                    width={800}
                    height={1000}
                    className="h-full w-full object-cover"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section
        id="story"
        className="relative flex min-h-[46rem] items-center justify-center overflow-hidden"
      >
        <Image
          src={storyQuote.image.src}
          alt={storyQuote.image.alt}
          fill
          className="object-cover"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-[rgba(0,26,44,0.3)] backdrop-blur-[2px]" />
        <div className="relative z-10 max-w-3xl px-6 text-center">
          <p className="font-headline text-xl font-extralight italic leading-relaxed tracking-wide text-white md:text-3xl">
            &ldquo;{storyQuote.quote}&rdquo;
          </p>
          <div className="mx-auto mt-12 h-px w-12 bg-[var(--color-secondary-container)]" />
        </div>
      </section>

      <section className="bg-[var(--color-surface-container-low)] py-32">
        <div className="mx-auto max-w-[1400px] px-10">
          <div className="mb-20 flex items-end justify-between">
            <div className="space-y-4">
              <span className="font-label text-xs uppercase tracking-[0.3em] text-[var(--color-tertiary)]">
                The Selection
              </span>
              <h2 className="font-headline text-4xl font-bold text-[var(--color-primary)]">
                Curated Elements
              </h2>
            </div>
            <Link
              href="/collection"
              className="font-label border-b border-[var(--color-outline-variant)] pb-2 text-sm uppercase tracking-widest text-[var(--color-primary)] transition-colors hover:border-[var(--color-primary)]"
            >
              View All Pieces
            </Link>
          </div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
            {featuredProducts.map((product, index) => (
              <Link
                key={product.slug}
                href={`/product/${product.slug}`}
                className={index === 1 || index === 3 ? 'group cursor-pointer lg:translate-y-8' : 'group cursor-pointer'}
              >
                <div className="mb-6 aspect-[4/5] overflow-hidden rounded-xl bg-[var(--color-surface-container-lowest)] transition-transform duration-700 group-hover:scale-[1.02]">
                  <Image
                    src={product.heroImage.src}
                    alt={product.heroImage.alt}
                    width={800}
                    height={1000}
                    className="h-full w-full object-cover opacity-90 mix-blend-multiply transition-opacity group-hover:opacity-100"
                  />
                </div>
                <h4 className="font-headline text-lg font-medium text-[var(--color-primary)]">
                  {product.name}
                </h4>
                <p className="font-label mt-1 text-xs uppercase tracking-widest text-[var(--color-on-surface-variant)]">
                  {product.collection} • ${product.price.toLocaleString('en-US')}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[var(--color-primary)] py-32">
        <div className="mx-auto max-w-7xl px-10">
          <div className="mb-20 text-center">
            <h2 className="font-headline text-4xl font-light tracking-tight text-white">
              The Elements of Larimar
            </h2>
          </div>

          <div className="grid grid-cols-1 gap-10 md:grid-cols-3">
            {homeElements.map((item) => {
              const iconName =
                item.icon === 'waves'
                  ? 'waves'
                  : item.icon === 'sparkles'
                    ? 'auto_awesome'
                    : 'diamond';

              return (
                <article
                  key={item.title}
                  className="glass-morphism rounded-xl border border-white/10 bg-white/5 p-10 transition-colors duration-500 hover:bg-white/10"
                >
                  <span
                    className={
                      item.icon === 'waves'
                        ? 'material-symbols-outlined mb-6 block text-4xl text-[var(--color-secondary-container)]'
                        : item.icon === 'sparkles'
                          ? 'material-symbols-outlined mb-6 block text-4xl text-[var(--color-tertiary-fixed)]'
                          : 'material-symbols-outlined mb-6 block text-4xl text-[var(--color-surface-container-high)]'
                    }
                  >
                    {iconName}
                  </span>
                  <h4 className="font-headline mb-4 text-xl text-white">{item.title}</h4>
                  <p className="text-sm font-light leading-relaxed text-[var(--color-primary-fixed-dim,#a6caed)]">
                    {item.description}
                  </p>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section className="flex flex-col items-center bg-[var(--color-surface)] px-10 py-40 text-center">
        <h2 className="font-headline mb-12 text-5xl font-extrabold tracking-tighter text-[var(--color-primary)] md:text-7xl">
            {homeCta.title}
        </h2>
        <p className="mb-12 max-w-xl text-lg font-light leading-relaxed text-[var(--color-on-surface-variant)]">
          {homeCta.description}
        </p>
        <div className="flex flex-col gap-6 md:flex-row">
            <Link
              href={homeCta.primary.href}
              className="bg-[var(--color-primary)] px-12 py-5 font-label text-xs uppercase tracking-[0.2em] text-white transition-all hover:bg-[var(--color-primary-container)]"
            >
              {homeCta.primary.label}
            </Link>
            <a
              href={homeCta.secondary.href}
              className="border border-[var(--color-outline)] px-12 py-5 font-label text-xs uppercase tracking-[0.2em] text-[var(--color-primary)] transition-all hover:bg-[var(--color-surface-container-low)]"
            >
              {homeCta.secondary.label}
            </a>
          </div>
      </section>
    </>
  );
}
