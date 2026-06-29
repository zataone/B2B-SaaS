"use client";

import React, { useActionState } from "react";
import { updateOrgNameAction } from "@/app/actions/org";
import { ArrowRight, Check } from "lucide-react";
import { motion } from "framer-motion";

interface SettingsFormProps {
  orgId: string;
  currentName: string;
}

export default function SettingsForm({ orgId, currentName }: SettingsFormProps) {
  const [state, formAction, isPending] = useActionState(updateOrgNameAction, null);

  return (
    <form action={formAction} className="space-y-5 font-sans">
      <input type="hidden" name="orgId" value={orgId} />

      {state && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className={`border text-xs rounded-xl p-3 flex items-center gap-2 font-semibold ${
            state.success
              ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-450"
              : "bg-red-500/10 border-red-500/20 text-red-400"
          }`}
        >
          {state.success && <Check className="h-4 w-4 shrink-0" />}
          <span>{state.message}</span>
        </motion.div>
      )}

      {/* Organization Name Input */}
      <div className="space-y-1.5">
        <label className="text-xs font-bold text-slate-400 uppercase tracking-widest block">
          Nama Organisasi / Perusahaan
        </label>
        <input
          type="text"
          name="name"
          required
          defaultValue={currentName}
          placeholder="e.g. Alfa Corp Baru"
          className="w-full h-10 glass-input rounded-xl px-3.5 text-white text-xs outline-none transition-all placeholder:text-slate-650"
        />
      </div>

      {/* Submit Button */}
      <motion.button
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.99 }}
        type="submit"
        disabled={isPending}
        className="h-10 px-6 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold rounded-xl flex items-center justify-center transition-all shadow shadow-blue-500/10 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer group"
      >
        {isPending ? (
          <span className="inline-block h-3.5 w-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
        ) : (
          <>
            Simpan Perubahan
            <ArrowRight className="h-3.5 w-3.5 ml-1.5 group-hover:translate-x-0.5 transition-transform" />
          </>
        )}
      </motion.button>
    </form>
  );
}
