import { useParams, Navigate } from 'react-router-dom';

/**
 * 301-style client redirect that forwards /comparar/:rival and
 * /comparativa/:rival to the canonical /vs/:rival (lowercased).
 */
const VsAliasRedirect = () => {
  const { rival } = useParams<{ rival: string }>();
  const target = (rival ?? '').toLowerCase().trim();
  if (!target) return <Navigate to="/transparencia-hosting-chile" replace />;
  return <Navigate to={`/vs/${target}`} replace />;
};

export default VsAliasRedirect;
