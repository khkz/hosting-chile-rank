import React from 'react';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';

interface NicDomainPaginationProps {
  currentPage: number;
  totalPages: number;
  onChange: (page: number) => void;
}

/** Paginación del sistema con enlaces enfocables (href) y nombre accesible en español. */
const NicDomainPagination: React.FC<NicDomainPaginationProps> = ({ currentPage, totalPages, onChange }) => {
  if (totalPages <= 1) return null;

  const go = (page: number) => (e: React.MouseEvent) => {
    e.preventDefault();
    onChange(page);
  };

  const pages = Array.from({ length: Math.min(5, totalPages) }, (_, index) => {
    if (totalPages <= 5 || currentPage <= 3) return index + 1;
    if (currentPage >= totalPages - 2) return totalPages - 4 + index;
    return currentPage - 2 + index;
  });

  return (
    <Pagination aria-label="Páginas de la lista de dominios" className="mt-8 justify-start">
      <PaginationContent className="flex-wrap">
        {currentPage > 1 && (
          <PaginationItem>
            <PaginationPrevious href={`?pagina=${currentPage - 1}`} onClick={go(currentPage - 1)} />
          </PaginationItem>
        )}
        {pages.map((page) => (
          <PaginationItem key={page}>
            <PaginationLink
              href={`?pagina=${page}`}
              onClick={go(page)}
              isActive={currentPage === page}
              aria-label={`Página ${page}`}
              className="tabular"
            >
              {page}
            </PaginationLink>
          </PaginationItem>
        ))}
        {currentPage < totalPages && (
          <PaginationItem>
            <PaginationNext href={`?pagina=${currentPage + 1}`} onClick={go(currentPage + 1)} />
          </PaginationItem>
        )}
      </PaginationContent>
    </Pagination>
  );
};

export default NicDomainPagination;
