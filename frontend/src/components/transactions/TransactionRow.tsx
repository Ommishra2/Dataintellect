
import React from 'react';
import { TableCell, TableRow } from "@/components/ui/table";

interface Transaction {
  account_id: string;
  date: string;
  revenue: number;
  expense: number;
  balance: number;
  overdue_amount: number;
  payment_delay_days: number;
}

interface TransactionRowProps {
  row: Transaction;
}

export function TransactionRow({ row }: TransactionRowProps) {
  const isRisk = row.overdue_amount > 0 || row.expense > row.revenue;
  
  return (
    <TableRow className="border-gray-800 hover:bg-neutral-900 transition-colors">
      <TableCell className="font-mono font-medium text-white">{row.account_id}</TableCell>
      <TableCell className="text-gray-500 font-mono">{row.date}</TableCell>
      <TableCell className="text-right text-green-500 font-mono">${row.revenue.toLocaleString()}</TableCell>
      <TableCell className="text-right text-red-500 font-mono">${row.expense.toLocaleString()}</TableCell>
      <TableCell className="text-right text-white font-mono">${row.balance.toLocaleString()}</TableCell>
      <TableCell className="text-center">
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold font-mono border ${
          isRisk 
            ? 'bg-red-500/10 text-red-500 border-red-500/50' 
            : 'bg-green-500/10 text-green-500 border-green-500/50'
        }`}>
          {isRisk ? 'High Risk' : 'Healthy'}
        </span>
      </TableCell>
    </TableRow>
  );
}
