
import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from "@/components/ui/button";

interface TransactionPaginationProps {
  currentPage: number;
  totalPages: number;
  totalRecords: number;
  onPageChange: (page: number) => void;
}

export function TransactionPagination({ 
  currentPage, 
  totalPages, 
  totalRecords, 
  onPageChange 
}: TransactionPaginationProps) {
  return (
    <div className="flex items-center justify-between space-x-2 py-4">
      <div className="text-sm text-slate-500">
        Page {currentPage} of {totalPages} ({totalRecords} records)
      </div>
      <div className="flex items-center space-x-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(Math.max(1, currentPage - 1))}
          disabled={currentPage === 1}
          className="bg-black border-gray-800 text-white hover:bg-gray-900"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
          disabled={currentPage === totalPages}
          className="bg-black border-gray-800 text-white hover:bg-gray-900"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
