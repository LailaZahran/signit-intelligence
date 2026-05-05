import { createContext, useContext, useState, useEffect } from 'react';

export type Lang = 'en' | 'ar';

interface LanguageContextValue {
  lang: Lang;
  setLang: (l: Lang) => void;
  ar: boolean;
}

const LanguageContext = createContext<LanguageContextValue | null>(null);

function detectBrowserLang(): Lang {
  return 'ar';
}

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Lang>(detectBrowserLang);

  useEffect(() => {
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = lang;
  }, [lang]);

  return (
    <LanguageContext.Provider value={{ lang, setLang: setLangState, ar: lang === 'ar' }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage(): LanguageContextValue {
  const c = useContext(LanguageContext);
  if (!c) throw new Error('useLanguage must be used within LanguageProvider');
  return c;
}
