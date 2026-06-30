import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { ChevronDown, Globe } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  COUNTRIES,
  DOT_COM_COUNTRIES,
  getCountryFromPath,
  isDotCom,
  stripCountryPrefix,
} from '@/lib/country';

/**
 * Country selector. Renders ONLY when the current host is .com.
 * On .cl this returns null and adds zero UI / zero behaviour.
 */
const CountrySwitcher = ({ mobile = false }: { mobile?: boolean }) => {
  const location = useLocation();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setVisible(isDotCom());
  }, []);

  if (!visible) return null;

  const current = getCountryFromPath(location.pathname);
  const rest = stripCountryPrefix(location.pathname);

  const goTo = (slug: string) => {
    const path = slug ? `/${slug}${rest === '/' ? '' : rest}` : rest;
    window.location.assign(path);
  };

  const goToChile = () => {
    window.location.assign(`${COUNTRIES.CL.origin}${rest}`);
  };

  const label = current ? `${current.flag} ${current.name}` : '🌎 Elige país';

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          className={
            mobile
              ? 'flex items-center gap-2 py-3 text-base font-medium text-[#2B2D42] hover:text-[#EF233C]'
              : 'flex items-center gap-1 px-3 py-2 text-sm font-medium text-[#2B2D42] hover:text-[#EF233C] transition-colors'
          }
          aria-label="Cambiar país"
        >
          <Globe className="h-4 w-4" />
          <span>{label}</span>
          <ChevronDown className="h-4 w-4" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-44 bg-white z-50">
        <DropdownMenuItem onClick={goToChile} className="cursor-pointer">
          {COUNTRIES.CL.flag} {COUNTRIES.CL.name}
        </DropdownMenuItem>
        {DOT_COM_COUNTRIES.map((c) => (
          <DropdownMenuItem
            key={c.code}
            onClick={() => goTo(c.slug)}
            className="cursor-pointer"
          >
            {c.flag} {c.name}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default CountrySwitcher;
