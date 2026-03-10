
import React from 'react';
import { Search, Filter } from 'lucide-react';
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface TransactionFiltersProps {
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  statusFilter: string;
  setStatusFilter: (value: string) => void;
  onFilterChange: () => void;
}

export function TransactionFilters({ 
  searchTerm, 
  setSearchTerm, 
  statusFilter, 
  setStatusFilter,
  onFilterChange
}: TransactionFiltersProps) {
  return (
    <div className="flex flex-col sm:flex-row gap-2">
      {/* Search */}
      <div className="relative">
        <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
        <Input
          placeholder="Search Account ID..."
          className="pl-8 w-full sm:w-[200px] bg-black border-gray-800 text-white focus:ring-blue-600 focus:border-blue-600"
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            onFilterChange();
          }}
        />
      </div>

      {/* Filter */}
      <Select 
        value={statusFilter} 
        onValueChange={(val) => {
          setStatusFilter(val);
          onFilterChange();
        }}
      >
        <SelectTrigger className="w-full sm:w-[150px] bg-black border-gray-800 text-white">
          <div className="flex items-center gap-2">
              <Filter className="h-4 w-4" />
              <SelectValue placeholder="Filter Status" />
          </div>
        </SelectTrigger>
        <SelectContent className="bg-black border-gray-800 text-white">
          <SelectItem value="all">All Records</SelectItem>
          <SelectItem value="risk" className="text-red-500">High Risk Only</SelectItem>
          <SelectItem value="healthy" className="text-green-500">Healthy Only</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
