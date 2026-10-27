import { useEffect, useState } from 'react';
import { Filter, Download, Search, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Card3D from './components/Card3D';
import Scene3D from './components/Scene3D';
import { useTheme } from './ThemeContext';

const DashboardContent = () => {
  const [data, setData] = useState<any>(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [showScene3D, setShowScene3D] = useState(true);
  const [recentSearch, setRecentSearch] = useState('');
  const navigate = useNavigate();
  const { isDark } = useTheme();

  useEffect(() => {
    fetch('http://localhost:3000/api/dashboard')
      .then(res => res.json())
      .then(d => setData(d))
      .catch(err => console.error("Error fetching data:", err));
  }, []);

  if (!data) return <div className="p-8 text-gray-400">Loading dashboard...</div>;

  // Theme-aware class helpers
  const pageBg = isDark ? 'bg-[#171717]' : 'bg-slate-100';
  const cardBg = isDark ? 'bg-[#1f1f1f]' : 'bg-white';
  const cardBorder = isDark ? 'border-[#333]' : 'border-slate-200';
  const headingText = isDark ? 'text-gray-200' : 'text-slate-800';
  const subText = isDark ? 'text-gray-400' : 'text-slate-500';
  const bodyText = isDark ? 'text-gray-300' : 'text-slate-700';
  const rowHover = isDark ? 'hover:bg-[#242424]' : 'hover:bg-slate-50';
  const rowBorder = isDark ? 'border-[#333]/50' : 'border-slate-100';
  const tabBorder = isDark ? 'border-[#333]' : 'border-slate-200';
  const searchInputBg = isDark ? 'bg-[#242424] text-gray-200 border-[#333]' : 'bg-white text-slate-800 border-slate-300';
  const actionBtnCls = isDark
    ? 'text-gray-300 bg-[#242424] hover:bg-[#2a2a2a] border-[#333]'
    : 'text-slate-600 bg-white hover:bg-slate-100 border-slate-300';
  const barTrackBg = isDark ? 'bg-[#181818] border-[#333]' : 'bg-slate-200 border-slate-300';
  const insightRowHover = isDark ? 'hover:bg-[#242424]' : 'hover:bg-slate-100';
  const stageBadgeBg = isDark ? 'bg-[#242424] border-[#333]' : 'bg-slate-100 border-slate-300';

  return (
    <div className={`p-6 h-full overflow-y-auto transition-colors duration-300 ${pageBg}`}>
      {/* Top Bar: Tabs & Actions */}
      <div className="flex items-center justify-between mb-6">
        <div className={`flex gap-6 border-b pb-2 ${tabBorder}`}>
          {['overview', 'leads', 'sales'].map(tab => (
            <span
              key={tab}
              onClick={() => {
                if (tab === 'leads') navigate('/leads');
                else if (tab === 'sales') navigate('/deals');
                else setActiveTab(tab);
              }}
              className={`cursor-pointer capitalize transition-colors ${
                activeTab === tab
                  ? `${headingText} font-medium border-b-2 border-[#f95e26] pb-2 -mb-[9px]`
                  : `${subText} hover:text-gray-300`
              }`}
            >
              {tab}
            </span>
          ))}
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => setShowScene3D(!showScene3D)}
            className={`flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg border transition-all btn-3d ${
              showScene3D
                ? 'bg-[#f95e26]/15 text-[#f95e26] border-[#f95e26]/40 shadow-sm'
                : `${actionBtnCls}`
            }`}
          >
            <Sparkles size={14} />
            <span>{showScene3D ? '3D Orbit: On' : '3D Orbit: Off'}</span>
          </button>
          <button onClick={() => navigate('/reports')} className={`flex items-center gap-2 text-sm px-3 py-1.5 rounded border btn-3d ${actionBtnCls}`}>
            <Filter size={14} /> Analytics
          </button>
          <button onClick={() => {
            const csv = "Metric,Value\n" +
              `Total Leads,${data.totalLeads}\n` +
              `Deals in Pipeline,${data.dealsInPipeline}\n` +
              `Revenue Forecast,$${Math.round(data.revenueForecast).toLocaleString()}\n` +
              `Closed Targets,$${data.closedTargets.toLocaleString()}\n`;
            const blob = new Blob([csv], { type: 'text/csv' });
            const a = document.createElement('a');
            a.href = URL.createObjectURL(blob);
            a.download = 'dashboard_export.csv';
            a.click();
          }} className={`flex items-center gap-2 text-sm px-3 py-1.5 rounded border btn-3d ${actionBtnCls}`}>
            <Download size={14} /> Export
          </button>
        </div>
      </div>

      {/* Interactive 3D Pipeline Scene */}
      {showScene3D && (
        <Scene3D className="mb-6" height={220} />
      )}

      {/* KPI Cards */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <KpiCard isDark={isDark} title="Total Leads" value={data.totalLeads} change="+5% this month" changeType="positive" onClick={() => navigate('/leads')} />
        <KpiCard isDark={isDark} title="Deals in Pipeline" value={data.dealsInPipeline} change={`worth $${Math.round(data.revenueForecast / 1000)}K`} changeType="neutral" onClick={() => navigate('/deals')} />
        <KpiCard isDark={isDark} title="Revenue Forecast" value={`$${(data.revenueForecast / 1000000).toFixed(1)}M`} change="+9% this quarter" changeType="positive" onClick={() => navigate('/reports')} />
        <KpiCard isDark={isDark} title="Closed Targets" value={`$${Math.round(data.closedTargets / 1000)}K`} change="+72% this month" changeType="positive" onClick={() => navigate('/reports')} />
      </div>

      <div className="grid grid-cols-3 gap-4 mb-6">
        {/* Pipeline Overview */}
        <div className={`col-span-2 rounded-lg p-5 border transition-colors duration-300 ${cardBg} ${cardBorder}`}>
          <div className="flex justify-between items-center mb-6">
            <h3 className={`font-medium ${headingText}`}>Pipeline Overview</h3>
            <div className="flex gap-2">
              <button onClick={() => navigate('/leads')} className={`text-xs px-2 py-1 rounded border transition-colors ${actionBtnCls}`}>View all</button>
              <button onClick={() => {
                const csv = "Stage,Count\n" +
                  `New Leads,${data.pipelineOverview.newLeads}\n` +
                  `Qualified,${data.pipelineOverview.qualified}\n` +
                  `Proposal Sent,${data.pipelineOverview.proposalSent}\n` +
                  `Closed Deals,${data.pipelineOverview.closedDeals}\n`;
                const blob = new Blob([csv], { type: 'text/csv' });
                const a = document.createElement('a');
                a.href = URL.createObjectURL(blob);
                a.download = 'pipeline_export.csv';
                a.click();
              }} className={`text-xs px-2 py-1 rounded border flex items-center gap-1 transition-colors ${actionBtnCls}`}>
                <Download size={12} /> Export
              </button>
            </div>
          </div>

          <div className="space-y-4">
            <PipelineBar isDark={isDark} label="New Leads" count={data.pipelineOverview.newLeads} percent={Math.min((data.pipelineOverview.newLeads / (data.totalLeads || 1)) * 100, 100)} change="+60%" barTrackBg={barTrackBg} bodyText={bodyText} headingText={headingText} />
            <PipelineBar isDark={isDark} label="Qualified" count={data.pipelineOverview.qualified} percent={Math.min((data.pipelineOverview.qualified / (data.totalLeads || 1)) * 100, 100)} change="+50%" barTrackBg={barTrackBg} bodyText={bodyText} headingText={headingText} />
            <PipelineBar isDark={isDark} label="Proposal Sent" count={data.pipelineOverview.proposalSent} percent={Math.min((data.pipelineOverview.proposalSent / (data.totalLeads || 1)) * 100, 100)} change="+40%" barTrackBg={barTrackBg} bodyText={bodyText} headingText={headingText} />
            <PipelineBar isDark={isDark} label="Closed Deals" count={data.pipelineOverview.closedDeals} percent={Math.min((data.pipelineOverview.closedDeals / (data.totalLeads || 1)) * 100, 100)} change="" barTrackBg={barTrackBg} bodyText={bodyText} headingText={headingText} />
          </div>
        </div>

        {/* Insights & Alerts */}
        <div className={`col-span-1 rounded-lg p-5 border transition-colors duration-300 ${cardBg} ${cardBorder}`}>
          <div className="flex justify-between items-center mb-6">
            <h3 className={`font-medium ${headingText}`}>Insights & Alerts</h3>
            <button onClick={() => navigate('/tasks')} className={`text-xs px-2 py-1 rounded border transition-colors ${actionBtnCls}`}>View all</button>
          </div>
          <div className="space-y-4">
            {data.insights.map((insight: any, i: number) => (
              <div key={i} className={`flex justify-between items-center text-sm cursor-pointer p-2 rounded -mx-2 transition-colors ${insightRowHover}`}>
                <span className={bodyText}>{insight.text}</span>
                <span className={`text-xs whitespace-nowrap ml-2 ${insight.status === 'warning' ? 'text-yellow-500' : insight.status === 'danger' ? 'text-red-500' : insight.status === 'success' ? 'text-green-500' : 'text-blue-500'}`}>
                  {insight.info}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Leads */}
      <div className={`rounded-lg p-5 border transition-colors duration-300 ${cardBg} ${cardBorder}`}>
        <div className="flex justify-between items-center mb-4">
          <h3 className={`font-medium ${headingText}`}>Recent Leads Added</h3>
          <div className="flex gap-3">
            <div className="relative">
              <Search className={`absolute left-2.5 top-1/2 -translate-y-1/2 ${subText}`} size={14} />
              <input
                type="text"
                placeholder="Search leads..."
                value={recentSearch}
                onChange={e => setRecentSearch(e.target.value)}
                className={`text-xs rounded-lg pl-8 pr-3 py-1.5 focus:outline-none focus:ring-1 focus:ring-[#f95e26] w-48 border transition-colors ${searchInputBg}`}
              />
            </div>
            <button onClick={() => navigate('/leads')} className={`flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg border btn-3d transition-colors ${actionBtnCls}`}>
              <Filter size={12} /> View All
            </button>
            <button onClick={() => {
              const csv = "Company,Name,Stage,Date,Assignee\n" + data.recentLeads.map((l: any) => `${l.company},${l.name},${l.stage},${l.date},${l.assignee}`).join('\n');
              const blob = new Blob([csv], { type: 'text/csv' });
              const a = document.createElement('a');
              a.href = URL.createObjectURL(blob);
              a.download = 'recent_leads.csv';
              a.click();
            }} className={`flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg border btn-3d transition-colors ${actionBtnCls}`}>
              <Download size={12} /> Export
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className={`w-full text-left text-sm ${subText}`}>
            <thead>
              <tr className={`border-b ${cardBorder}`}>
                <th className="pb-2.5 font-medium">Sl. No</th>
                <th className="pb-2.5 font-medium">Company</th>
                <th className="pb-2.5 font-medium">Name</th>
                <th className="pb-2.5 font-medium">Stage</th>
                <th className="pb-2.5 font-medium">Last Activity</th>
                <th className="pb-2.5 font-medium">Assigned Person</th>
              </tr>
            </thead>
            <tbody>
              {data.recentLeads
                .filter((lead: any) => {
                  if (!recentSearch.trim()) return true;
                  const q = recentSearch.toLowerCase();
                  return (
                    lead.company.toLowerCase().includes(q) ||
                    lead.name.toLowerCase().includes(q) ||
                    lead.stage.toLowerCase().includes(q) ||
                    (lead.assignee && lead.assignee.toLowerCase().includes(q))
                  );
                })
                .map((lead: any, i: number) => (
                  <tr key={lead.id} className={`border-b last:border-0 cursor-pointer transition-colors ${rowBorder} ${rowHover}`} onClick={() => navigate('/leads')}>
                    <td className="py-3">{i + 1}</td>
                    <td className={`py-3 font-medium ${headingText}`}>{lead.company}</td>
                    <td className={`py-3 ${headingText}`}>{lead.name}</td>
                    <td className="py-3">
                      <span className={`px-2 py-0.5 rounded text-xs border ${stageBadgeBg} ${lead.stage === 'Qualified' ? 'text-yellow-500' : lead.stage === 'Proposal Sent' ? 'text-purple-400' : 'text-blue-400'}`}>
                        {lead.stage}
                      </span>
                    </td>
                    <td className="py-3">{lead.date}</td>
                    <td className="py-3">{lead.assignee}</td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

const KpiCard = ({ isDark, title, value, change, changeType, onClick }: any) => {
  const cardBg = isDark ? 'bg-[#1f1f1f] border-[#333] hover:border-[#555]' : 'bg-white border-slate-200 hover:border-slate-400';
  const titleText = isDark ? 'text-gray-400' : 'text-slate-500';
  const valueText = isDark ? 'text-white' : 'text-slate-900';
  const vsText = isDark ? 'text-gray-500' : 'text-slate-400';
  return (
    <Card3D maxTilt={12} onClick={onClick} className={`p-5 rounded-2xl border cursor-pointer shadow-3d-subtle transition-all ${cardBg}`}>
      <div className="flex justify-between items-start mb-2">
        <div className={`text-xs font-semibold uppercase tracking-wider ${titleText}`}>{title}</div>
        <div className="w-2 h-2 rounded-full bg-[#f95e26] shadow-sm translate-z-10" />
      </div>
      <div className={`text-2xl sm:text-3xl font-bold mb-3 translate-z-20 ${valueText}`}>
        {typeof value === 'number' ? value.toLocaleString() : value}
      </div>
      <div className="flex justify-between items-center text-xs translate-z-10">
        <span className={vsText}>VS last month</span>
        <span className={`px-2 py-0.5 rounded-full font-medium ${changeType === 'positive' ? 'text-green-400 bg-green-500/10 border border-green-500/20' : 'text-gray-400 bg-gray-500/10 border border-gray-500/20'}`}>
          {change}
        </span>
      </div>
    </Card3D>
  );
};

const PipelineBar = ({ label, count, percent, change, barTrackBg, bodyText, headingText }: any) => (
  <div>
    <div className="flex justify-between text-sm mb-1.5">
      <span className={`font-medium ${bodyText}`}>{label}</span>
      <div className="flex items-center gap-2">
        <span className={`font-semibold ${headingText}`}>{count}</span>
        {change && <span className="text-xs text-green-400 bg-green-500/10 border border-green-500/20 px-1.5 py-0.5 rounded-full">{change}</span>}
      </div>
    </div>
    <div className={`w-full rounded-full h-2.5 p-[1px] border ${barTrackBg}`}>
      <div
        className="bg-gradient-to-r from-[#f95e26] to-[#ff7e47] h-full rounded-full transition-all duration-700 shadow-sm"
        style={{ width: `${percent}%` }}
      />
    </div>
  </div>
);

export default DashboardContent;
