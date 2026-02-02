import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Search } from "lucide-react";

interface DomainFiltersProps {
  tldFilter: string;
  onTldChange: (tld: string) => void;
  priceRange: [number, number];
  onPriceRangeChange: (range: [number, number]) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  availableTlds: string[];
}

export function DomainFilters({
  tldFilter,
  onTldChange,
  priceRange,
  onPriceRangeChange,
  searchQuery,
  onSearchChange,
  availableTlds,
}: DomainFiltersProps) {
  const formatPrice = (value: number) => {
    if (value >= 1000000) {
      return `$${(value / 1000000).toFixed(1)}M`;
    }
    if (value >= 1000) {
      return `$${(value / 1000).toFixed(0)}K`;
    }
    return `$${value}`;
  };

  return (
    <Card className="p-4 md:p-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 md:gap-6">
        {/* Search */}
        <div className="space-y-2">
          <Label htmlFor="search">Buscar dominio</Label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              id="search"
              placeholder="ejemplo.cl"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="pl-9"
            />
          </div>
        </div>

        {/* TLD Filter */}
        <div className="space-y-2">
          <Label>Extensión</Label>
          <Select value={tldFilter} onValueChange={onTldChange}>
            <SelectTrigger>
              <SelectValue placeholder="Todas las extensiones" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas</SelectItem>
              {availableTlds.map((tld) => (
                <SelectItem key={tld} value={tld}>
                  {tld}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Price Range */}
        <div className="md:col-span-2 space-y-2">
          <div className="flex items-center justify-between">
            <Label>Rango de precio</Label>
            <span className="text-sm text-muted-foreground">
              {formatPrice(priceRange[0])} - {formatPrice(priceRange[1])}
            </span>
          </div>
          <Slider
            value={priceRange}
            onValueChange={(value) => onPriceRangeChange(value as [number, number])}
            min={0}
            max={10000000}
            step={50000}
            className="mt-2"
          />
        </div>
      </div>
    </Card>
  );
}
