"use client";

import React from "react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";

interface ChartData {
  month: string;
  pemasukan: number;
  pengeluaran: number;
}

interface DashboardChartsProps {
  data: ChartData[];
}

export default function DashboardCharts({ data }: DashboardChartsProps) {
  // Helper to format currency to Rupiah
  const formatRupiah = (val: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(val);
  };

  return (
    <div className="bg-slate-900/40 border border-slate-900 rounded-2xl p-6 font-sans backdrop-blur-sm">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
        <div>
          <h3 className="text-base font-semibold text-white">Laporan Keuangan Bulanan</h3>
          <p className="text-xs text-slate-400 mt-1">Grafik pemasukan vs pengeluaran organisasi</p>
        </div>

        {/* Legend Indicator */}
        <div className="flex items-center gap-4 text-xs font-medium">
          <div className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-blue-500 block" />
            <span className="text-slate-300">Pemasukan</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-violet-500 block" />
            <span className="text-slate-300">Pengeluaran</span>
          </div>
        </div>
      </div>

      <div className="h-80 w-full">
        {data.length === 0 ? (
          <div className="h-full w-full flex items-center justify-center text-slate-500 text-sm">
            Belum ada data keuangan untuk ditampilkan.
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
              <defs>
                <linearGradient id="colorPemasukan" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorPengeluaran" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
              <XAxis
                dataKey="month"
                stroke="#64748b"
                fontSize={11}
                tickLine={false}
                axisLine={false}
                dy={10}
              />
              <YAxis
                stroke="#64748b"
                fontSize={11}
                tickLine={false}
                axisLine={false}
                tickFormatter={(val) => `${(val / 1000000).toFixed(0)}M`}
                dx={-10}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#0f172a",
                  borderColor: "#334155",
                  borderRadius: "12px",
                  fontSize: "12px",
                  color: "#f8fafc",
                }}
                formatter={(val: any) => [formatRupiah(Number(val || 0)), ""]}
              />
              <Area
                type="monotone"
                dataKey="pemasukan"
                name="Pemasukan"
                stroke="#3b82f6"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#colorPemasukan)"
              />
              <Area
                type="monotone"
                dataKey="pengeluaran"
                name="Pengeluaran"
                stroke="#8b5cf6"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#colorPengeluaran)"
              />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}
