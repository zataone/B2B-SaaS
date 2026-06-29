"use client";

import React, { useActionState } from "react";
import { createOrgAction } from "@/app/actions/org";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

export default function OrgCreationForm() {
  const [state, formAction, isPending] = useActionState(createOrgAction, null);

  return (
    <form action={formAction} className="space-y-4 font-sans">
      {state && !state.success && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-red-500/10 border border-red-500/30 text-red-400 text-xs rounded-lg p-2.5 font-medium"
        >
          {state.message}
        </motion.div>
      )}

      <div className="space-y-1.5">
        <input
          type="text"
          name="name"
          required
          placeholder="Nama Organisasi / Perusahaan"
          className="w-full h-10 glass-input rounded-xl px-3 text-white text-xs outline-none transition-all placeholder:text-slate-650"
        />
      </div>

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
            Buat & Masuk Workspace
            <ArrowRight className="h-3.5 w-3.5 ml-1.5 group-hover:translate-x-0.5 transition-transform" />
          </>
        )}
      </motion.button>
    </form>
  );
}
