import React from 'react';
import { useParams } from 'react-router-dom';
import VsAliasRedirect from './VsAliasRedirect';
import ComparativaVs from '@/pages/ComparativaVs';

/**
 * /comparativa/:pair
 * - If pair contains "-vs-" → programmatic brand comparison page.
 * - Otherwise → legacy alias redirect to /vs/:rival (anti-fake comparison).
 */
const ComparativaRouteDispatcher: React.FC = () => {
  const { rival } = useParams<{ rival: string }>();
  if (rival && rival.includes('-vs-')) return <ComparativaVs />;
  return <VsAliasRedirect />;
};

export default ComparativaRouteDispatcher;
