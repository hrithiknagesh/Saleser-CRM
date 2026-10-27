import { useEffect, useState } from 'react';
import {
  Search,
  Plus,
  Calendar,
  Building,
  X,
  Sparkles,
  ChevronRight,
  ChevronLeft,
  Trash2,
  Edit2,
  Check
} from 'lucide-react';
import Card3D from './components/Card3D';

const STAGES = ['New', 'Qualified', 'Proposal Sent', 'Negotiation', 'Closed Won'];

const STAGE_THEMES: Record<string, { border: string; badge: string; dot: string }> = {
  'New': { border: 'border-blue-500/30', badge: 'bg-blue-500/10 text-blue-400', dot: 'bg-blue-400' },
  'Qualified': { border: 'border-amber-500/30', badge: 'bg-amber-500/10 text-amber-400', dot: 'bg-amber-400' },
  'Proposal Sent': { border: 'border-purple-500/30', badge: 'bg-purple-500/10 text-purple-400', dot: 'bg-purple-400' },
  'Negotiation': { border: 'border-[#f95e26]/30', badge: 'bg-[#f95e26]/10 text-[#f95e26]', dot: 'bg-[#f95e26]' },
  'Closed Won': { border: 'border-emerald-500/30', badge: 'bg-emerald-500/10 text-emerald-400', dot: 'bg-emerald-400' },
};

export default function DealsPage() {
  const [deals, setDeals] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [showNewModal, setShowNewModal] = useState(false);
  const [editingDeal, setEditingDeal] = useState<any | null>(null);

  const [newDeal, setNewDeal] = useState({
    title: '',
    company: '',
    contact: '',
    amount: '',
    stage: 'New',
    probability: 50,
    expectedClose: new Date().toISOString().split('T')[0],
  });

  const fetchDeals = () => {
    fetch('http://localhost:3000/api/deals')
      .then(res => res.json())
      .then(data => setDeals(data))
      .catch(err => console.error('Error fetching deals:', err));
  };

  useEffect(() => {
    fetchDeals();
  }, []);

  const handleCreateDeal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDeal.title || !newDeal.company) return;

    try {
      const res = await fetch('http://localhost:3000/api/deals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...newDeal,
          amount: parseFloat(newDeal.amount) || 10000,
          probability: Number(newDeal.probability) || 50,
        }),
      });
      if (res.ok) {
        setShowNewModal(false);
        setNewDeal({
          title: '',
          company: '',
          contact: '',
          amount: '',
          stage: 'New',
          probability: 50,
          expectedClose: new Date().toISOString().split('T')[0],
        });
        fetchDeals();
      }
    } catch (err) {
      console.error('Failed to create deal:', err);
    }
  };

  const handleUpdateDeal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingDeal) return;

    try {
      const res = await fetch(`http://localhost:3000/api/deals/${editingDeal.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...editingDeal,
          amount: parseFloat(editingDeal.amount) || 0,
          probability: Number(editingDeal.probability) || 0,
        }),
      });
      if (res.ok) {
        setEditingDeal(null);
        fetchDeals();
      }
    } catch (err) {
      console.error('Failed to update deal:', err);
    }
  };

  const handleMoveStage = async (deal: any, direction: 'prev' | 'next', e: React.MouseEvent) => {
    e.stopPropagation();
    const currentIndex = STAGES.indexOf(deal.stage);
    const newIndex = direction === 'next' ? currentIndex + 1 : currentIndex - 1;

    if (newIndex >= 0 && newIndex < STAGES.length) {
      const newStage = STAGES[newIndex];
      try {
        await fetch(`http://localhost:3000/api/deals/${deal.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ stage: newStage })
        });
        fetchDeals();
      } catch (err) {
        console.error('Failed to move deal stage:', err);
      }
    }
  };

  const handleDeleteDeal = async (id: number) => {
    try {
      await fetch(`http://localhost:3000/api/deals/${id}`, {
        method: 'DELETE'
      });
      setEditingDeal(null);
      fetchDeals();
    } catch (err) {
      console.error('Failed to delete deal:', err);
    }
  };

  const filteredDeals = deals.filter(deal => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      deal.title.toLowerCase().includes(q) ||
      deal.company.toLowerCase().includes(q) ||
      (deal.contact && deal.contact.toLowerCase().includes(q))
    );
  });

  const totalPipeline = deals.reduce((sum, d) => sum + (d.amount || 0), 0);

  return (
    <div className="p-6 bg-[#171717] h-full overflow-hidden flex flex-col font-sans select-none">
      {/* Top Header bar */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-2xl font-bold text-white tracking-tight">Deals Pipeline</h2>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-[#f95e26]/15 text-[#f95e26] border border-[#f95e26]/30 font-semibold">
              3D Interactive Board
            </span>
          </div>
          <p className="text-xs text-gray-400 mt-1">
            Total Pipeline Value: <strong className="text-white">${totalPipeline.toLocaleString()}</strong> across {deals.length} active opportunities. Click card to edit.
          </p>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="relative flex-1 sm:flex-initial">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500" size={15} />
            <input
              type="text"
              placeholder="Search deals, company..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full sm:w-64 bg-[#242424] text-xs text-gray-200 rounded-xl pl-9 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#f95e26] border border-[#383838]"
            />
          </div>

          <button
            onClick={() => setShowNewModal(true)}
            className="bg-[#f95e26] hover:bg-[#e0521e] text-white text-xs font-semibold px-4 py-2 rounded-xl flex items-center gap-1.5 shadow-3d-orange transition-all btn-3d shrink-0"
          >
            <Plus size={15} />
            <span>New Deal</span>
          </button>
        </div>
      </div>

      {/* 3D Kanban Board */}
      <div className="flex-1 flex gap-5 overflow-x-auto pb-4">
        {STAGES.map((stage, stageIdx) => {
          const stageDeals = filteredDeals.filter(d => d.stage === stage);
          const totalAmount = stageDeals.reduce((sum, d) => sum + (d.amount || 0), 0);
          const theme = STAGE_THEMES[stage] || STAGE_THEMES['New'];

          return (
            <div
              key={stage}
              className="bg-[#1c1c1c] rounded-2xl border border-[#333] flex flex-col min-w-[310px] max-w-[310px] shadow-3d-subtle"
            >
              {/* Column Header */}
              <div className="p-4 border-b border-[#333] flex justify-between items-center bg-[#242424] rounded-t-2xl">
                <div className="flex items-center gap-2">
                  <span className={`w-2 h-2 rounded-full ${theme.dot}`} />
                  <div>
                    <h3 className="text-gray-200 font-semibold text-sm">{stage}</h3>
                    <p className="text-[11px] text-gray-400 mt-0.5">
                      ${totalAmount.toLocaleString()} • {stageDeals.length} deals
                    </p>
                  </div>
                </div>
              </div>

              {/* Deal Cards with 3D Tilt */}
              <div className="p-3 flex-1 overflow-y-auto space-y-3.5">
                {stageDeals.map(deal => (
                  <Card3D
                    key={deal.id}
                    maxTilt={8}
                    onClick={() => setEditingDeal(deal)}
                    className="rounded-xl bg-[#262626] border border-[#383838] p-4 shadow-3d-subtle hover:border-[#f95e26]/50 cursor-pointer group transition-all"
                  >
                    <div className="flex justify-between items-start gap-2 mb-1.5">
                      <h4 className="text-gray-100 font-semibold text-sm group-hover:text-[#f95e26] transition-colors leading-snug translate-z-10">
                        {deal.title}
                      </h4>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setEditingDeal(deal);
                        }}
                        className="text-gray-500 hover:text-white p-1 rounded hover:bg-[#333] opacity-0 group-hover:opacity-100 transition-opacity"
                        title="Edit Deal"
                      >
                        <Edit2 size={13} />
                      </button>
                    </div>

                    <div className="flex items-center gap-1.5 text-xs text-gray-400 mb-3">
                      <Building size={13} className="text-gray-500" />
                      <span>{deal.company}</span>
                      {deal.contact && <span className="text-gray-500">• {deal.contact}</span>}
                    </div>

                    {/* Probability Progress Bar */}
                    {deal.probability !== undefined && (
                      <div className="mb-3">
                        <div className="flex justify-between text-[10px] text-gray-500 mb-1">
                          <span>Probability</span>
                          <span className="text-gray-400 font-semibold">{deal.probability}%</span>
                        </div>
                        <div className="w-full bg-[#181818] rounded-full h-1.5 overflow-hidden border border-[#333]">
                          <div
                            className="bg-gradient-to-r from-[#f95e26] to-[#ff844b] h-full rounded-full"
                            style={{ width: `${deal.probability}%` }}
                          />
                        </div>
                      </div>
                    )}

                    <div className="flex justify-between items-center pt-2 border-t border-[#333]/70 translate-z-20">
                      <div>
                        <div className="text-sm font-bold text-white flex items-center">
                          ${deal.amount.toLocaleString()}
                        </div>
                        {deal.expectedClose && (
                          <div className="flex items-center gap-1 text-[10px] text-gray-500 mt-0.5">
                            <Calendar size={10} />
                            <span>{deal.expectedClose}</span>
                          </div>
                        )}
                      </div>
                      
                      {/* Stage Progression Buttons */}
                      <div className="flex items-center gap-1">
                        {stageIdx > 0 && (
                          <button
                            type="button"
                            onClick={(e) => handleMoveStage(deal, 'prev', e)}
                            className="p-1 rounded-md bg-[#2f2f2f] hover:bg-[#3d3d3d] text-gray-400 hover:text-white transition-colors"
                            title={`Move back to ${STAGES[stageIdx - 1]}`}
                          >
                            <ChevronLeft size={13} />
                          </button>
                        )}
                        {stageIdx < STAGES.length - 1 && (
                          <button
                            type="button"
                            onClick={(e) => handleMoveStage(deal, 'next', e)}
                            className="p-1 rounded-md bg-[#2f2f2f] hover:bg-[#f95e26] text-gray-400 hover:text-white transition-colors"
                            title={`Advance to ${STAGES[stageIdx + 1]}`}
                          >
                            <ChevronRight size={13} />
                          </button>
                        )}
                      </div>
                    </div>
                  </Card3D>
                ))}

                {stageDeals.length === 0 && (
                  <div className="text-center py-8 text-xs text-gray-500 border-2 border-dashed border-[#2f2f2f] rounded-xl">
                    No deals in this stage
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* New Deal Modal */}
      {showNewModal && (
        <div className="fixed inset-0 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-[#1f1f1f] rounded-2xl border border-[#383838] w-full max-w-md p-6 shadow-2xl animate-float-3d">
            <div className="flex justify-between items-center pb-4 border-b border-[#333] mb-5">
              <div className="flex items-center gap-2">
                <Sparkles className="text-[#f95e26]" size={18} />
                <h3 className="text-lg font-bold text-white">Create New Deal</h3>
              </div>
              <button onClick={() => setShowNewModal(false)} className="text-gray-400 hover:text-white">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleCreateDeal} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-gray-300 mb-1">Deal Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Acme Q4 Upgrade"
                  value={newDeal.title}
                  onChange={e => setNewDeal({ ...newDeal, title: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-[#252525] border border-[#383838] text-sm text-gray-100 focus:outline-none focus:ring-2 focus:ring-[#f95e26]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-gray-300 mb-1">Company *</label>
                  <input
                    type="text"
                    required
                    placeholder="Acme Inc"
                    value={newDeal.company}
                    onChange={e => setNewDeal({ ...newDeal, company: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-[#252525] border border-[#383838] text-sm text-gray-100 focus:outline-none focus:ring-2 focus:ring-[#f95e26]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-300 mb-1">Contact Person</label>
                  <input
                    type="text"
                    placeholder="John Doe"
                    value={newDeal.contact}
                    onChange={e => setNewDeal({ ...newDeal, contact: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-[#252525] border border-[#383838] text-sm text-gray-100 focus:outline-none focus:ring-2 focus:ring-[#f95e26]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-gray-300 mb-1">Deal Amount ($) *</label>
                  <input
                    type="number"
                    required
                    placeholder="25000"
                    value={newDeal.amount}
                    onChange={e => setNewDeal({ ...newDeal, amount: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-[#252525] border border-[#383838] text-sm text-gray-100 focus:outline-none focus:ring-2 focus:ring-[#f95e26]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-300 mb-1">Stage</label>
                  <select
                    value={newDeal.stage}
                    onChange={e => setNewDeal({ ...newDeal, stage: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-[#252525] border border-[#383838] text-sm text-gray-100 focus:outline-none focus:ring-2 focus:ring-[#f95e26]"
                  >
                    {STAGES.map(s => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-gray-300 mb-1">Expected Close</label>
                  <input
                    type="date"
                    value={newDeal.expectedClose}
                    onChange={e => setNewDeal({ ...newDeal, expectedClose: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-[#252525] border border-[#383838] text-sm text-gray-100 focus:outline-none focus:ring-2 focus:ring-[#f95e26]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-300 mb-1">Probability ({newDeal.probability}%)</label>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    step="5"
                    value={newDeal.probability}
                    onChange={e => setNewDeal({ ...newDeal, probability: Number(e.target.value) })}
                    className="w-full mt-2 accent-[#f95e26]"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full mt-2 py-2.5 rounded-xl bg-[#f95e26] hover:bg-[#e0521e] text-white font-semibold text-sm shadow-3d-orange transition-all btn-3d"
              >
                Add Deal to Pipeline
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Edit Deal Modal */}
      {editingDeal && (
        <div className="fixed inset-0 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-[#1f1f1f] rounded-2xl border border-[#383838] w-full max-w-md p-6 shadow-2xl animate-float-3d">
            <div className="flex justify-between items-center pb-4 border-b border-[#333] mb-5">
              <div className="flex items-center gap-2">
                <Edit2 className="text-[#f95e26]" size={18} />
                <h3 className="text-lg font-bold text-white">Edit Deal Details</h3>
              </div>
              <button onClick={() => setEditingDeal(null)} className="text-gray-400 hover:text-white">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleUpdateDeal} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-gray-300 mb-1">Deal Title</label>
                <input
                  type="text"
                  required
                  value={editingDeal.title}
                  onChange={e => setEditingDeal({ ...editingDeal, title: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-[#252525] border border-[#383838] text-sm text-gray-100 focus:outline-none focus:ring-2 focus:ring-[#f95e26]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-gray-300 mb-1">Company</label>
                  <input
                    type="text"
                    required
                    value={editingDeal.company}
                    onChange={e => setEditingDeal({ ...editingDeal, company: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-[#252525] border border-[#383838] text-sm text-gray-100 focus:outline-none focus:ring-2 focus:ring-[#f95e26]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-300 mb-1">Contact Person</label>
                  <input
                    type="text"
                    value={editingDeal.contact || ''}
                    onChange={e => setEditingDeal({ ...editingDeal, contact: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-[#252525] border border-[#383838] text-sm text-gray-100 focus:outline-none focus:ring-2 focus:ring-[#f95e26]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-gray-300 mb-1">Deal Amount ($)</label>
                  <input
                    type="number"
                    required
                    value={editingDeal.amount}
                    onChange={e => setEditingDeal({ ...editingDeal, amount: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-[#252525] border border-[#383838] text-sm text-gray-100 focus:outline-none focus:ring-2 focus:ring-[#f95e26]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-300 mb-1">Stage</label>
                  <select
                    value={editingDeal.stage}
                    onChange={e => setEditingDeal({ ...editingDeal, stage: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-[#252525] border border-[#383838] text-sm text-gray-100 focus:outline-none focus:ring-2 focus:ring-[#f95e26]"
                  >
                    {STAGES.map(s => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-gray-300 mb-1">Expected Close</label>
                  <input
                    type="date"
                    value={editingDeal.expectedClose || ''}
                    onChange={e => setEditingDeal({ ...editingDeal, expectedClose: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-[#252525] border border-[#383838] text-sm text-gray-100 focus:outline-none focus:ring-2 focus:ring-[#f95e26]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-300 mb-1">Probability ({editingDeal.probability}%)</label>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    step="5"
                    value={editingDeal.probability || 50}
                    onChange={e => setEditingDeal({ ...editingDeal, probability: Number(e.target.value) })}
                    className="w-full mt-2 accent-[#f95e26]"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-[#333]">
                <button
                  type="button"
                  onClick={() => handleDeleteDeal(editingDeal.id)}
                  className="px-3 py-2 rounded-xl text-rose-400 hover:bg-rose-950/20 text-xs flex items-center gap-1.5 transition-colors"
                >
                  <Trash2 size={14} />
                  <span>Delete Deal</span>
                </button>

                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setEditingDeal(null)}
                    className="px-4 py-2 rounded-xl text-gray-400 hover:text-white bg-[#252525] text-xs"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-xl bg-[#f95e26] hover:bg-[#e0521e] text-white font-medium text-xs btn-3d shadow-3d-orange flex items-center gap-1.5"
                  >
                    <Check size={14} />
                    <span>Save Changes</span>
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
