import { useEffect, useState } from 'react';
import {
  Plus,
  CheckCircle2,
  Circle,
  Clock,
  Trash2,
  Edit2,
  Search,
  AlertTriangle,
  Calendar,
  Building,
  User,
  X,
  Check
} from 'lucide-react';
import Card3D from './components/Card3D';

interface Task {
  id: number;
  title: string;
  description?: string;
  dueDate: string;
  priority: 'High' | 'Medium' | 'Low';
  status: 'Pending' | 'In Progress' | 'Completed';
  assignee?: string;
  relatedTo?: string;
}

const PRIORITY_THEMES: Record<string, { badge: string; text: string; bg: string }> = {
  High: { badge: 'bg-rose-500/15 text-rose-400 border border-rose-500/30', text: 'text-rose-400', bg: 'bg-rose-500' },
  Medium: { badge: 'bg-amber-500/15 text-amber-400 border border-amber-500/30', text: 'text-amber-400', bg: 'bg-amber-500' },
  Low: { badge: 'bg-blue-500/15 text-blue-400 border border-blue-500/30', text: 'text-blue-400', bg: 'bg-blue-500' }
};

const emptyTaskForm: Omit<Task, 'id'> = {
  title: '',
  description: '',
  dueDate: new Date().toISOString().split('T')[0],
  priority: 'Medium',
  status: 'Pending',
  assignee: 'Sarah K.',
  relatedTo: ''
};

const TasksPage = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterTab, setFilterTab] = useState<'All' | 'Pending' | 'In Progress' | 'Completed' | 'High'>('All');
  const [showModal, setShowModal] = useState(false);
  const [editingTaskId, setEditingTaskId] = useState<number | null>(null);
  const [formData, setFormData] = useState<Omit<Task, 'id'>>(emptyTaskForm);

  const fetchTasks = () => {
    fetch('http://localhost:3000/api/tasks')
      .then(res => res.json())
      .then((data: Task[]) => {
        setTasks(data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Error fetching tasks:", err);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const openCreateModal = () => {
    setEditingTaskId(null);
    setFormData(emptyTaskForm);
    setShowModal(true);
  };

  const openEditModal = (task: Task) => {
    setEditingTaskId(task.id);
    setFormData({
      title: task.title,
      description: task.description || '',
      dueDate: task.dueDate || new Date().toISOString().split('T')[0],
      priority: task.priority || 'Medium',
      status: task.status || 'Pending',
      assignee: task.assignee || 'Sarah K.',
      relatedTo: task.relatedTo || ''
    });
    setShowModal(true);
  };

  const handleSaveTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim()) return;

    if (editingTaskId) {
      // Update existing
      fetch(`http://localhost:3000/api/tasks/${editingTaskId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      }).then(() => {
        setShowModal(false);
        fetchTasks();
      });
    } else {
      // Create new
      fetch('http://localhost:3000/api/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      }).then(() => {
        setShowModal(false);
        fetchTasks();
      });
    }
  };

  const toggleTaskStatus = (task: Task) => {
    const nextStatus = task.status === 'Completed' ? 'Pending' : 'Completed';
    fetch(`http://localhost:3000/api/tasks/${task.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: nextStatus })
    }).then(() => fetchTasks());
  };

  const deleteTask = (id: number) => {
    fetch(`http://localhost:3000/api/tasks/${id}`, {
      method: 'DELETE'
    }).then(() => fetchTasks());
  };

  // Filtered tasks
  const filteredTasks = tasks.filter(task => {
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      task.title.toLowerCase().includes(q) ||
      (task.description && task.description.toLowerCase().includes(q)) ||
      (task.relatedTo && task.relatedTo.toLowerCase().includes(q)) ||
      (task.assignee && task.assignee.toLowerCase().includes(q));

    if (!matchesSearch) return false;

    if (filterTab === 'All') return true;
    if (filterTab === 'High') return task.priority === 'High';
    return task.status === filterTab;
  });

  // KPI calculations
  const totalCount = tasks.length;
  const pendingCount = tasks.filter(t => t.status === 'Pending').length;
  const inProgressCount = tasks.filter(t => t.status === 'In Progress').length;
  const completedCount = tasks.filter(t => t.status === 'Completed').length;
  const highPriorityCount = tasks.filter(t => t.priority === 'High' && t.status !== 'Completed').length;

  return (
    <div className="p-6 bg-[#171717] h-full overflow-y-auto font-sans flex flex-col">
      {/* Page Title & Add Button */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-2xl font-bold text-white tracking-tight">Tasks & Assignments</h2>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-[#f95e26]/15 text-[#f95e26] border border-[#f95e26]/30 font-semibold">
              Active Workflow
            </span>
          </div>
          <p className="text-xs text-gray-400 mt-1">
            Manage your daily CRM sales actions, customer follow-ups, and pipeline milestones.
          </p>
        </div>

        <button
          onClick={openCreateModal}
          className="bg-[#f95e26] hover:bg-[#e0521e] text-white text-sm font-medium px-4 py-2 rounded-xl flex items-center gap-2 transition-all btn-3d shadow-3d-orange"
        >
          <Plus size={16} /> New Task
        </button>
      </div>

      {/* 3D KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <Card3D maxTilt={7} className="rounded-xl bg-[#1f1f1f] border border-[#333] p-4 shadow-3d-subtle cursor-pointer" onClick={() => setFilterTab('All')}>
          <div className="text-xs text-gray-400 font-medium translate-z-10">Total Tasks</div>
          <div className="text-2xl font-bold text-white mt-1 translate-z-20">{totalCount}</div>
          <div className="text-[11px] text-gray-500 mt-1 flex items-center gap-1">Across all assignees</div>
        </Card3D>

        <Card3D maxTilt={7} className="rounded-xl bg-[#1f1f1f] border border-[#333] p-4 shadow-3d-subtle cursor-pointer" onClick={() => setFilterTab('Pending')}>
          <div className="text-xs text-amber-400 font-medium translate-z-10 flex items-center gap-1.5">
            <Clock size={13} /> Pending Tasks
          </div>
          <div className="text-2xl font-bold text-white mt-1 translate-z-20">{pendingCount}</div>
          <div className="text-[11px] text-amber-400/70 mt-1">{inProgressCount} currently in progress</div>
        </Card3D>

        <Card3D maxTilt={7} className="rounded-xl bg-[#1f1f1f] border border-[#333] p-4 shadow-3d-subtle cursor-pointer" onClick={() => setFilterTab('Completed')}>
          <div className="text-xs text-emerald-400 font-medium translate-z-10 flex items-center gap-1.5">
            <CheckCircle2 size={13} /> Completed
          </div>
          <div className="text-2xl font-bold text-white mt-1 translate-z-20">{completedCount}</div>
          <div className="text-[11px] text-emerald-400/70 mt-1">
            {totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0}% completion rate
          </div>
        </Card3D>

        <Card3D maxTilt={7} className="rounded-xl bg-[#1f1f1f] border border-[#333] p-4 shadow-3d-subtle cursor-pointer" onClick={() => setFilterTab('High')}>
          <div className="text-xs text-rose-400 font-medium translate-z-10 flex items-center gap-1.5">
            <AlertTriangle size={13} /> High Priority
          </div>
          <div className="text-2xl font-bold text-white mt-1 translate-z-20">{highPriorityCount}</div>
          <div className="text-[11px] text-rose-400/70 mt-1">Requires immediate attention</div>
        </Card3D>
      </div>

      {/* Filter Tabs & Search Bar */}
      <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-3 mb-4">
        {/* Status Filter Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          {(['All', 'Pending', 'In Progress', 'Completed', 'High'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setFilterTab(tab)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                filterTab === tab
                  ? 'bg-[#f95e26] text-white shadow-sm'
                  : 'bg-[#222] text-gray-400 hover:text-gray-200 hover:bg-[#2a2a2a] border border-[#333]'
              }`}
            >
              {tab === 'High' ? 'High Priority' : tab}
            </button>
          ))}
        </div>

        {/* Live Search */}
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={14} />
          <input
            type="text"
            placeholder="Search tasks, client, or rep..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full bg-[#1f1f1f] text-xs text-gray-200 rounded-xl pl-9 pr-3 py-2 border border-[#333] focus:outline-none focus:ring-1 focus:ring-[#f95e26]"
          />
        </div>
      </div>

      {/* Tasks List */}
      <div className="bg-[#1f1f1f] rounded-2xl border border-[#333] overflow-hidden flex-1 shadow-3d-subtle">
        {loading ? (
          <div className="p-8 text-center text-gray-400">Loading tasks...</div>
        ) : filteredTasks.length === 0 ? (
          <div className="p-12 text-center text-gray-500">
            <CheckCircle2 size={36} className="mx-auto mb-2 text-gray-600 opacity-60" />
            <p className="font-medium text-sm text-gray-400">No tasks found</p>
            <p className="text-xs text-gray-500 mt-1">
              {searchQuery ? `No tasks matching "${searchQuery}"` : 'Everything is clear! Click "New Task" to create one.'}
            </p>
          </div>
        ) : (
          <div className="divide-y divide-[#2e2e2e]">
            {filteredTasks.map(task => {
              const priorityTheme = PRIORITY_THEMES[task.priority] || PRIORITY_THEMES.Medium;
              const isDone = task.status === 'Completed';

              return (
                <div
                  key={task.id}
                  className={`flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 hover:bg-[#252525] transition-colors gap-3 ${
                    isDone ? 'opacity-70 bg-[#1c1c1c]' : ''
                  }`}
                >
                  {/* Left: Checkbox + Title + Description */}
                  <div className="flex items-start gap-3.5 flex-1 min-w-0">
                    <button
                      onClick={() => toggleTaskStatus(task)}
                      className="mt-0.5 text-gray-400 hover:text-[#f95e26] transition-colors shrink-0"
                      title={isDone ? 'Mark Pending' : 'Mark Completed'}
                    >
                      {isDone ? (
                        <CheckCircle2 className="text-emerald-500" size={20} />
                      ) : (
                        <Circle size={20} />
                      )}
                    </button>

                    <div className="min-w-0">
                      <div className="flex items-center gap-2.5 flex-wrap">
                        <p
                          className={`text-sm font-semibold truncate ${
                            isDone ? 'line-through text-gray-500' : 'text-gray-100'
                          }`}
                        >
                          {task.title}
                        </p>

                        {/* Priority Badge */}
                        <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${priorityTheme.badge}`}>
                          {task.priority} Priority
                        </span>

                        {/* Status Badge */}
                        <span
                          className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${
                            task.status === 'Completed'
                              ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                              : task.status === 'In Progress'
                              ? 'bg-blue-500/10 text-blue-400 border-blue-500/20'
                              : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                          }`}
                        >
                          {task.status}
                        </span>
                      </div>

                      {task.description && (
                        <p className="text-xs text-gray-400 mt-1 line-clamp-1">{task.description}</p>
                      )}

                      {/* Meta Tags: Due Date, Related Company, Assignee */}
                      <div className="flex items-center gap-3 text-xs text-gray-500 mt-2 flex-wrap">
                        <span className="flex items-center gap-1">
                          <Calendar size={12} className="text-gray-400" />
                          Due: {task.dueDate || 'No date'}
                        </span>

                        {task.relatedTo && (
                          <span className="flex items-center gap-1 text-gray-400">
                            <Building size={12} className="text-gray-500" />
                            {task.relatedTo}
                          </span>
                        )}

                        {task.assignee && (
                          <span className="flex items-center gap-1 text-gray-400">
                            <User size={12} className="text-gray-500" />
                            {task.assignee}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Right: Actions */}
                  <div className="flex items-center gap-1 self-end sm:self-center shrink-0">
                    <button
                      onClick={() => openEditModal(task)}
                      className="text-gray-400 hover:text-white p-2 rounded-lg hover:bg-[#333] transition-colors"
                      title="Edit Task"
                    >
                      <Edit2 size={15} />
                    </button>
                    <button
                      onClick={() => deleteTask(task.id)}
                      className="text-gray-500 hover:text-red-400 p-2 rounded-lg hover:bg-red-950/20 transition-colors"
                      title="Delete Task"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Create / Edit Task Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-[#1f1f1f] rounded-2xl border border-[#383838] w-full max-w-lg p-6 shadow-2xl animate-float-3d">
            <div className="flex justify-between items-center pb-4 border-b border-[#333] mb-5">
              <h3 className="text-lg font-bold text-white">
                {editingTaskId ? 'Edit Task' : 'Create New Task'}
              </h3>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-white">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSaveTask} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-gray-300 mb-1">Task Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Follow up on proposal terms"
                  value={formData.title}
                  onChange={e => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#252525] border border-[#383838] text-sm text-gray-100 focus:outline-none focus:ring-2 focus:ring-[#f95e26]"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-300 mb-1">Description / Notes</label>
                <textarea
                  rows={3}
                  placeholder="Additional context or checklist items..."
                  value={formData.description}
                  onChange={e => setFormData({ ...formData, description: e.target.value })}
                  className="w-full p-3 rounded-xl bg-[#252525] border border-[#383838] text-sm text-gray-100 focus:outline-none focus:ring-2 focus:ring-[#f95e26]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-gray-300 mb-1">Due Date</label>
                  <input
                    type="date"
                    value={formData.dueDate}
                    onChange={e => setFormData({ ...formData, dueDate: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-[#252525] border border-[#383838] text-sm text-gray-100 focus:outline-none focus:ring-2 focus:ring-[#f95e26]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-300 mb-1">Priority</label>
                  <select
                    value={formData.priority}
                    onChange={e => setFormData({ ...formData, priority: e.target.value as any })}
                    className="w-full px-3 py-2 rounded-xl bg-[#252525] border border-[#383838] text-sm text-gray-100 focus:outline-none focus:ring-2 focus:ring-[#f95e26]"
                  >
                    <option value="High">High</option>
                    <option value="Medium">Medium</option>
                    <option value="Low">Low</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-gray-300 mb-1">Status</label>
                  <select
                    value={formData.status}
                    onChange={e => setFormData({ ...formData, status: e.target.value as any })}
                    className="w-full px-3 py-2 rounded-xl bg-[#252525] border border-[#383838] text-sm text-gray-100 focus:outline-none focus:ring-2 focus:ring-[#f95e26]"
                  >
                    <option value="Pending">Pending</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Completed">Completed</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-300 mb-1">Assignee</label>
                  <select
                    value={formData.assignee}
                    onChange={e => setFormData({ ...formData, assignee: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-[#252525] border border-[#383838] text-sm text-gray-100 focus:outline-none focus:ring-2 focus:ring-[#f95e26]"
                  >
                    <option value="Sarah K.">Sarah K.</option>
                    <option value="John D.">John D.</option>
                    <option value="Emily R.">Emily R.</option>
                    <option value="Kiran">Kiran</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-300 mb-1">Related Client / Company</label>
                <input
                  type="text"
                  placeholder="e.g. Acme Inc, Beta Corp"
                  value={formData.relatedTo}
                  onChange={e => setFormData({ ...formData, relatedTo: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#252525] border border-[#383838] text-sm text-gray-100 focus:outline-none focus:ring-2 focus:ring-[#f95e26]"
                />
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-[#333]">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 rounded-xl text-gray-400 hover:text-white bg-[#252525] text-sm"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#f95e26] hover:bg-[#e0521e] text-white font-medium text-sm btn-3d shadow-3d-orange flex items-center gap-1.5"
                >
                  <Check size={16} />
                  <span>{editingTaskId ? 'Save Changes' : 'Create Task'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default TasksPage;
