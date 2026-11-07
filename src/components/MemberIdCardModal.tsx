import React, { useRef } from 'react';
import { X, Printer, Download, ShieldCheck, Heart, Phone, MapPin, CheckCircle } from 'lucide-react';
import { Member } from '../types/club';
import { CLUB_INFO } from '../data/initialData';

interface MemberIdCardModalProps {
  member: Member | null;
  onClose: () => void;
}

export const MemberIdCardModal: React.FC<MemberIdCardModalProps> = ({ member, onClose }) => {
  const cardRef = useRef<HTMLDivElement>(null);

  if (!member) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl border border-slate-200 dark:border-slate-800 flex flex-col">
        {/* Modal Top Bar */}
        <div className="px-6 py-3.5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-800/60">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-600" />
            <h3 className="font-bold text-sm text-slate-800 dark:text-slate-100">
              ডিজিটাল সদস্য পরিচয়পত্র (Club ID Card)
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* ID Card Graphic Container */}
        <div className="p-6 flex flex-col items-center justify-center bg-slate-100 dark:bg-slate-950">
          <div
            ref={cardRef}
            className="w-full max-w-sm rounded-2xl overflow-hidden bg-gradient-to-br from-emerald-900 via-emerald-800 to-teal-950 text-white shadow-xl border-2 border-amber-400/30 relative"
          >
            {/* Background watermark motif */}
            <div className="absolute right-0 bottom-0 opacity-10 pointer-events-none transform translate-x-10 translate-y-10">
              <img src={CLUB_INFO.logo} alt="watermark" className="w-64 h-64 object-contain filter invert" />
            </div>

            {/* Header of Card */}
            <div className="px-5 pt-5 pb-3 border-b border-emerald-700/60 flex items-center gap-3">
              <img
                src={CLUB_INFO.logo}
                alt="Club Emblem"
                className="w-12 h-12 rounded-full border border-amber-400/60 shadow-sm shrink-0"
              />
              <div className="flex-1 min-w-0">
                <h4 className="text-base font-extrabold tracking-wide text-amber-300 leading-tight">
                  {CLUB_INFO.nameBn}
                </h4>
                <p className="text-[11px] font-medium text-emerald-200 tracking-wider">
                  {CLUB_INFO.nameEn.toUpperCase()}
                </p>
                <div className="flex items-center gap-2 text-[10px] text-emerald-300 mt-0.5">
                  <span>স্থাপিত: {CLUB_INFO.established}</span>
                  <span>·</span>
                  <span>রেজি: {CLUB_INFO.registrationNo}</span>
                </div>
              </div>
            </div>

            {/* Member Details Section */}
            <div className="p-5 flex flex-col gap-4">
              <div className="flex items-start gap-4">
                {/* Photo with frame */}
                <div className="relative shrink-0">
                  <div className="w-20 h-24 rounded-xl overflow-hidden border-2 border-amber-400 shadow-md bg-emerald-950">
                    <img
                      src={member.avatar}
                      alt={member.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="absolute -bottom-2 -right-1 bg-red-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded shadow">
                    {member.bloodGroup}
                  </div>
                </div>

                {/* Name & ID */}
                <div className="flex-1 min-w-0">
                  <span className="text-[10px] uppercase font-bold tracking-wider text-emerald-300 bg-emerald-950/60 px-2 py-0.5 rounded">
                    {member.role.split('(')[0].trim()}
                  </span>
                  <h3 className="text-lg font-bold text-white mt-1 leading-snug truncate">
                    {member.name}
                  </h3>
                  <p className="text-xs text-emerald-200 truncate font-medium">
                    {member.nameEn}
                  </p>
                  <p className="text-[11px] text-amber-300/90 font-mono mt-1 font-semibold">
                    ID: {member.id}
                  </p>
                </div>
              </div>

              {/* Contact & Meta rows */}
              <div className="bg-emerald-950/50 rounded-xl p-3 text-xs space-y-1.5 border border-emerald-700/40">
                <div className="flex items-center gap-2 text-emerald-200">
                  <Phone className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span className="truncate">{member.phone}</span>
                </div>
                <div className="flex items-center gap-2 text-emerald-200">
                  <MapPin className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span className="truncate">{member.address}</span>
                </div>
                <div className="flex items-center justify-between pt-1 border-t border-emerald-800/60 text-[11px]">
                  <span className="text-emerald-300">যোগদানের তারিখ:</span>
                  <span className="font-semibold text-white">{member.joinDate}</span>
                </div>
              </div>

              {/* Signatures & Barcode */}
              <div className="flex items-end justify-between pt-2">
                <div>
                  {/* Simulated barcode */}
                  <div className="h-6 w-24 bg-white/90 rounded px-1 flex items-center justify-between">
                    <div className="h-4 w-1 bg-black"></div>
                    <div className="h-4 w-0.5 bg-black"></div>
                    <div className="h-4 w-2 bg-black"></div>
                    <div className="h-4 w-0.5 bg-black"></div>
                    <div className="h-4 w-1.5 bg-black"></div>
                    <div className="h-4 w-0.5 bg-black"></div>
                    <div className="h-4 w-2 bg-black"></div>
                    <div className="h-4 w-1 bg-black"></div>
                  </div>
                  <p className="text-[9px] text-emerald-300 mt-1">কার্ড স্ট্যাটাস: সক্রিয়</p>
                </div>

                <div className="text-right">
                  <div className="text-[11px] font-cursive italic text-amber-200 font-semibold border-b border-emerald-500/60 pb-0.5">
                    অনির্বাণ চক্রবর্তী
                  </div>
                  <p className="text-[9px] text-emerald-300 mt-0.5">সাধারণ সম্পাদকের স্বাক্ষর</p>
                </div>
              </div>
            </div>

            {/* Footer strip */}
            <div className="px-5 py-2 bg-emerald-950 text-center text-[10px] text-emerald-400 border-t border-emerald-800/60">
              {CLUB_INFO.motto}
            </div>
          </div>
        </div>

        {/* Action Controls */}
        <div className="p-4 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <CheckCircle className="w-4 h-4 text-emerald-600" />
            <span>অফিসিয়াল ক্লাব ভেরিফাইড কার্ড</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors flex items-center gap-1.5"
            >
              <Printer className="w-3.5 h-3.5" />
              প্রিন্ট করুন
            </button>
            <button
              onClick={() => {
                alert('আইডি কার্ড ডাউনলোড রেডি হয়েছে!');
              }}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-white bg-emerald-700 hover:bg-emerald-800 transition-colors flex items-center gap-1.5"
            >
              <Download className="w-3.5 h-3.5" />
              কার্ড ডাউনলোড
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
