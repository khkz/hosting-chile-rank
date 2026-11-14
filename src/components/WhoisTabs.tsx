import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Code, FileText, Gauge, Globe, Server, Shield } from 'lucide-react';
import type { DomainAnalysisResult } from '@/services/domainAnalysis';
import DomainOverviewTab from '@/components/herramientas/DomainOverviewTab';
import { DomainDnsTab, DomainWhoisTab } from '@/components/herramientas/DomainRecordTabs';
import { DomainPerformanceTab, DomainSecurityTab, DomainTechTab } from '@/components/herramientas/DomainCheckTabs';

interface WhoisTabsProps {
  data: DomainAnalysisResult;
  isLoading?: boolean;
}

const TABS = [
  { value: 'overview', label: 'Resumen', icon: Globe },
  { value: 'dns', label: 'DNS', icon: Server },
  { value: 'whois', label: 'WHOIS', icon: FileText },
  { value: 'security', label: 'Seguridad', icon: Shield },
  { value: 'performance', label: 'Rendimiento', icon: Gauge },
  { value: 'technology', label: 'Tecnología', icon: Code },
] as const;

/**
 * Pestañas de la ficha de dominio. Cada pestaña muestra solo lo que la
 * consulta devolvió y dice cuándo una consulta no respondió.
 */
const WhoisTabs: React.FC<WhoisTabsProps> = ({ data, isLoading }) => {
  if (isLoading) {
    return (
      <p className="t-small rounded-xl border border-rule bg-paper p-5 text-ink-2" role="status">
        Actualizando el análisis…
      </p>
    );
  }

  return (
    <Tabs defaultValue="overview" className="w-full">
      <TabsList
        aria-label="Secciones del análisis"
        className="flex h-auto w-full justify-start gap-1 overflow-x-auto rounded-none border-b border-rule bg-transparent p-0 text-ink-2"
      >
        {TABS.map(({ value, label, icon: Icon }) => (
          <TabsTrigger
            key={value}
            value={value}
            className="h-11 shrink-0 gap-2 rounded-none border-b-2 border-transparent px-3 text-[15px] font-semibold text-ink-2 transition-colors hover:text-ink data-[state=active]:border-ink data-[state=active]:bg-transparent data-[state=active]:text-ink data-[state=active]:shadow-none"
          >
            <Icon aria-hidden className="h-4 w-4" />
            {label}
          </TabsTrigger>
        ))}
      </TabsList>

      <TabsContent value="overview" className="mt-6">
        <DomainOverviewTab data={data} />
      </TabsContent>
      <TabsContent value="dns" className="mt-6">
        <DomainDnsTab data={data} />
      </TabsContent>
      <TabsContent value="whois" className="mt-6">
        <DomainWhoisTab data={data} />
      </TabsContent>
      <TabsContent value="security" className="mt-6">
        <DomainSecurityTab data={data} />
      </TabsContent>
      <TabsContent value="performance" className="mt-6">
        <DomainPerformanceTab />
      </TabsContent>
      <TabsContent value="technology" className="mt-6">
        <DomainTechTab data={data} />
      </TabsContent>
    </Tabs>
  );
};

export default WhoisTabs;
