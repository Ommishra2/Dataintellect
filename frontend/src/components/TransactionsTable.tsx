'use client';

import React, { useState } from 'react';
import { 
  Table, 
  TableBody, 
  TableCell,
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { TransactionFilters } from "./transactions/TransactionFilters";
import { TransactionRow } from "./transactions/TransactionRow";
import { TransactionPagination } from "./transactions/TransactionPagination";

interface Transaction {
  account_id: string;
  date: string;
  revenue: number;
  expense: number;
  balance: number;
  overdue_amount: number;
  payment_delay_days: number;
}

interface TransactionsTableProps {
  transactions: Transaction[];
}

export default function TransactionsTable({ transactions }: TransactionsTableProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all'); // all, risk, healthy
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Filter Logic
  // Optimization: specific filtering logic extracted or kept here as it's the main logic
  const filteredData = transactions.filter(item => {
    const matchesSearch = item.account_id.toLowerCase().includes(searchTerm.toLowerCase());
    
    let matchesStatus = true;
    if (statusFilter === 'risk') {
      matchesStatus = item.overdue_amount > 0 || item.expense > item.revenue;
    } else if (statusFilter === 'healthy') {
      matchesStatus = item.overdue_amount === 0 && item.expense <= item.revenue;
    }

    return matchesSearch && matchesStatus;
  });

  // Pagination Logic
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedData = filteredData.slice(startIndex, startIndex + itemsPerPage);

  const handleFilterChange = () => {
    setCurrentPage(1);
  };

  return (
    <Card className="bg-black border-neutral-800">
      <CardHeader>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <CardTitle className="text-slate-100">Detailed Transaction Records</CardTitle>
          
          <TransactionFilters 
            searchTerm={searchTerm} 
            setSearchTerm={setSearchTerm}
            statusFilter={statusFilter} 
            setStatusFilter={setStatusFilter}
            onFilterChange={handleFilterChange}
          />
        </div>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border border-gray-800">
          <Table>
            <TableHeader className="bg-black">
              <TableRow className="border-gray-800 hover:bg-neutral-900">
                <TableHead className="text-gray-500">Account ID</TableHead>
                <TableHead className="text-gray-500">Date</TableHead>
                <TableHead className="text-gray-500 text-right">Revenue</TableHead>
                <TableHead className="text-gray-500 text-right">Expense</TableHead>
                <TableHead className="text-gray-500 text-right">Balance</TableHead>
                <TableHead className="text-gray-500 text-center">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedData.length > 0 ? (
                paginatedData.map((row, index) => (
                  <TransactionRow key={index} row={row} />
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="h-24 text-center text-slate-500">
                    No results found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        <TransactionPagination 
          currentPage={currentPage}
          totalPages={totalPages}
          totalRecords={filteredData.length}
          onPageChange={setCurrentPage}
        />
      </CardContent>
    </Card>
  );
}
