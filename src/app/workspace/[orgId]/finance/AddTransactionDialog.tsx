"use client";

import React, { useState, useActionState, useEffect } from "react";
import { createTransactionAction } from "@/app/actions/finance";
import { Plus, X, ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

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
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={() => setIsOpen(true)}
        className="h-10 px-4 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold rounded-xl flex items-center gap-2 transition-all cursor-pointer shadow shadow-blue-500/20"
      >
        <Plus className="h-4 w-4" />
        Input Transaksi
      </motion.button>

      {/* Modal Dialog */}
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center">
            {/* Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm transition-all"
            />

            {/* Content */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              transition={{ type: "spring", duration: 0.3 }}
              className="relative glass-panel rounded-2xl w-full max-w-md p-6 shadow-2xl z-10 overflow-hidden"
            >
              {/* Header */}
              <div className="flex items-center justify-between mb-5">
                <h3 className="text-base font-bold text-white">Catat Transaksi Keuangan</h3>
                <button
                  onClick={() => setIsOpen(false)}
                  className="h-7 w-7 rounded-lg hover:bg-white/5 text-slate-400 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              {/* Form */}
              <form action={formAction} className="space-y-4">
                <input type="hidden" name="orgId" value={orgId} />

                {/* Error state message */}
                {state && !state.success && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-red-500/10 border border-red-500/30 text-red-400 text-xs rounded-lg p-2.5 font-semibold"
                  >
                    {state.message}
                  </motion.div>
                )}

                {/* Tipe Transaksi */}
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest block">
                    Tipe Transaksi
                  </label>
                  <select
                    name="type"
                    required
                    defaultValue="INCOME"
                    className="w-full h-10 glass-input rounded-xl px-3.5 text-slate-300 text-xs outline-none transition-all cursor-pointer"
                  >
                    <option value="INCOME" className="bg-slate-950">Pemasukan (Income)</option>
                    <option value="EXPENSE" className="bg-slate-950">Pengeluaran (Expense)</option>
                  </select>
                </div>

                {/* Jumlah Uang */}
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest block">
                    Jumlah Uang (Rupiah)
                  </label>
                  <input
                    type="number"
                    name="amount"
                    required
                    min={1}
                    placeholder="e.g. 5000000"
                    className="w-full h-10 glass-input rounded-xl px-3.5 text-white text-xs outline-none transition-all placeholder:text-slate-650"
                  />
                </div>

                {/* Deskripsi */}
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest block">
                    Keterangan / Deskripsi
                  </label>
                  <input
                    type="text"
                    name="description"
                    required
                    placeholder="e.g. Pembayaran DP Client Alfa"
                    className="w-full h-10 glass-input rounded-xl px-3.5 text-white text-xs outline-none transition-all placeholder:text-slate-650"
                  />
                </div>

                {/* Tanggal */}
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest block">
                    Tanggal Transaksi (Opsional)
                  </label>
                  <input
                    type="date"
                    name="date"
                    defaultValue={new Date().toISOString().split("T")[0]}
                    className="w-full h-10 glass-input rounded-xl px-3.5 text-slate-300 text-xs outline-none transition-all cursor-pointer"
                  />
                </div>

                {/* Submit */}
                <motion.button
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  type="submit"
                  disabled={isPending}
                  className="w-full h-10 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-xl flex items-center justify-center text-xs transition-all shadow shadow-blue-500/10 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer group"
                >
                  {isPending ? (
                    <span className="inline-block h-3.5 w-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>
                      Simpan Transaksi
                      <ArrowRight className="h-3.5 w-3.5 ml-1.5 group-hover:translate-x-0.5 transition-transform" />
                    </>
                  )}
                </motion.button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
