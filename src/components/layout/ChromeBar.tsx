import { Link, useLocation } from "wouter";
import { usePersona } from "@/context/PersonaContext";
import { useLanguage } from "@/context/LanguageContext";
import { AR_PERSONAS, AR_UI, EN_UI } from "@/data/ar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { PersonaId } from "@/types";

export function ChromeBar() {
  const [location] = useLocation();
  const { activePersona, personas, setPersona } = usePersona();
  const { lang, setLang, ar } = useLanguage();

  const ui = ar ? AR_UI : EN_UI;

  const navLinks = [
    { href: "/contracts", label: ui.navContracts },
    { href: "/portfolio", label: ui.navPortfolio },
    { href: "/upload",    label: ui.navUpload },
  ];

  const displayRole = ar ? AR_PERSONAS[activePersona.id].role : activePersona.role;

  return (
    <header
      className="fixed top-0 left-0 right-0 h-14 z-50 glass-nav flex items-center justify-between px-6"
      dir={ar ? 'rtl' : 'ltr'}
    >
      {/* Left: wordmark */}
      <div className="flex items-center gap-3">
        <Link href="/" className="flex items-center gap-2" data-testid="link-home">
          <span className="font-bold text-[var(--brand-navy)] text-[15px] tracking-tight">
            Signit Intelligence
          </span>
          <span className="text-[10px] font-bold tracking-wider bg-[var(--brand-indigo-pale)] text-[var(--brand-indigo)] px-1.5 py-0.5 rounded">
            {ui.beta}
          </span>
        </Link>
      </div>

      {/* Right: nav + lang + persona */}
      <div className="flex items-center gap-6">
        <nav className="flex items-center gap-5">
          {navLinks.map((link) => {
            const isActive = location.startsWith(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`text-sm font-medium transition-colors ${
                  isActive
                    ? "text-[var(--brand-navy)]"
                    : "text-muted-foreground hover:text-[var(--brand-navy)]"
                }`}
                data-testid={`link-${link.href.replace('/', '')}`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div className="h-5 w-px bg-gray-200" />

        {/* Language toggle */}
        <button
          onClick={() => setLang(ar ? 'en' : 'ar')}
          className={`text-[11px] font-semibold px-2.5 py-1 rounded-full border transition-all ${
            ar
              ? 'border-[var(--brand-indigo)] text-[var(--brand-indigo)] bg-[var(--brand-indigo-pale)]'
              : 'border-gray-200 text-gray-400 hover:border-[var(--brand-indigo)] hover:text-[var(--brand-indigo)]'
          }`}
          data-testid="lang-toggle"
          aria-label="Toggle language"
        >
          {ar ? 'EN' : 'عربي'}
        </button>

        <div className="h-5 w-px bg-gray-200" />

        {/* Persona switcher */}
        <DropdownMenu>
          <DropdownMenuTrigger
            className="flex items-center gap-2 focus:outline-none group"
            data-testid="dropdown-persona"
          >
            <div className="text-right hidden sm:block">
              <div className="text-sm font-medium text-[var(--brand-navy)] leading-none group-hover:text-[var(--brand-indigo)] transition-colors" dir="ltr">
                {activePersona.name}
              </div>
              <div className="text-[11px] text-muted-foreground mt-0.5">{displayRole}</div>
            </div>
            <Avatar
              className="h-8 w-8 border shadow-sm transition-transform group-hover:scale-105"
              style={{ backgroundColor: activePersona.bgColor }}
            >
              <AvatarFallback className="text-xs font-semibold" style={{ color: activePersona.color }}>
                {activePersona.initials}
              </AvatarFallback>
            </Avatar>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-60">
            <DropdownMenuLabel className="text-xs text-muted-foreground font-normal">
              {ui.switchPersona}
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            {personas.map((p) => (
              <DropdownMenuItem
                key={p.id}
                onClick={() => setPersona(p.id as PersonaId)}
                className={`flex items-center gap-3 cursor-pointer ${
                  activePersona.id === p.id ? "bg-[var(--brand-indigo-pale)]" : ""
                }`}
                data-testid={`persona-select-${p.id}`}
              >
                <Avatar className="h-7 w-7 border" style={{ backgroundColor: p.bgColor }}>
                  <AvatarFallback className="text-[10px] font-semibold" style={{ color: p.color }}>
                    {p.initials}
                  </AvatarFallback>
                </Avatar>
                <div className="flex flex-col">
                  <span className="text-sm font-medium">{p.name}</span>
                  <span className="text-[11px] text-muted-foreground">
                    {ar ? AR_PERSONAS[p.id].role : p.role}
                  </span>
                </div>
                {activePersona.id === p.id && (
                  <span className="ms-auto h-1.5 w-1.5 rounded-full bg-[var(--brand-indigo)]" />
                )}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
