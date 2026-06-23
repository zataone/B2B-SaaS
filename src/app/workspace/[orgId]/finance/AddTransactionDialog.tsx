"use client";

import React, { useState, useActionState, useEffect } from "react";
import { createTransactionAction } from "@/app/actions/finance";
import { Plus, X, ArrowRight } from "lucide-react";

interface AddTransactionDialogProps {
  orgId: string;
}

export default function AddTransactionDialog({ orgId }: AddTransactionDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [state, formAction, isPending] = useActionState(createTransactionAction, null);

  // Close dialog on success
  useEffect(() => {
    if (state && state.success) {
      setIsOpen(false);
    }
  }, [state]);

  return (
    <div className="font-sans">
      {/* Trigger Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="h-10 px-4 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold rounded-xl flex items-center gap-2 transition-all cursor-pointer shadow shadow-blue-500/10"
      >
        <Plus className="h-4 w-4" />
        Input Transaksi
      </button>

      {/* Modal Dialog */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* Overlay */}
          <div
            onClick={() => setIsOpen(false)}
            className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm transition-all"
          />

          {/* Content */}
          <div className="relative bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md p-6 shadow-2xl z-10 animate-in zoom-in-95 duration-150">
            {/* Header */}
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-base font-semibold text-white">Catat Transaksi Keuangan</h3>
              <button
                onClick={() => setIsOpen(false)}
                className="h-7 w-7 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Form */}
            <form action={formAction} className="space-y-4">
              <input type="hidden" name="orgId" value={orgId} />

              {/* Error state message */}
              {state && !state.success && (
                <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-xs rounded-lg p-2.5">
                  {state.message}
                </div>
              )}

              {/* Tipe Transaksi */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                  Tipe Transaksi
                </label>
                <select
                  name="type"
                  required
                  defaultValue="INCOME"
                  className="w-full h-10 bg-slate-950 border border-slate-800 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 rounded-xl px-3.5 text-slate-300 text-xs outline-none transition-all"
                >
                  <option value="INCOME">Pemasukan (Income)</option>
                  <option value="EXPENSE">Pengeluaran (Expense)</option>
                </select>
              </div>

              {/* Jumlah Uang */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                  Jumlah Uang (Rupiah)
                </label>
                <input
                  type="number"
                  name="amount"
                  required
                  min={1}
                  placeholder="e.g. 5000000"
                  className="w-full h-10 bg-slate-950 border border-slate-800 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 rounded-xl px-3.5 text-white text-xs outline-none transition-all placeholder:text-slate-650"
                />
              </div>

              {/* Deskripsi */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                  Keterangan / Deskripsi
                </label>
                <input
                  type="text"
                  name="description"
                  required
                  placeholder="e.g. Pembayaran DP Client Alfa"
                  className="w-full h-10 bg-slate-950 border border-slate-800 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 rounded-xl px-3.5 text-white text-xs outline-none transition-all placeholder:text-slate-650"
                />
              </div>

              {/* Tanggal */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                  Tanggal Transaksi (Opsional)
                </label>
                <input
                  type="date"
                  name="date"
                  defaultValue={new Date().toISOString().split("T")[0]}
                  className="w-full h-10 bg-slate-950 border border-slate-800 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 rounded-xl px-3.5 text-slate-300 text-xs outline-none transition-all"
                />
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={isPending}
                className="w-full h-10 bg-blue-600 hover:bg-blue-505 text-white font-medium rounded-xl flex items-center justify-center text-xs transition-all shadow shadow-blue-500/10 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer group pt-1"
              >
                {isPending ? (
                  <span className="inline-block h-3.5 w-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    Simpan Transaksi
                    <ArrowRight className="h-3.5 w-3.5 ml-1.5 group-hover:translate-x-0.5 transition-transform" />
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
