"use client";

import React, { useActionState } from "react";
import { createOrgAction } from "@/app/actions/org";
import { ArrowRight } from "lucide-react";

export default function OrgCreationForm() {
  const [state, formAction, isPending] = useActionState(createOrgAction, null);

  return (
    <form action={formAction} className="space-y-4 font-sans">
      {state && !state.success && (
        <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-xs rounded-lg p-2.5">
          {state.message}
        </div>
      )}

      <div className="space-y-1.5">
        <input
          type="text"
          name="name"
          required
          placeholder="Nama Organisasi / Perusahaan"
          className="w-full h-10 bg-slate-950 border border-slate-800 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 rounded-xl px-3 text-white text-xs outline-none transition-all placeholder:text-slate-600"
        />
      </div>

      <button
        type="submit"
        disabled={isPending}
        className="w-full h-10 bg-blue-600 hover:bg-blue-500 text-white font-medium rounded-xl flex items-center justify-center text-xs transition-all shadow shadow-blue-500/10 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer group"
      >
        {isPending ? (
          <span className="inline-block h-3.5 w-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
        ) : (
          <>
            Buat & Masuk Workspace
            <ArrowRight className="h-3.5 w-3.5 ml-1.5 group-hover:translate-x-0.5 transition-transform" />
          </>
        )}
      </button>
    </form>
  );
}
