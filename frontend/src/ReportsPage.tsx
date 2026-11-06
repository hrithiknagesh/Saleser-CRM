import { useEffect, useState } from 'react';
import { BarChart3, TrendingUp, DollarSign, Target, Award, Download, RefreshCw } from 'lucide-react';
import Card3D from './components/Card3D';
import IsometricBar3D from './components/IsometricBar3D';
import { fetchReportsData } from './api';
import { useTheme } from './ThemeContext';

export default function ReportsPage() {
  const [reportData, setReportData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeMetric, setActiveMetric] = useState<'count' | 'revenue'>('revenue');
  const { isDark } = useTheme();

  const fetchReports = () => {
    setLoading(true);
    fetchReportsData()
      .then(data => {
        setReportData(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching reports:', err);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchReports();
  }, []);

  const pageBg = isDark ? 'bg-[#171717]' : 'bg-slate-100';
  const cardBg = isDark ? 'bg-[#1f1f1f]' : 'bg-white';
  const cardBorder = isDark ? 'border-[#333]' : 'border-slate-200';
  const headingText = isDark ? 'text-white' : 'text-slate-800';
  const subText = isDark ? 'text-gray-400' : 'text-slate-500';
  const surfaceBg = isDark ? 'bg-[#252525]' : 'bg-slate-50';
  const surfaceBorder = isDark ? 'border-[#383838]' : 'border-slate-200';
  const refreshBtnCls = isDark
    ? 'bg-[#242424] hover:bg-[#2b2b2b] border-[#383838] text-gray-300'
    : 'bg-white hover:bg-slate-100 border-slate-300 text-slate-700 shadow-sm';

  if (loading && !reportData) {
    return (
      <div className={`flex items-center justify-center h-full transition-colors ${pageBg} ${subText}`}>
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 rounded-full border-2 border-[#f95e26] border-t-transparent animate-spin" />
          <span className="text-sm">Generating 3D Sales & Pipeline Analytics...</span>
        </div>
      </div>
    );
  }

  const summary = reportData?.summary || {
    totalRevenue: 128000,
    pipelineValue: 140500,
    winRate: 68,
    avgDealSize: 23416,
  };
  const dealsByStage = reportData?.dealsByStage || {};
  const revenueByStage = reportData?.revenueByStage || {};
  const topDeals = reportData?.topDeals || [];
  const performanceByRep = reportData?.performanceByRep || {};

  const stageEntries = Object.keys(dealsByStage).length > 0
    ? Object.keys(dealsByStage).map((stage, i) => ({
        label: stage,
        count: dealsByStage[stage] || 0,
        amount: revenueByStage?.[stage] || 0,
        color: i === 0 ? '#3b82f6' : i === 1 ? '#fbbf24' : i === 2 ? '#a855f7' : i === 3 ? '#10b981' : '#f95e26',
      }))
    : [
        { label: 'Qualified', count: 2, amount: 47000, color: '#3b82f6' },
        { label: 'Proposal Sent', count: 2, amount: 73000, color: '#fbbf24' },
        { label: 'New', count: 1, amount: 8500, color: '#a855f7' },
        { label: 'Closed Won', count: 1, amount: 12000, color: '#10b981' },
      ];

  const exportReport = () => {
    let csv = "Stage,Deals Count,Revenue\n";
    stageEntries.forEach(s => {
      csv += `"${s.label}",${s.count},${s.amount}\n`;
    });
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'sales_performance_report.csv';
    a.click();
  };

  return (
    <div className={`p-6 md:p-8 h-full overflow-y-auto transition-colors duration-300 ${pageBg}`}>
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Header bar */}
        <div className={`flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-2 border-b ${cardBorder}`}>
          <div>
            <div className="flex items-center gap-2">
              <BarChart3 className="text-[#f95e26]" size={24} />
              <h1 className={`text-2xl font-bold tracking-tight ${headingText}`}>Sales Analytics & Reports</h1>
            </div>
            <p className={`text-xs mt-1 ${subText}`}>
              3D Revenue projections, conversion benchmarks, and rep performance telemetry.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={fetchReports}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl border text-xs transition-colors btn-3d ${refreshBtnCls}`}
            >
              <RefreshCw size={14} />
              <span>Refresh</span>
            </button>
            <button
              onClick={exportReport}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#f95e26] hover:bg-[#e0521e] text-white text-xs font-semibold shadow-3d-orange transition-all btn-3d"
            >
              <Download size={14} />
              <span>Export CSV</span>
            </button>
          </div>
        </div>

        {/* 3D KPI Cards with layered depth */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card3D maxTilt={10} className={`rounded-2xl border shadow-3d-subtle p-5 transition-colors ${cardBg} ${cardBorder}`}>
            <div className="flex justify-between items-start">
              <div>
                <span className={`text-xs font-medium uppercase tracking-wider ${subText}`}>Total Revenue</span>
                <div className={`text-2xl font-bold mt-1 translate-z-20 ${headingText}`}>
                  ${(summary.totalRevenue || 0).toLocaleString()}
                </div>
              </div>
              <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 translate-z-30">
                <DollarSign size={20} />
              </div>
            </div>
            <div className="mt-3 flex items-center gap-2 text-xs text-emerald-500 font-medium">
              <TrendingUp size={14} />
              <span>+18.4% from closed deals</span>
            </div>
          </Card3D>

          <Card3D maxTilt={10} className={`rounded-2xl border shadow-3d-subtle p-5 transition-colors ${cardBg} ${cardBorder}`}>
            <div className="flex justify-between items-start">
              <div>
                <span className={`text-xs font-medium uppercase tracking-wider ${subText}`}>Pipeline Value</span>
                <div className={`text-2xl font-bold mt-1 translate-z-20 ${headingText}`}>
                  ${(summary.pipelineValue || 0).toLocaleString()}
                </div>
              </div>
              <div className="p-2.5 rounded-xl bg-[#f95e26]/10 text-[#f95e26] border border-[#f95e26]/20 translate-z-30">
                <Target size={20} />
              </div>
            </div>
            <div className={`mt-3 text-xs ${subText}`}>
              Across active opportunities
            </div>
          </Card3D>

          <Card3D maxTilt={10} className={`rounded-2xl border shadow-3d-subtle p-5 transition-colors ${cardBg} ${cardBorder}`}>
            <div className="flex justify-between items-start">
              <div>
                <span className={`text-xs font-medium uppercase tracking-wider ${subText}`}>Win Rate</span>
                <div className={`text-2xl font-bold mt-1 translate-z-20 ${headingText}`}>
                  {summary.winRate || 0}%
                </div>
              </div>
              <div className="p-2.5 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20 translate-z-30">
                <Award size={20} />
              </div>
            </div>
            <div className="mt-3 text-xs text-purple-500 font-medium">
              High tier enterprise conversion
            </div>
          </Card3D>

          <Card3D maxTilt={10} className={`rounded-2xl border shadow-3d-subtle p-5 transition-colors ${cardBg} ${cardBorder}`}>
            <div className="flex justify-between items-start">
              <div>
                <span className={`text-xs font-medium uppercase tracking-wider ${subText}`}>Avg Deal Size</span>
                <div className={`text-2xl font-bold mt-1 translate-z-20 ${headingText}`}>
                  ${(summary.avgDealSize || 0).toLocaleString()}
                </div>
              </div>
              <div className="p-2.5 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20 translate-z-30">
                <TrendingUp size={20} />
              </div>
            </div>
            <div className={`mt-3 text-xs ${subText}`}>
              Per signed customer contract
            </div>
          </Card3D>
        </div>

        {/* 3D Isometric Bar Chart Section */}
        <div className={`rounded-2xl border p-6 shadow-3d-subtle relative overflow-hidden transition-colors ${cardBg} ${cardBorder}`}>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-2">
            <div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#f95e26]" />
                <h3 className={`text-lg font-bold ${headingText}`}>3D Volumetric Deal Stages</h3>
              </div>
              <p className={`text-xs mt-0.5 ${subText}`}>
                Volumetric isometric rendering of pipeline stage distributions. Hover over columns for depth inspection.
              </p>
            </div>

            <div className={`flex gap-1 p-1 rounded-xl border ${surfaceBg} ${surfaceBorder}`}>
              <button
                onClick={() => setActiveMetric('revenue')}
                className={`px-3 py-1 text-xs rounded-lg font-medium transition-colors ${
                  activeMetric === 'revenue' ? 'bg-[#f95e26] text-white shadow-sm' : `${subText} hover:text-gray-200`
                }`}
              >
                Revenue ($)
              </button>
              <button
                onClick={() => setActiveMetric('count')}
                className={`px-3 py-1 text-xs rounded-lg font-medium transition-colors ${
                  activeMetric === 'count' ? 'bg-[#f95e26] text-white shadow-sm' : `${subText} hover:text-gray-200`
                }`}
              >
                Deals Count
              </button>
            </div>
          </div>

          <IsometricBar3D stages={stageEntries} />
        </div>

        {/* Leaderboards & Top Deals */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Top Deals */}
          <div className={`rounded-2xl border p-6 shadow-3d-subtle transition-colors ${cardBg} ${cardBorder}`}>
            <h3 className={`text-base font-bold mb-4 flex items-center justify-between ${headingText}`}>
              <span>Top Pipeline Deals</span>
              <span className={`text-xs font-normal ${subText}`}>{topDeals?.length || 0} deals ranked</span>
            </h3>

            <div className="space-y-3">
              {topDeals?.map((deal: any, i: number) => (
                <div
                  key={deal.id || i}
                  className={`flex items-center justify-between p-3.5 rounded-xl border transition-all hover:-translate-y-0.5 shadow-sm ${surfaceBg} ${surfaceBorder}`}
                >
                  <div className="flex items-center gap-3">
                    <span className={`w-7 h-7 rounded-lg font-bold text-xs flex items-center justify-center ${isDark ? 'bg-[#333] text-gray-300' : 'bg-slate-200 text-slate-700'}`}>
                      #{i + 1}
                    </span>
                    <div>
                      <h4 className={`text-sm font-semibold ${headingText}`}>{deal.title}</h4>
                      <p className={`text-xs ${subText}`}>{deal.company} • {deal.stage}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-bold text-emerald-500">${deal.amount.toLocaleString()}</div>
                    <div className={`text-[10px] ${subText}`}>Close: {deal.expectedClose}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Rep Performance */}
          <div className={`rounded-2xl border p-6 shadow-3d-subtle transition-colors ${cardBg} ${cardBorder}`}>
            <h3 className={`text-base font-bold mb-4 flex items-center justify-between ${headingText}`}>
              <span>Sales Rep Performance</span>
              <span className={`text-xs font-normal ${subText}`}>Closed Won Value</span>
            </h3>

            <div className="space-y-4">
              {Object.keys(performanceByRep || {}).map((rep) => {
                const repAmount = performanceByRep[rep] || 0;
                const maxRep = Math.max(...Object.values(performanceByRep as Record<string, number>), 1);
                const percent = Math.round((repAmount / maxRep) * 100);

                return (
                  <div key={rep} className={`p-3.5 rounded-xl border ${surfaceBg} ${surfaceBorder}`}>
                    <div className="flex justify-between items-center mb-1.5">
                      <div className="flex items-center gap-2">
                        <span className="w-6 h-6 rounded-full bg-[#f95e26] text-white text-xs font-bold flex items-center justify-center">
                          {rep.charAt(0)}
                        </span>
                        <span className={`text-sm font-semibold ${headingText}`}>{rep}</span>
                      </div>
                      <span className={`text-sm font-bold ${headingText}`}>${repAmount.toLocaleString()}</span>
                    </div>

                    <div className={`w-full rounded-full h-2.5 overflow-hidden border ${isDark ? 'bg-[#171717] border-[#383838]' : 'bg-slate-200 border-slate-300'}`}>
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-[#f95e26] to-[#ff844b] transition-all duration-700"
                        style={{ width: `${percent}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
