"use client";

import React, { useState, useActionState, useEffect } from "react";
import { createProjectAction } from "@/app/actions/project";
import { Plus, X, ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface AddProjectDialogProps {
  orgId: string;
}

export default function AddProjectDialog({ orgId }: AddProjectDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [state, formAction, isPending] = useActionState(createProjectAction, null);

  // Close dialog on successful submission
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
        Tambah Proyek
      </motion.button>

      {/* Modal Dialog */}
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center">
            {/* Overlay background */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm transition-all"
            />

            {/* Modal Content */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              transition={{ type: "spring", duration: 0.3 }}
              className="relative glass-panel rounded-2xl w-full max-w-md p-6 shadow-2xl z-10 overflow-hidden"
            >
              {/* Header */}
              <div className="flex items-center justify-between mb-5">
                <h3 className="text-base font-bold text-white">Tambah Proyek Baru</h3>
                <button
                  onClick={() => setIsOpen(false)}
                  className="h-7 w-7 rounded-lg hover:bg-white/5 text-slate-400 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              {/* Form */}
              <form action={formAction} className="space-y-4">
                {/* Hidden Fields */}
                <input type="hidden" name="orgId" value={orgId} />

                {/* Error Message */}
                {state && !state.success && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-red-500/10 border border-red-500/30 text-red-400 text-xs rounded-lg p-2.5 font-semibold"
                  >
                    {state.message}
                  </motion.div>
                )}

                {/* Project Name */}
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest block">
                    Nama Proyek
                  </label>
                  <input
                    type="text"
                    name="name"
                    required
                    placeholder="e.g. Website Company Profile"
                    className="w-full h-10 glass-input rounded-xl px-3.5 text-white text-xs outline-none transition-all placeholder:text-slate-650"
                  />
                </div>

                {/* Project Description */}
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest block">
                    Deskripsi Proyek (Opsional)
                  </label>
                  <textarea
                    name="description"
                    rows={3}
                    placeholder="Detail singkat tentang lingkup pekerjaan proyek..."
                    className="w-full glass-input rounded-xl p-3 text-white text-xs outline-none transition-all placeholder:text-slate-655 resize-none"
                  />
                </div>

                {/* Project Status */}
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest block">
                    Status Awal
                  </label>
                  <select
                    name="status"
                    required
                    defaultValue="PLANNING"
                    className="w-full h-10 glass-input rounded-xl px-3.5 text-slate-350 text-xs outline-none transition-all cursor-pointer"
                  >
                    <option value="PLANNING" className="bg-slate-950">Perencanaan (Planning)</option>
                    <option value="IN_PROGRESS" className="bg-slate-950">Sedang Berjalan (In Progress)</option>
                    <option value="COMPLETED" className="bg-slate-950">Selesai (Completed)</option>
                    <option value="ON_HOLD" className="bg-slate-950">Ditunda (On Hold)</option>
                  </select>
                </div>

                {/* Submit button */}
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
                      Simpan Proyek
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
