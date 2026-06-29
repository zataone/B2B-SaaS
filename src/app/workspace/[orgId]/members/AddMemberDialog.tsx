"use client";

import React, { useState, useActionState, useEffect } from "react";
import { addMemberAction } from "@/app/actions/members";
import { Plus, X, ArrowRight, Mail } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface AddMemberDialogProps {
  orgId: string;
}

export default function AddMemberDialog({ orgId }: AddMemberDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [state, formAction, isPending] = useActionState(addMemberAction, null);

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
        className="h-10 px-4 bg-blue-600 hover:bg-blue-505 text-white text-xs font-semibold rounded-xl flex items-center gap-2 transition-all cursor-pointer shadow shadow-blue-500/10"
      >
        <Plus className="h-4 w-4" />
        Undang Anggota
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
                <h3 className="text-base font-bold text-white">Undang Anggota Baru</h3>
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

                {/* Error message */}
                {state && !state.success && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-red-500/10 border border-red-500/30 text-red-400 text-xs rounded-lg p-2.5 font-semibold"
                  >
                    {state.message}
                  </motion.div>
                )}

                {/* Email Address */}
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest block">
                    Email Pengguna
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                      <Mail className="h-4 w-4" />
                    </div>
                    <input
                      type="email"
                      name="email"
                      required
                      placeholder="user@company.com"
                      className="w-full h-10 glass-input rounded-xl py-2.5 pl-10 pr-4 text-white text-xs outline-none transition-all placeholder:text-slate-650"
                    />
                  </div>
                  <p className="text-[10px] text-slate-500 leading-normal font-semibold">
                    Masukkan email pengguna terdaftar untuk langsung dihubungkan ke organisasi ini.
                  </p>
                </div>

                {/* Role Select */}
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest block">
                    Peran (Role)
                  </label>
                  <select
                    name="role"
                    required
                    defaultValue="STAFF"
                    className="w-full h-10 glass-input rounded-xl px-3.5 text-slate-350 text-xs outline-none transition-all cursor-pointer"
                  >
                    <option value="STAFF" className="bg-slate-950">Staf (Hanya Melihat Proyek & Keuangan)</option>
                    <option value="MANAGER" className="bg-slate-950">Manajer (Dapat Mengelola Proyek & Keuangan)</option>
                    <option value="ADMIN" className="bg-slate-950">Admin (Akses Penuh Kelola Anggota & Pengaturan)</option>
                  </select>
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
                      Tambahkan ke Tim
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
