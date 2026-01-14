
import React, { useState, useMemo, useEffect } from 'react';
import { 
  Calendar, 
  Users, 
  Info, 
  RefreshCcw, 
  Printer, 
  ChevronLeft, 
  ChevronRight,
  ShieldCheck,
  Award,
  Settings2,
  FileSpreadsheet,
  Moon,
  AlertCircle,
  Sun,
  LayoutGrid,
  CalendarCheck2,
  Venus,
  Mars,
  CheckCircle2,
  Download
} from 'lucide-react';
import { DailySchedule, Gender } from './types';
import { FEMALE_PERSONNEL, MALE_PERSONNEL, HOLIDAYS_2026 } from './constants';
import { generateMonthSchedule, generateYearlyRedDateStats, isRedDate } from './utils/scheduler';

const MONTHS = [
  "Januari", "Februari", "Maret", "April", "Mei", "Juni",
  "Juli", "Agustus", "September", "Oktober", "November", "Desember"
];

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'monthly' | 'yearly'>('monthly');
  const [currentDate, setCurrentDate] = useState(new Date(2026, 0, 1));
  const [schedule, setSchedule] = useState<DailySchedule[]>([]);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const handleGenerate = () => {
    const newSchedule = generateMonthSchedule(year, month);
    setSchedule(newSchedule);
  };

  useEffect(() => {
    handleGenerate();
  }, [currentDate]);

  const yearlyRedDateStats = useMemo(() => {
    return generateYearlyRedDateStats(year);
  }, [year]);

  const handleMonthChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newMonth = parseInt(e.target.value);
    setCurrentDate(new Date(year, newMonth, 1));
  };

  const handleYearChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newYear = parseInt(e.target.value);
    if (!isNaN(newYear)) {
      setCurrentDate(new Date(newYear, month, 1));
    }
  };

  const getShortName = (fullName: string) => {
    return fullName
      .replace(/^(Letda|Lettu|Serka|Serma|Mayor|Serda)\sBakamla\s/, '')
      .split(' ')[0]
      .replace(/,$/, '');
  };

  const exportToCSV = () => {
    const headers = ["Tanggal", "Hari", "Divisi 1 (Wanita)", "Divisi 2 (Pria)", "Divisi 3 (Pria)", "Turun Jaga"];
    const rows = schedule.map(day => {
      const dayName = day.date.toLocaleString('id-ID', { weekday: 'long' });
      return [
        day.date.getDate(),
        dayName,
        day.assignment.div1,
        day.assignment.div2,
        day.assignment.div3,
        day.assignment.offPersonnel.join("; ")
      ];
    });

    let csvContent = "data:text/csv;charset=utf-8," 
      + headers.join(",") + "\n"
      + rows.map(e => e.join(",")).join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `Jadwal_Bakamla_${MONTHS[month]}_${year}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const statsSummary = useMemo(() => {
    const counts: Record<string, { total: number, d2: number, d3: number }> = {};
    [...FEMALE_PERSONNEL, ...MALE_PERSONNEL].forEach(p => counts[p.name] = { total: 0, d2: 0, d3: 0 });
    
    schedule.forEach(day => {
      if (counts[day.assignment.div1]) counts[day.assignment.div1].total++;
      if (counts[day.assignment.div2]) {
        counts[day.assignment.div2].total++;
        counts[day.assignment.div2].d2++;
      }
      if (counts[day.assignment.div3]) {
        counts[day.assignment.div3].total++;
        counts[day.assignment.div3].d3++;
      }
    });
    return counts;
  }, [schedule]);

  return (
    <div className="min-h-screen pb-20 bg-slate-50">
      <header className="bg-slate-900 text-white p-6 shadow-xl no-print text-center sm:text-left sticky top-0 z-50">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="flex items-center gap-3 justify-center sm:justify-start">
            <div className="p-2 bg-blue-600 rounded-lg shadow-lg shadow-blue-500/20">
              <ShieldCheck className="w-8 h-8" />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight">Contact Center Bakamla</h1>
              <p className="text-slate-400 text-sm font-medium">Sistem Penjadwalan Otomatis Satuan Kerja</p>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4 bg-slate-800/50 p-3 rounded-2xl border border-white/5 backdrop-blur-md">
            <div className="flex bg-slate-900/50 p-1 rounded-xl mr-2">
              <button 
                onClick={() => setActiveTab('monthly')}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all ${activeTab === 'monthly' ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-400 hover:text-white'}`}
              >
                <LayoutGrid className="w-4 h-4" /> Bulanan
              </button>
              <button 
                onClick={() => setActiveTab('yearly')}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all ${activeTab === 'yearly' ? 'bg-red-600 text-white shadow-lg' : 'text-slate-400 hover:text-white'}`}
              >
                <CalendarCheck2 className="w-4 h-4" /> Rekap Merah
              </button>
            </div>

            <div className="flex items-center gap-2">
              <button 
                onClick={() => setCurrentDate(new Date(year, month - 1))}
                className="p-2 hover:bg-slate-700 rounded-lg transition-colors text-slate-400 hover:text-white"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              
              <div className="flex gap-2">
                {activeTab === 'monthly' && (
                  <select 
                    value={month}
                    onChange={handleMonthChange}
                    className="bg-slate-700 text-white text-sm font-semibold py-2 px-3 rounded-xl border-none focus:ring-2 focus:ring-blue-500 cursor-pointer outline-none transition-all shadow-inner"
                  >
                    {MONTHS.map((m, i) => (
                      <option key={m} value={i}>{m}</option>
                    ))}
                  </select>
                )}
                
                <input 
                  type="number"
                  value={year}
                  onChange={handleYearChange}
                  className="bg-slate-700 text-white text-sm font-semibold py-2 px-3 rounded-xl border-none focus:ring-2 focus:ring-blue-500 w-24 outline-none transition-all shadow-inner"
                />
              </div>

              <button 
                onClick={() => setCurrentDate(new Date(year, month + 1))}
                className="p-2 hover:bg-slate-700 rounded-lg transition-colors text-slate-400 hover:text-white"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8 space-y-8">
        {activeTab === 'monthly' ? (
          <>
            <section className="grid grid-cols-1 md:grid-cols-4 gap-4 no-print">
              <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
                <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center text-blue-600">
                  <Calendar className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest leading-none mb-1">Periode</p>
                  <p className="font-bold text-lg text-slate-800">{MONTHS[month]} {year}</p>
                </div>
              </div>
              <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
                <div className="w-12 h-12 bg-emerald-50 rounded-full flex items-center justify-center text-emerald-600">
                  <Users className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest leading-none mb-1">Anggota</p>
                  <p className="font-bold text-lg text-slate-800">{FEMALE_PERSONNEL.length + MALE_PERSONNEL.length}</p>
                </div>
              </div>
              <div className="flex items-center gap-2 md:col-span-2">
                <button 
                  onClick={handleGenerate}
                  className="flex-1 bg-slate-900 hover:bg-slate-800 text-white font-semibold py-4 px-6 rounded-2xl flex items-center justify-center gap-2 transition-all shadow-lg"
                >
                  <RefreshCcw className="w-5 h-5" /> Acak Ulang
                </button>
                <button 
                  onClick={exportToCSV}
                  title="Download CSV"
                  className="bg-emerald-600 hover:bg-emerald-700 text-white p-4 rounded-2xl transition-all shadow-lg flex items-center justify-center"
                >
                  <FileSpreadsheet className="w-6 h-6" />
                </button>
                <button 
                  onClick={() => window.print()}
                  title="Cetak PDF"
                  className="bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 p-4 rounded-2xl transition-all shadow-sm"
                >
                  <Printer className="w-6 h-6" />
                </button>
              </div>
            </section>

            <section className="bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden">
              <div className="p-6 border-b border-slate-100 flex flex-col md:flex-row justify-between items-center bg-slate-50/50 gap-4">
                <h2 className="text-xl font-bold flex items-center gap-2 text-slate-800">
                  <Settings2 className="w-5 h-5 text-blue-600" />
                  Jadwal Harian CC Bakamla {year}
                </h2>
                <div className="flex flex-wrap gap-3 text-[10px] font-bold text-slate-500 no-print uppercase tracking-wider">
                  <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-full border border-slate-200 shadow-sm">
                    <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></span> Div 1
                  </div>
                  <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-full border border-slate-200 shadow-sm">
                    <span className="w-2 h-2 rounded-full bg-emerald-500"></span> Div 2
                  </div>
                  <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-full border border-slate-200 shadow-sm">
                    <span className="w-2 h-2 rounded-full bg-amber-500"></span> Div 3
                  </div>
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-900 text-white">
                      <th className="py-4 px-6 font-bold text-[10px] uppercase tracking-widest w-32 text-center">Tgl / Hari</th>
                      <th className="py-4 px-6 font-bold text-[10px] uppercase tracking-widest text-blue-400 border-l border-white/5">Divisi 1 (Pagi)</th>
                      <th className="py-4 px-6 font-bold text-[10px] uppercase tracking-widest text-emerald-400 border-l border-white/5">Divisi 2 (Sore)</th>
                      <th className="py-4 px-6 font-bold text-[10px] uppercase tracking-widest text-amber-400 border-l border-white/5">Divisi 3 (Malam)</th>
                      <th className="py-4 px-6 font-bold text-[10px] uppercase tracking-widest no-print border-l border-white/5">Turun Jaga</th>
                    </tr>
                  </thead>
                  <tbody>
                    {schedule.map((day, idx) => {
                      const isRed = isRedDate(day.date);
                      const dayName = day.date.toLocaleString('id-ID', { weekday: 'long' });
                      return (
                        <tr key={idx} className={`border-b border-slate-100 transition-colors ${isRed ? 'bg-red-50/40' : 'even:bg-slate-50/30'} hover:bg-blue-50/40`}>
                          <td className="py-4 px-6 text-center border-r border-slate-100">
                            <div className={`font-black text-xl leading-none mb-1 ${isRed ? 'text-red-600' : 'text-slate-800'}`}>{day.date.getDate()}</div>
                            <div className={`text-[9px] font-black uppercase tracking-tighter ${isRed ? 'text-red-500' : 'text-slate-400'}`}>{dayName}</div>
                          </td>
                          <td className="py-4 px-6">
                            <div className="bg-blue-50 text-blue-800 px-3 py-2 rounded-xl text-xs font-bold border border-blue-100 shadow-sm truncate">
                              {day.assignment.div1}
                            </div>
                          </td>
                          <td className="py-4 px-6">
                            <div className="bg-emerald-50 text-emerald-800 px-3 py-2 rounded-xl text-xs font-bold border border-emerald-100 shadow-sm truncate">
                              {day.assignment.div2}
                            </div>
                          </td>
                          <td className="py-4 px-6">
                            <div className="bg-amber-50 text-amber-900 px-3 py-2 rounded-xl text-xs font-bold border border-amber-100 shadow-sm truncate">
                              {day.assignment.div3}
                            </div>
                          </td>
                          <td className="py-4 px-6 no-print">
                            <div className="flex flex-wrap gap-1">
                              {day.assignment.offPersonnel.map((name, pIdx) => (
                                <span key={pIdx} className="bg-white text-slate-500 px-2 py-1 rounded-lg text-[9px] font-black tracking-tight border border-slate-200">
                                  {getShortName(name)}
                                </span>
                              ))}
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </section>
          </>
        ) : (
          <div className="space-y-8 animate-in fade-in duration-500">
            {/* Rekap Tahunan Pria */}
            <section className="bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden">
              <div className="p-6 border-b border-slate-100 flex flex-col md:flex-row justify-between items-center bg-blue-50/30 gap-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-100 text-blue-600 rounded-lg">
                    <Mars className="w-6 h-6" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-slate-800">Keadilan Jaga Merah Tahunan {year} (Pria)</h2>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Optimasi Distribusi Weekend & Libur Nasional</p>
                  </div>
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse min-w-[1000px]">
                  <thead>
                    <tr className="bg-slate-900 text-white">
                      <th className="py-4 px-6 font-bold text-[10px] uppercase tracking-widest sticky left-0 bg-slate-900 z-10 shadow-md">Nama Personel</th>
                      {MONTHS.map(m => (
                        <th key={m} className="py-4 px-2 font-bold text-[10px] uppercase tracking-widest text-center border-l border-white/5">{m.substring(0, 3)}</th>
                      ))}
                      <th className="py-4 px-6 font-bold text-[10px] uppercase tracking-widest text-center bg-blue-600 border-l border-white/5">TOTAL</th>
                    </tr>
                  </thead>
                  <tbody>
                    {MALE_PERSONNEL.map((p) => {
                      const monthsData = yearlyRedDateStats[p.name] || new Array(12).fill(0);
                      const totalRed = monthsData.reduce((a, b) => a + b, 0);
                      const isHighRank = p.name.startsWith('Mayor') || p.name.startsWith('Lettu');
                      const isGiffari = p.name.includes('Giffari');
                      
                      return (
                        <tr key={p.id} className="border-b border-slate-100 hover:bg-blue-50 transition-colors">
                          <td className="py-3 px-6 font-bold text-xs text-slate-700 sticky left-0 bg-white group-hover:bg-blue-50 z-10 shadow-sm">
                            <div className="flex items-center gap-2">
                              {p.name}
                              {isHighRank && <span className="bg-amber-50 text-amber-600 border border-amber-200 text-[8px] px-1.5 py-0.5 rounded-md font-black">LMT 3x</span>}
                              {isGiffari && <span className="bg-red-50 text-red-600 border border-red-200 text-[8px] px-1.5 py-0.5 rounded-md font-black">LMT 2x</span>}
                            </div>
                          </td>
                          {monthsData.map((val, mIdx) => (
                            <td key={mIdx} className="py-3 px-2 text-center border-l border-slate-50">
                              <span className={`inline-block px-2 py-1 rounded text-[10px] font-black ${val > 0 ? 'bg-blue-50 text-blue-700' : 'text-slate-200'}`}>
                                {val || '-'}
                              </span>
                            </td>
                          ))}
                          <td className="py-3 px-6 text-center border-l border-slate-50 bg-blue-50/50">
                            <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-[10px] font-black">
                              {totalRed}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </section>

            {/* Rekap Tahunan Wanita */}
            <section className="bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden opacity-90">
              <div className="p-6 border-b border-slate-100 flex items-center bg-pink-50/30 gap-4">
                <div className="p-2 bg-pink-100 text-pink-600 rounded-lg"><Venus className="w-6 h-6" /></div>
                <h2 className="text-xl font-bold text-slate-800">Keadilan Jaga Merah Tahunan {year} (Wanita)</h2>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse min-w-[1000px]">
                  <thead>
                    <tr className="bg-slate-900 text-white">
                      <th className="py-4 px-6 font-bold text-[10px] uppercase tracking-widest sticky left-0 bg-slate-900 z-10 shadow-md">Nama Personel</th>
                      {MONTHS.map(m => (
                        <th key={m} className="py-4 px-2 font-bold text-[10px] uppercase tracking-widest text-center border-l border-white/5">{m.substring(0, 3)}</th>
                      ))}
                      <th className="py-4 px-6 font-bold text-[10px] uppercase tracking-widest text-center bg-pink-600 border-l border-white/5">TOTAL</th>
                    </tr>
                  </thead>
                  <tbody>
                    {FEMALE_PERSONNEL.map((p) => {
                      const monthsData = yearlyRedDateStats[p.name] || new Array(12).fill(0);
                      const totalRed = monthsData.reduce((a, b) => a + b, 0);
                      return (
                        <tr key={p.id} className="border-b border-slate-100 hover:bg-pink-50 transition-colors">
                          <td className="py-3 px-6 font-bold text-xs text-slate-700 sticky left-0 bg-white group-hover:bg-pink-50 z-10 shadow-sm">{p.name}</td>
                          {monthsData.map((val, mIdx) => (
                            <td key={mIdx} className="py-3 px-2 text-center border-l border-slate-50">
                              <span className={`inline-block px-2 py-1 rounded text-[10px] font-black ${val > 0 ? 'bg-pink-50 text-pink-700' : 'text-slate-200'}`}>
                                {val || '-'}
                              </span>
                            </td>
                          ))}
                          <td className="py-3 px-6 text-center border-l border-slate-50 bg-pink-50/50">
                            <span className="bg-pink-600 text-white px-3 py-1 rounded-full text-[10px] font-black">
                              {totalRed}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </section>
          </div>
        )}

        <section className="bg-slate-900 text-white rounded-3xl p-8 shadow-xl relative overflow-hidden no-print">
          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full -mr-32 -mt-32 blur-3xl"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div>
              <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                <Info className="w-6 h-6 text-blue-400" />
                Parameter Sistem 2026
              </h3>
              <div className="space-y-4">
                <div className="flex gap-4 p-4 bg-white/5 rounded-2xl border border-white/10 transition-all hover:bg-white/10">
                  <div className="w-10 h-10 bg-blue-500/20 rounded-xl flex items-center justify-center text-blue-400 shrink-0">
                    <Award className="w-5 h-5" />
                  </div>
                  <p className="text-sm text-slate-300">
                    <b>Turun Jaga:</b> Libur 1 hari setelah dinas sore/malam. Khusus Sabtu libur Selasa, Minggu libur Senin.
                  </p>
                </div>
              </div>
            </div>
            <div className="bg-white/5 p-6 rounded-2xl border border-white/10">
              <h4 className="text-xs font-black uppercase tracking-widest text-blue-400 mb-6 flex items-center gap-2">
                <AlertCircle className="w-4 h-4" /> Batasan Penugasan
              </h4>
              <ul className="space-y-4 text-sm text-slate-300">
                <li>• <b>Mayor & Lettu:</b> Max 3x per bulan.</li>
                <li>• <b>Giffari Said:</b> Max 2x per bulan (Prioritas Sabtu).</li>
                <li>• <b>Fairness:</b> Keadilan dihitung akumulatif per tahun.</li>
              </ul>
            </div>
          </div>
        </section>
      </main>

      <footer className="fixed bottom-0 w-full bg-white/95 backdrop-blur-md border-t border-slate-200 p-4 no-print z-50">
        <div className="max-w-7xl mx-auto flex justify-between items-center px-4 text-[10px] text-slate-400 font-bold uppercase tracking-widest">
          <p>© 2026 Bakamla RI - Satuan Contact Center</p>
          <div className="flex gap-4">
             <span className="bg-blue-100 px-3 py-1 rounded-full text-blue-600">Ver. 4.1 (Deployment Ready)</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
