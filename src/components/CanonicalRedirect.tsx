import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

/**
 * Normalizes URLs to a single canonical form to prevent duplicate-content
 * issues in search engines:
 *  - Strips trailing slashes (except root)
 *  - Lowercases /vs/* and /catalogo/* slugs (case-insensitive routes)
 *  - Removes accidental double slashes
 */
const CASE_SENSITIVE_PREFIXES = ['/vs/', '/catalogo/'];

const CanonicalRedirect = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    let { pathname } = location;
    const original = pathname;

    // Collapse duplicate slashes
    pathname = pathname.replace(/\/{2,}/g, '/');

    // Strip trailing slash (keep root)
    if (pathname.length > 1 && pathname.endsWith('/')) {
      pathname = pathname.replace(/\/+$/, '');
    }

    // Lowercase known slug-based routes
    for (const prefix of CASE_SENSITIVE_PREFIXES) {
      if (pathname.toLowerCase().startsWith(prefix)) {
        pathname = prefix + pathname.slice(prefix.length).toLowerCase();
        break;
      }
    }

    if (pathname !== original) {
      navigate(pathname + location.search + location.hash, { replace: true });
    }
  }, [location, navigate]);

  return null;
};

export default CanonicalRedirect;
