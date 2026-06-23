"use client";

import React, { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ChevronDown, Building, Check, Plus } from "lucide-react";

interface OrgSwitcherProps {
  currentOrgId: string;
  currentOrgName: string;
  organizations: {
    orgId: string;
    orgName: string;
    slug: string;
  }[];
}

export default function OrgSwitcher({
  currentOrgId,
  currentOrgName,
  organizations,
}: OrgSwitcherProps) {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelectOrg = (orgId: string) => {
    setIsOpen(false);
    router.push(`/workspace/${orgId}/dashboard`);
  };

  return (
    <div className="relative font-sans" ref={dropdownRef}>
      {/* Dropdown Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full h-11 bg-slate-900 border border-slate-800 hover:border-slate-700 text-white rounded-xl px-3.5 flex items-center justify-between transition-all cursor-pointer focus:outline-none focus:ring-1 focus:ring-blue-500"
      >
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="h-6 w-6 rounded bg-blue-600/10 flex items-center justify-center text-blue-400 shrink-0">
            <Building className="h-3.5 w-3.5" />
          </div>
          <span className="text-sm font-semibold truncate text-left">{currentOrgName}</span>
        </div>
        <ChevronDown className={`h-4 w-4 text-slate-400 transition-transform ${isOpen ? "rotate-180" : ""}`} />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute top-12 left-0 w-full bg-slate-900 border border-slate-800 rounded-xl py-2 mt-1.5 shadow-2xl z-50 animate-in fade-in slide-in-from-top-1 duration-100">
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider px-3.5 py-1 block">
            Workspace Anda
          </span>
          <div className="max-h-48 overflow-y-auto px-1 mt-1 space-y-0.5">
            {organizations.map((org) => {
              const isSelected = org.orgId === currentOrgId;
              return (
                <button
                  key={org.orgId}
                  onClick={() => handleSelectOrg(org.orgId)}
                  className={`w-full h-9 rounded-lg px-2.5 flex items-center justify-between text-left text-xs transition-colors cursor-pointer ${
                    isSelected
                      ? "bg-blue-600 text-white font-medium"
                      : "text-slate-300 hover:bg-slate-850 hover:text-white"
                  }`}
                >
                  <span className="truncate pr-2">{org.orgName}</span>
                  {isSelected && <Check className="h-3.5 w-3.5 shrink-0" />}
                </button>
              );
            })}
          </div>
          <div className="border-t border-slate-800/80 mt-2 pt-2 px-1">
            <button
              onClick={() => router.push("/workspace/select")}
              className="w-full h-8 rounded-lg px-2.5 flex items-center gap-2 text-left text-xs text-blue-400 hover:bg-slate-850 hover:text-blue-300 transition-colors cursor-pointer"
            >
              <Plus className="h-3.5 w-3.5" />
              <span>Buat Organisasi Baru</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
