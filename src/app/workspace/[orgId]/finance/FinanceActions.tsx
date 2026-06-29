"use client";

import React from "react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";
import { FileSpreadsheet, FileText } from "lucide-react";
import { motion } from "framer-motion";

interface Transaction {
  id: string;
  type: string;
  amount: number;
  description: string;
  date: Date;
}

interface FinanceActionsProps {
  transactions: Transaction[];
  orgName: string;
}

export default function FinanceActions({ transactions, orgName }: FinanceActionsProps) {
  // Helper to format currency in Rupiah
  const formatRupiah = (val: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(val);
  };

  // Helper formatting date
  const formatDate = (dateVal: Date) => {
    return new Date(dateVal).toLocaleDateString("id-ID", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  // Calculate stats for reports
  const totalIncome = transactions
    .filter((t) => t.type === "INCOME")
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpense = transactions
    .filter((t) => t.type === "EXPENSE")
    .reduce((sum, t) => sum + t.amount, 0);

  const balance = totalIncome - totalExpense;

  // 1. EXPORT TO PDF
  const handleExportPDF = () => {
    const doc = new jsPDF();

    // Title
    doc.setFont("helvetica", "bold");
    doc.setFontSize(18);
    doc.setTextColor(15, 23, 42); // slate-900
    doc.text("LAPORAN KEUANGAN PERUSAHAAN", 14, 20);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.setTextColor(100, 116, 139); // slate-500
    doc.text(`Organisasi: ${orgName}`, 14, 26);
    doc.text(`Tanggal Cetak: ${new Date().toLocaleDateString("id-ID")}`, 14, 31);

    // Summary Section
    doc.setFontSize(11);
    doc.setTextColor(15, 23, 42);
    doc.text(`Total Pemasukan  : ${formatRupiah(totalIncome)}`, 14, 42);
    doc.text(`Total Pengeluaran : ${formatRupiah(totalExpense)}`, 14, 48);
    doc.text(`Saldo Bersih      : ${formatRupiah(balance)}`, 14, 54);

    // Divider line
    doc.setDrawColor(226, 232, 240); // slate-200
    doc.line(14, 60, 196, 60);

    // Table
    const tableBody = transactions.map((t) => [
      formatDate(t.date),
      t.description,
      t.type === "INCOME" ? "PEMASUKAN" : "PENGELUARAN",
      formatRupiah(t.amount),
    ]);

    autoTable(doc, {
      startY: 65,
      head: [["Tanggal", "Keterangan", "Tipe", "Jumlah Uang"]],
      body: tableBody,
      theme: "striped",
      headStyles: {
        fillColor: [37, 99, 235], // blue-600
        textColor: 255,
        fontSize: 10,
        fontStyle: "bold",
      },
      bodyStyles: {
        fontSize: 9,
      },
      columnStyles: {
        3: { halign: "right" }, // Align currency column right
      },
    });

    doc.save(`Laporan_Keuangan_${orgName.replace(/\s+/g, "_")}.pdf`);
  };

  // 2. EXPORT TO EXCEL
  const handleExportExcel = () => {
    // Format data untuk spreadsheet
    const excelData = transactions.map((t, idx) => ({
      No: idx + 1,
      Tanggal: formatDate(t.date),
      Keterangan: t.description,
      Tipe: t.type === "INCOME" ? "Pemasukan" : "Pengeluaran",
      "Jumlah (IDR)": t.amount,
    }));

    // Tambahkan summary baris di akhir excel
    const summaryRows = [
      {}, // Empty spacing
      { Keterangan: "TOTAL PEMASUKAN", "Jumlah (IDR)": totalIncome },
      { Keterangan: "TOTAL PENGELUARAN", "Jumlah (IDR)": totalExpense },
      { Keterangan: "SALDO BERSIH", "Jumlah (IDR)": balance },
    ];

    const finalSheetData = [...excelData, ...summaryRows];

    const worksheet = XLSX.utils.json_to_sheet(finalSheetData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Laporan Keuangan");

    // Write file
    XLSX.writeFile(workbook, `Laporan_Keuangan_${orgName.replace(/\s+/g, "_")}.xlsx`);
  };

  return (
    <div className="flex gap-2 font-sans">
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={handleExportPDF}
        className="h-10 px-4 bg-slate-900/60 border border-white/5 hover:border-white/10 hover:bg-slate-900 text-slate-200 text-xs font-semibold rounded-xl flex items-center gap-2 transition-all cursor-pointer backdrop-blur-sm"
      >
        <FileText className="h-4 w-4 text-red-400" />
        Ekspor PDF
      </motion.button>

      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={handleExportExcel}
        className="h-10 px-4 bg-slate-900/60 border border-white/5 hover:border-white/10 hover:bg-slate-900 text-slate-200 text-xs font-semibold rounded-xl flex items-center gap-2 transition-all cursor-pointer backdrop-blur-sm"
      >
        <FileSpreadsheet className="h-4 w-4 text-emerald-400" />
        Ekspor Excel
      </motion.button>
    </div>
  );
}
