'use client';

import React, { useState, useEffect } from 'react';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, ChevronLeft, ChevronRight, Filter } from 'lucide-react';

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

  // Reset page on filter change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, statusFilter]);

  return (
    <Card className="bg-slate-950 border-slate-800">
      <CardHeader>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <CardTitle className="text-slate-100">Detailed Transaction Records</CardTitle>
          
          <div className="flex flex-col sm:flex-row gap-2">
             {/* Search */}
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-slate-400" />
              <Input
                placeholder="Search Account ID..."
                className="pl-8 w-full sm:w-[200px] bg-slate-900 border-slate-800 text-slate-200 focus:ring-emerald-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {/* Filter */}
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-[150px] bg-slate-900 border-slate-800 text-slate-200">
                <div className="flex items-center gap-2">
                    <Filter className="h-4 w-4" />
                    <SelectValue placeholder="Filter Status" />
                </div>
              </SelectTrigger>
              <SelectContent className="bg-slate-900 border-slate-800 text-slate-200">
                <SelectItem value="all">All Records</SelectItem>
                <SelectItem value="risk" className="text-red-400">High Risk Only</SelectItem>
                <SelectItem value="healthy" className="text-emerald-400">Healthy Only</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border border-slate-800">
          <Table>
            <TableHeader className="bg-slate-900">
              <TableRow className="border-slate-800 hover:bg-slate-900">
                <TableHead className="text-slate-400">Account ID</TableHead>
                <TableHead className="text-slate-400">Date</TableHead>
                <TableHead className="text-slate-400 text-right">Revenue</TableHead>
                <TableHead className="text-slate-400 text-right">Expense</TableHead>
                <TableHead className="text-slate-400 text-right">Balance</TableHead>
                <TableHead className="text-slate-400 text-center">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedData.length > 0 ? (
                paginatedData.map((row, index) => {
                  const isRisk = row.overdue_amount > 0 || row.expense > row.revenue;
                  return (
                    <TableRow key={index} className="border-slate-800 hover:bg-slate-900/50 transition-colors">
                      <TableCell className="font-medium text-slate-200">{row.account_id}</TableCell>
                      <TableCell className="text-slate-400">{row.date}</TableCell>
                      <TableCell className="text-right text-emerald-500">${row.revenue.toLocaleString()}</TableCell>
                      <TableCell className="text-right text-rose-500">${row.expense.toLocaleString()}</TableCell>
                      <TableCell className="text-right text-blue-400">${row.balance.toLocaleString()}</TableCell>
                      <TableCell className="text-center">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          isRisk 
                            ? 'bg-red-900/30 text-red-400 border border-red-900/50' 
                            : 'bg-emerald-900/30 text-emerald-400 border border-emerald-900/50'
                        }`}>
                          {isRisk ? 'High Risk' : 'Healthy'}
                        </span>
                      </TableCell>
                    </TableRow>
                  );
                })
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

        {/* Pagination Controls */}
        <div className="flex items-center justify-between space-x-2 py-4">
          <div className="text-sm text-slate-500">
            Page {currentPage} of {totalPages} ({filteredData.length} records)
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="bg-slate-900 border-slate-800 text-slate-200 hover:bg-slate-800"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="bg-slate-900 border-slate-800 text-slate-200 hover:bg-slate-800"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
