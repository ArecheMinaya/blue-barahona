import Link from "next/link";
import { footerLinks } from "@/data/site";

export function Footer() {
  return (
    <footer className="w-full bg-slate-50 px-10 py-20">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-8 md:flex-row">
        <div className="flex flex-col gap-2">
          <p className="font-headline text-lg font-bold tracking-widest text-slate-900">
            LARIMAR LENS
          </p>
          <p className="font-body text-[10px] uppercase tracking-[0.15em] text-slate-500">
            © 2024 LARIMAR LENS. ALL RIGHTS RESERVED.
          </p>
        </div>

        <div className="flex gap-10">
          {footerLinks.map((link) => (
            link.href.startsWith("mailto:") ? (
              <a
                key={link.href}
                href={link.href}
                className="font-body text-[10px] uppercase tracking-[0.15em] text-slate-400 transition-colors duration-300 hover:text-slate-900"
              >
                {link.label}
              </a>
            ) : (
              <Link
                key={link.href}
                href={link.href}
                className="font-body text-[10px] uppercase tracking-[0.15em] text-slate-400 transition-colors duration-300 hover:text-slate-900"
              >
                {link.label}
              </Link>
            )
          ))}
        </div>
      </div>
    </footer>
  );
}
