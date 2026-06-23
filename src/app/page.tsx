import Link from "next/link";
import { ArrowRight, Activity, Shield, BarChart3, Database } from "lucide-react";

export default function Home() {
  return (
    <div className="relative min-h-screen bg-slate-950 overflow-hidden font-sans text-white">
      {/* Background gradients */}
      <div className="absolute top-0 left-0 w-full h-full">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-blue-900/20 blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-violet-900/20 blur-[120px]" />
      </div>

      {/* Header */}
      <header className="relative border-b border-slate-900/80 backdrop-blur-md z-10">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-9 w-9 rounded-lg bg-gradient-to-tr from-blue-600 to-violet-600 flex items-center justify-center shadow-md shadow-blue-500/10">
              <Activity className="h-5 w-5 text-white" />
            </div>
            <span className="font-bold text-xl tracking-tight bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">
              SaaS Workspace
            </span>
          </div>

          <div className="flex items-center gap-4">
            <Link
              href="/login"
              className="text-slate-300 hover:text-white text-sm font-medium transition-colors"
            >
              Masuk
            </Link>
            <Link
              href="/register"
              className="h-9 px-4 bg-gradient-to-r from-blue-600 to-violet-600 hover:from-blue-500 hover:to-violet-500 text-white text-sm font-medium rounded-lg flex items-center justify-center shadow-lg shadow-blue-500/20 transition-all"
            >
              Daftar Gratis
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="relative max-w-7xl mx-auto px-6 py-20 md:py-32 flex flex-col items-center text-center z-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-blue-500/30 bg-blue-500/10 text-blue-400 text-xs font-semibold uppercase tracking-wider mb-6 animate-pulse">
          ⚡ Multi-Tenant Enterprise Solution
        </div>

        <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight max-w-3xl leading-[1.15]">
          Kelola Proyek & Keuangan dalam{" "}
          <span className="bg-gradient-to-r from-blue-400 via-indigo-400 to-violet-400 bg-clip-text text-transparent">
            Satu Sistem Terisolasi
          </span>
        </h1>

        <p className="text-slate-400 text-lg md:text-xl max-w-2xl mt-6 leading-relaxed">
          Platform dashboard B2B SaaS dengan konsep *multi-tenant workspace* yang aman, cepat,
          dan dirancang untuk kolaborasi tim tingkat perusahaan.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 mt-10">
          <Link
            href="/register"
            className="h-12 px-6 bg-gradient-to-r from-blue-600 to-violet-600 hover:from-blue-500 hover:to-violet-500 text-white font-medium rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20 hover:shadow-blue-500/30 transition-all group"
          >
            Mulai Sekarang
            <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
          </Link>
          <Link
            href="/login"
            className="h-12 px-6 bg-slate-900 border border-slate-800 hover:bg-slate-850 hover:border-slate-700 text-slate-300 hover:text-white font-medium rounded-xl flex items-center justify-center transition-all"
          >
            Lihat Akun Demo
          </Link>
        </div>

        {/* Feature Highlights */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-24 w-full">
          {/* Card 1 */}
          <div className="bg-slate-900/40 border border-slate-900 rounded-2xl p-6 text-left backdrop-blur-sm">
            <div className="h-10 w-10 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-400 mb-4">
              <Shield className="h-5 w-5" />
            </div>
            <h3 className="text-lg font-semibold text-white">Data Terisolasi (Multi-Tenant)</h3>
            <p className="text-slate-400 text-sm mt-2 leading-relaxed">
              Setiap organisasi memiliki database virtual terisolasi yang aman, menjamin data antar
              perusahaan tidak akan pernah bercampur.
            </p>
          </div>

          {/* Card 2 */}
          <div className="bg-slate-900/40 border border-slate-900 rounded-2xl p-6 text-left backdrop-blur-sm">
            <div className="h-10 w-10 rounded-lg bg-indigo-500/10 flex items-center justify-center text-indigo-400 mb-4">
              <BarChart3 className="h-5 w-5" />
            </div>
            <h3 className="text-lg font-semibold text-white">Analitik Visual Interaktif</h3>
            <p className="text-slate-400 text-sm mt-2 leading-relaxed">
              Pantau arus keuangan perusahaan dan performa proyek dengan visualisasi grafik modern yang
              mudah dipahami dan interaktif.
            </p>
          </div>

          {/* Card 3 */}
          <div className="bg-slate-900/40 border border-slate-900 rounded-2xl p-6 text-left backdrop-blur-sm">
            <div className="h-10 w-10 rounded-lg bg-violet-500/10 flex items-center justify-center text-violet-400 mb-4">
              <Database className="h-5 w-5" />
            </div>
            <h3 className="text-lg font-semibold text-white">Akses Berbasis Peran (RBAC)</h3>
            <p className="text-slate-400 text-sm mt-2 leading-relaxed">
              Atur hak akses anggota tim Anda secara detail dengan tingkatan Admin, Manager, dan Staff
              untuk keamanan data internal.
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative border-t border-slate-900/80 mt-20 py-8 text-center text-xs text-slate-500 z-10">
        &copy; {new Date().getFullYear()} SaaS Workspace. Dibuat untuk Pair-Programming Next.js & TypeScript.
      </footer>
    </div>
  );
}
