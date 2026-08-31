import Image from "next/image";
import Link from "next/link";

const Footer = () => (
  <footer className="border-t border-white/5">
    <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-6 px-4 py-10 sm:flex-row sm:px-6">
      <div className="flex items-center gap-3">
        <Image src="/zora-logo-light.svg" width={104} height={32} alt="Zora" />
      </div>

      <p className="text-sm text-gray-500">
        © {new Date().getFullYear()} Zora. Learn with intention.
      </p>

      <nav aria-label="Footer navigation" className="flex items-center gap-6 text-sm text-gray-400">
        <Link href="/sign-in" className="transition hover:text-white">
          Sign in
        </Link>
        <Link href="/sign-up" className="transition hover:text-white">
          Get started
        </Link>
      </nav>
    </div>
  </footer>
);

export default Footer;
