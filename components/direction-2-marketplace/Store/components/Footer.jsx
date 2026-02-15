import { TRUST_ITEMS, FOOTER_LINKS } from "./products";
import { StoreIcon } from "./Icons";

export function TrustBand() {
  return (
    <div className="mt-12 grid grid-cols-2 sm:grid-cols-4 gap-4">
      {TRUST_ITEMS.map(({ icon, title, desc }) => (
        <div
          key={title}
          className="flex flex-col items-center text-center p-4 rounded-xl bg-white border border-stone-100"
        >
          <span className="text-2xl mb-2">{icon}</span>
          <p className="font-sans text-xs font-semibold text-stone-800">{title}</p>
          <p className="font-sans text-[11px] text-stone-400 mt-0.5">{desc}</p>
        </div>
      ))}
    </div>
  );
}

export function Footer() {
  return (
    <footer className="mt-12 border-t border-stone-200 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 bg-stone-900 rounded flex items-center justify-center text-white">
            <StoreIcon />
          </div>
          <span className="font-display text-stone-700">Marketplace</span>
        </div>
        <p className="font-sans text-xs text-stone-400 text-center">
          © 2025 Marketplace — Fine Textiles, Directly from Weavers.
        </p>
        <div className="flex gap-4">
          {FOOTER_LINKS.map((link) => (
            <a key={link} href="#" className="font-sans text-xs text-stone-400 hover:text-stone-700 transition">
              {link}
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
}