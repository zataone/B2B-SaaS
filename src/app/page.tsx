"use client";

import Link from "next/link";
import { ArrowRight, Activity, Shield, BarChart3, Database } from "lucide-react";
import { motion } from "framer-motion";

export default function Home() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring" as const, stiffness: 100, damping: 15 },
    },
  };

  const glowVariants = {
    animate: {
      scale: [1, 1.05, 0.95, 1],
      opacity: [0.15, 0.22, 0.15],
      transition: {
        duration: 8,
        repeat: Infinity,
        ease: "easeInOut" as const,
      },
    },
  };

  return (
    <div className="relative min-h-screen bg-slate-950 overflow-hidden font-sans text-white">
      {/* Background gradients */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden">
        <motion.div
          variants={glowVariants}
          animate="animate"
          className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] rounded-full bg-blue-600/15 blur-[130px]"
        />
        <motion.div
          variants={glowVariants}
          animate="animate"
          className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] rounded-full bg-violet-600/15 blur-[130px]"
        />
      </div>

      {/* Header */}
      <motion.header
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="relative border-b border-white/5 bg-slate-950/40 backdrop-blur-md z-10"
      >
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="h-9 w-9 rounded-lg bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center shadow-md shadow-blue-500/10">
              <Activity className="h-5 w-5 text-white" />
            </div>
            <span className="font-bold text-xl tracking-tight bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">
              SaaS Workspace
            </span>
          </div>

          <div className="flex items-center gap-4">
            <Link
              href="/login"
              className="text-slate-300 hover:text-white text-sm font-medium transition-colors cursor-pointer"
            >
              Masuk
            </Link>
            <Link
              href="/register"
              className="h-9 px-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-sm font-medium rounded-lg flex items-center justify-center shadow-lg shadow-blue-500/20 transition-all cursor-pointer"
            >
              Daftar Gratis
            </Link>
          </div>
        </div>
      </motion.header>

      {/* Hero Section */}
      <main className="relative max-w-7xl mx-auto px-6 py-20 md:py-32 flex flex-col items-center text-center z-10">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="flex flex-col items-center"
        >
          {/* Badge */}
          <motion.div
            variants={itemVariants}
            className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full border border-blue-500/20 bg-blue-500/5 text-blue-400 text-xs font-semibold uppercase tracking-wider mb-8"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-ping" />
            ⚡ Multi-Tenant Enterprise Solution
          </motion.div>

          {/* Heading */}
          <motion.h1
            variants={itemVariants}
            className="text-4xl md:text-6xl lg:text-7xl font-extrabold tracking-tight max-w-4xl leading-[1.1] text-white"
          >
            Kelola Proyek & Keuangan dalam{" "}
            <span className="bg-gradient-to-r from-blue-400 via-indigo-400 to-violet-400 bg-clip-text text-transparent">
              Satu Sistem Terisolasi
            </span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            variants={itemVariants}
            className="text-slate-400 text-lg md:text-xl max-w-2xl mt-6 leading-relaxed"
          >
            Platform dashboard B2B SaaS dengan konsep *multi-tenant workspace* yang aman, cepat,
            dan dirancang khusus untuk kolaborasi tim tingkat perusahaan.
          </motion.p>

          {/* Call to Actions */}
          <motion.div
            variants={itemVariants}
            className="flex flex-col sm:flex-row gap-4 mt-10 w-full sm:w-auto"
          >
            <Link
              href="/register"
              className="h-12 px-8 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-medium rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20 hover:shadow-blue-500/35 transition-all group cursor-pointer"
            >
              Mulai Sekarang
              <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              href="/login"
              className="h-12 px-8 bg-slate-900/60 border border-white/5 hover:border-white/10 hover:bg-slate-900 text-slate-300 hover:text-white font-medium rounded-xl flex items-center justify-center transition-all cursor-pointer backdrop-blur-sm"
            >
              Lihat Akun Demo
            </Link>
          </motion.div>

          {/* Feature Highlights Grid */}
          <motion.div
            variants={containerVariants}
            className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-28 w-full"
          >
            {/* Card 1 */}
            <motion.div
              variants={itemVariants}
              whileHover={{ y: -5, borderColor: "rgba(3, 105, 161, 0.3)" }}
              className="bg-slate-950/40 border border-white/5 rounded-2xl p-6.5 text-left backdrop-blur-md transition-colors cursor-pointer shadow-xl shadow-black/10"
            >
              <div className="h-10 w-10 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-400 mb-5 border border-blue-500/10">
                <Shield className="h-5 w-5" />
              </div>
              <h3 className="text-lg font-bold text-white">Data Terisolasi (Multi-Tenant)</h3>
              <p className="text-slate-400 text-sm mt-2.5 leading-relaxed">
                Setiap organisasi memiliki database virtual terisolasi yang aman, menjamin data antar
                perusahaan tidak akan pernah bercampur.
              </p>
            </motion.div>

            {/* Card 2 */}
            <motion.div
              variants={itemVariants}
              whileHover={{ y: -5, borderColor: "rgba(3, 105, 161, 0.3)" }}
              className="bg-slate-950/40 border border-white/5 rounded-2xl p-6.5 text-left backdrop-blur-md transition-colors cursor-pointer shadow-xl shadow-black/10"
            >
              <div className="h-10 w-10 rounded-lg bg-indigo-500/10 flex items-center justify-center text-indigo-400 mb-5 border border-indigo-500/10">
                <BarChart3 className="h-5 w-5" />
              </div>
              <h3 className="text-lg font-bold text-white">Analitik Visual Interaktif</h3>
              <p className="text-slate-400 text-sm mt-2.5 leading-relaxed">
                Pantau arus keuangan perusahaan dan performa proyek dengan visualisasi grafik modern yang
                mudah dipahami dan interaktif.
              </p>
            </motion.div>

            {/* Card 3 */}
            <motion.div
              variants={itemVariants}
              whileHover={{ y: -5, borderColor: "rgba(3, 105, 161, 0.3)" }}
              className="bg-slate-950/40 border border-white/5 rounded-2xl p-6.5 text-left backdrop-blur-md transition-colors cursor-pointer shadow-xl shadow-black/10"
            >
              <div className="h-10 w-10 rounded-lg bg-violet-500/10 flex items-center justify-center text-violet-400 mb-5 border border-violet-500/10">
                <Database className="h-5 w-5" />
              </div>
              <h3 className="text-lg font-bold text-white">Akses Berbasis Peran (RBAC)</h3>
              <p className="text-slate-400 text-sm mt-2.5 leading-relaxed">
                Atur hak akses anggota tim Anda secara detail dengan tingkatan Admin, Manager, dan Staff
                untuk keamanan data internal.
              </p>
            </motion.div>
          </motion.div>
        </motion.div>
      </main>

      {/* Footer */}
      <footer className="relative border-t border-white/5 mt-20 py-8 text-center text-xs text-slate-500 z-10 bg-slate-950/20 backdrop-blur-sm">
        &copy; {new Date().getFullYear()} SaaS Workspace. Dibuat untuk Pair-Programming Next.js & TypeScript.
      </footer>
    </div>
  );
}
