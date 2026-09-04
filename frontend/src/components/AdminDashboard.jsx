import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { Users, CalendarDays, Receipt, UserPlus, CheckCircle, XCircle, Clock, Search, ShieldCheck, DollarSign, Download } from 'lucide-react';

export const AdminDashboard = ({ subTab = 'admin-dashboard' }) => {
  const [employees, setEmployees] = useState([]);
  const [leaves, setLeaves] = useState([]);
  const [slips, setSlips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [downloadingId, setDownloadingId] = useState(null);

  // Modal state for adding employee
  const [showAddModal, setShowAddModal] = useState(false);
  const [addMsg, setAddMsg] = useState('');
  const [newEmp, setNewEmp] = useState({
    username: '',
    email: '',
    first_name: '',
    last_name: '',
    password: 'Employee@123',
    gender: 'MALE',
    role: 'EMPLOYEE',
    employee_id: 'DEG-103',
    designation: 'Software Engineer',
    department: 'Engineering',
    base_salary: '60000',
    bio: 'Dedicated team member at Dahera Groups.'
  });

  const handleOpenAddModal = () => {
    const randomNum = Math.floor(4 + Math.random() * 15);
    const formattedNum = randomNum < 10 ? `0${randomNum}` : `${randomNum}`;
    const initialGender = 'MALE';
    const initialId = `DHG-M-${formattedNum}`;
    
    setNewEmp({
      username: '',
      email: '',
      first_name: '',
      last_name: '',
      password: 'Employee@123',
      gender: initialGender,
      role: 'EMPLOYEE',
      employee_id: initialId,
      designation: 'Software Engineer',
      department: 'Engineering',
      base_salary: '60000',
      bio: 'Dedicated team member at Dahera Groups.'
    });
    setAddMsg('');
    setShowAddModal(true);
  };

  // Modal state for generating salary slip
  const [showSlipModal, setShowSlipModal] = useState(false);
  const [slipForm, setSlipForm] = useState({
    employee: '',
    month: '9',
    year: '2026',
    basic_salary: '50000',
    allowances: '15000',
    deductions: '3000'
  });

  const fetchData = async () => {
    setLoading(true);
    try {
      const [empRes, leaveRes, slipRes] = await Promise.all([
        api.get('/users/employees/'),
        api.get('/leaves/'),
        api.get('/payroll/slips/')
      ]);
      setEmployees(empRes.data.results || empRes.data);
      setLeaves(leaveRes.data.results || leaveRes.data);
      setSlips(slipRes.data.results || slipRes.data);
    } catch (err) {
      console.error("Admin dashboard fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleApproveLeave = async (id) => {
    try {
      await api.post(`/leaves/${id}/approve/`, { admin_notes: 'Approved by Administrator' });
      fetchData();
    } catch (err) {
      alert("Failed to approve leave request.");
    }
  };

  const handleRejectLeave = async (id) => {
    try {
      await api.post(`/leaves/${id}/reject/`, { admin_notes: 'Rejected by Administrator' });
      fetchData();
    } catch (err) {
      alert("Failed to reject leave request.");
    }
  };

  const handleAddEmployeeSubmit = async (e) => {
    e.preventDefault();
    setAddMsg('');
    try {
      await api.post('/users/employees/', newEmp);
      setShowAddModal(false);
      setNewEmp({
        username: '', email: '', first_name: '', last_name: '', password: 'Employee@123',
        gender: 'MALE', role: 'EMPLOYEE', employee_id: '', designation: 'Software Engineer',
        department: 'Engineering', base_salary: '60000', bio: ''
      });
      fetchData();
    } catch (err) {
      setAddMsg(err.response?.data?.detail || 'Error creating employee. Check if email/ID is unique.');
    }
  };

  const handleGenerateSlipSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/payroll/slips/', slipForm);
      setShowSlipModal(false);
      fetchData();
    } catch (err) {
      alert(err.response?.data?.detail || 'Error generating salary slip.');
    }
  };

  // Robust PDF Blob Download for Admin
  const handleDownloadPdf = async (slipId, monthName, year, employeeId) => {
    setDownloadingId(slipId);
    try {
      const response = await api.get(`/payroll/slips/${slipId}/download_pdf/`, {
        responseType: 'blob',
      });
      const blob = new Blob([response.data], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `Dahera_Salary_Slip_${employeeId || 'EMP'}_${monthName}_${year}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error("PDF download error:", err);
      alert("Failed to download PDF salary slip.");
    } finally {
      setDownloadingId(null);
    }
  };

  // Metrics
  const totalEmployees = employees.length;
  const maleCount = employees.filter(e => e.gender === 'MALE').length;
  const femaleCount = employees.filter(e => e.gender === 'FEMALE').length;
  const pendingLeaves = leaves.filter(l => l.status === 'PENDING').length;
  const totalPayroll = slips.reduce((acc, curr) => acc + parseFloat(curr.net_salary || 0), 0);

  const filteredEmployees = employees.filter(e => 
    (e.full_name || e.username).toLowerCase().includes(searchTerm.toLowerCase()) ||
    (e.employee_id || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (e.department || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="p-8 text-center text-slate-400 flex flex-col items-center justify-center min-h-[400px]">
        <div className="w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mb-3"></div>
        <span>Loading Admin Command Center...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6 font-['Inter',sans-serif]">
      
      {/* Top Command Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-emerald-950 to-slate-900 text-white rounded-3xl p-6 md:p-8 shadow-xl border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold uppercase tracking-wider mb-1.5">
            <ShieldCheck className="w-4 h-4" />
            <span>Administrative Command Center</span>
          </div>
          <h1 className="text-2xl font-black tracking-tight">Dahera Groups Executive Dashboard</h1>
          <p className="text-slate-400 text-xs mt-1">Full management oversight across staff bio, gender shift schedules, leave requests & payroll.</p>
        </div>
        
        <div className="flex items-center gap-3">
          <button
            onClick={handleOpenAddModal}
            className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-4 py-2.5 rounded-xl text-xs transition-all shadow-lg shadow-emerald-600/30 flex items-center gap-2"
          >
            <UserPlus className="w-4 h-4" />
            <span>Add Employee</span>
          </button>
          
          <button
            onClick={() => setShowSlipModal(true)}
            className="bg-slate-800 hover:bg-slate-700 text-white font-bold px-4 py-2.5 rounded-xl text-xs transition-all border border-slate-700 flex items-center gap-2"
          >
            <Receipt className="w-4 h-4 text-emerald-400" />
            <span>Issue Salary Slip</span>
          </button>
        </div>
      </div>

      {/* Strategic Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div className="bg-slate-900 p-5 rounded-2xl border border-slate-800 shadow-xl flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Total Staff</span>
            <span className="text-2xl font-black text-white">{totalEmployees}</span>
            <span className="text-xs text-slate-400 block mt-1">
              <strong className="text-emerald-400">{maleCount}</strong> Male (10 AM) • <strong className="text-teal-300">{femaleCount}</strong> Female (9:30 AM)
            </span>
          </div>
          <div className="p-3 bg-emerald-950 border border-emerald-800 text-emerald-400 rounded-xl">
            <Users className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-slate-900 p-5 rounded-2xl border border-slate-800 shadow-xl flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Pending Leaves</span>
            <span className="text-2xl font-black text-amber-400">{pendingLeaves}</span>
            <span className="text-xs text-slate-400 block mt-1">Requires Approval</span>
          </div>
          <div className="p-3 bg-amber-950 border border-amber-800 text-amber-400 rounded-xl">
            <CalendarDays className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-slate-900 p-5 rounded-2xl border border-slate-800 shadow-xl flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Total Payroll</span>
            <span className="text-2xl font-black text-emerald-400">₹{totalPayroll.toLocaleString('en-IN')}</span>
            <span className="text-xs text-slate-400 block mt-1">Total Issued Payslips</span>
          </div>
          <div className="p-3 bg-emerald-950 border border-emerald-800 text-emerald-400 rounded-xl">
            <DollarSign className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-slate-900 p-5 rounded-2xl border border-slate-800 shadow-xl flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Shift Rules Active</span>
            <span className="text-xs font-bold text-white block mt-1">Male: <strong className="text-emerald-400">10:00 AM</strong></span>
            <span className="text-xs font-bold text-white block mt-0.5">Female: <strong className="text-teal-300">9:30 AM</strong></span>
          </div>
          <div className="p-3 bg-slate-800 text-emerald-400 rounded-xl border border-slate-700">
            <Clock className="w-6 h-6" />
          </div>
        </div>

      </div>

      {/* Leave Approval Queue */}
      {(subTab === 'admin-dashboard' || subTab === 'admin-leaves') && (
        <div className="bg-slate-900 rounded-3xl border border-slate-800 shadow-xl p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div>
              <h2 className="text-lg font-bold text-white">Leave Requests Approval Queue</h2>
              <p className="text-xs text-slate-400 mt-0.5">Review and decide on employee leave applications.</p>
            </div>
            <span className="px-3 py-1 bg-amber-950 text-amber-300 border border-amber-800 font-bold text-xs rounded-full">
              {pendingLeaves} Pending
            </span>
          </div>

          {leaves.length === 0 ? (
            <p className="text-sm text-slate-500 text-center py-6">No leave requests found.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-800 text-[11px] font-bold text-slate-400 uppercase bg-slate-950">
                    <th className="py-3 px-4">Employee</th>
                    <th className="py-3 px-4">Type</th>
                    <th className="py-3 px-4">Duration</th>
                    <th className="py-3 px-4">Reason</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800 text-xs">
                  {leaves.map((l) => (
                    <tr key={l.id} className="hover:bg-slate-800/50 transition-colors">
                      <td className="py-3.5 px-4 font-bold text-white">
                        {l.employee_details?.full_name || 'Employee'}
                        <span className="block text-[11px] font-normal text-slate-400">{l.employee_details?.employee_id}</span>
                      </td>
                      <td className="py-3.5 px-4 font-semibold text-slate-300">
                        <span className="px-2 py-0.5 bg-slate-800 border border-slate-700 rounded">{l.leave_type}</span>
                      </td>
                      <td className="py-3.5 px-4 text-slate-300">
                        {l.start_date} to {l.end_date}
                        <span className="block text-[10px] text-slate-500">({l.total_days} days)</span>
                      </td>
                      <td className="py-3.5 px-4 text-slate-300 max-w-xs truncate">{l.reason}</td>
                      <td className="py-3.5 px-4">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                          l.status === 'APPROVED' ? 'bg-emerald-950 text-emerald-300 border border-emerald-800' :
                          l.status === 'REJECTED' ? 'bg-rose-950 text-rose-300 border border-rose-800' :
                          'bg-amber-950 text-amber-300 border border-amber-800'
                        }`}>
                          {l.status}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        {l.status === 'PENDING' ? (
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => handleApproveLeave(l.id)}
                              className="px-3 py-1 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg font-bold text-[11px] flex items-center gap-1 transition-colors"
                            >
                              <CheckCircle className="w-3.5 h-3.5" />
                              <span>Approve</span>
                            </button>
                            <button
                              onClick={() => handleRejectLeave(l.id)}
                              className="px-3 py-1 bg-rose-600 hover:bg-rose-500 text-white rounded-lg font-bold text-[11px] flex items-center gap-1 transition-colors"
                            >
                              <XCircle className="w-3.5 h-3.5" />
                              <span>Reject</span>
                            </button>
                          </div>
                        ) : (
                          <span className="text-[11px] text-slate-500">Completed</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Staff Directory */}
      {(subTab === 'admin-dashboard' || subTab === 'admin-employees') && (
        <div className="bg-slate-900 rounded-3xl border border-slate-800 shadow-xl p-6 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
            <div>
              <h2 className="text-lg font-bold text-white">Dahera Employee & Gender Shift Directory</h2>
              <p className="text-xs text-slate-400 mt-0.5">Overview of staff members and assigned shift login times.</p>
            </div>
            
            <div className="relative">
              <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search staff or ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9 pr-4 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white w-64 focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-800 text-[11px] font-bold text-slate-400 uppercase bg-slate-950">
                  <th className="py-3 px-4">Employee ID</th>
                  <th className="py-3 px-4">Full Name & Email</th>
                  <th className="py-3 px-4">Gender & Shift Time</th>
                  <th className="py-3 px-4">Designation & Department</th>
                  <th className="py-3 px-4">Base Salary</th>
                  <th className="py-3 px-4">Role</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 text-xs">
                {filteredEmployees.map((emp) => (
                  <tr key={emp.id} className="hover:bg-slate-800/50 transition-colors">
                    <td className="py-3.5 px-4 font-bold text-emerald-400">{emp.employee_id || 'N/A'}</td>
                    <td className="py-3.5 px-4">
                      <span className="font-bold text-white block">{emp.full_name}</span>
                      <span className="text-[11px] text-slate-400">{emp.email}</span>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                        emp.gender === 'FEMALE' ? 'bg-teal-950 text-teal-300 border border-teal-800' : 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                      }`}>
                        <Clock className="w-3 h-3" />
                        {emp.gender} • {emp.scheduled_login_time}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-slate-300">
                      <span className="font-semibold text-slate-200 block">{emp.designation}</span>
                      <span className="text-[11px] text-slate-400">{emp.department}</span>
                    </td>
                    <td className="py-3.5 px-4 font-bold text-slate-200">
                      ₹{parseFloat(emp.base_salary || 0).toLocaleString('en-IN')}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className={`px-2 py-0.5 text-[10px] font-bold rounded ${
                        emp.role === 'ADMIN' ? 'bg-indigo-950 text-indigo-300 border border-indigo-800' : 'bg-slate-800 text-slate-300'
                      }`}>
                        {emp.role}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Salary Slips Management */}
      {(subTab === 'admin-dashboard' || subTab === 'admin-payroll') && (
        <div className="bg-slate-900 rounded-3xl border border-slate-800 shadow-xl p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div>
              <h2 className="text-lg font-bold text-white">Issued Salary Slips</h2>
              <p className="text-xs text-slate-400 mt-0.5">Complete log of generated payroll slips.</p>
            </div>
            <button
              onClick={() => setShowSlipModal(true)}
              className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-3.5 py-2 rounded-xl text-xs transition-colors flex items-center gap-1.5 shadow-lg shadow-emerald-600/20"
            >
              <Receipt className="w-4 h-4" />
              <span>Generate New Slip</span>
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-800 text-[11px] font-bold text-slate-400 uppercase bg-slate-950">
                  <th className="py-3 px-4">Employee</th>
                  <th className="py-3 px-4">Shift Schedule</th>
                  <th className="py-3 px-4">Pay Period</th>
                  <th className="py-3 px-4">Basic Salary</th>
                  <th className="py-3 px-4">Net Salary</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">PDF Download</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 text-xs">
                {slips.map((slip) => (
                  <tr key={slip.id} className="hover:bg-slate-800/50 transition-colors">
                    <td className="py-3.5 px-4 font-bold text-white">
                      {slip.employee_details?.full_name}
                      <span className="block text-[11px] font-normal text-slate-400">{slip.employee_details?.employee_id}</span>
                    </td>
                    <td className="py-3.5 px-4 font-bold text-emerald-400">
                      {slip.scheduled_login_time}
                    </td>
                    <td className="py-3.5 px-4 text-slate-300 font-semibold">
                      {slip.month_name} {slip.year}
                    </td>
                    <td className="py-3.5 px-4 text-slate-300">₹{parseFloat(slip.basic_salary).toLocaleString('en-IN')}</td>
                    <td className="py-3.5 px-4 font-black text-emerald-400">₹{parseFloat(slip.net_salary).toLocaleString('en-IN')}</td>
                    <td className="py-3.5 px-4">
                      <span className="px-2 py-0.5 bg-emerald-950 text-emerald-300 border border-emerald-800 text-[10px] font-bold rounded-full">
                        {slip.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      {/* Robust Blob Download for Admin */}
                      <button
                        type="button"
                        disabled={downloadingId === slip.id}
                        onClick={() => handleDownloadPdf(slip.id, slip.month_name, slip.year, slip.employee_details?.employee_id)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600/20 hover:bg-emerald-600/40 text-emerald-300 border border-emerald-800 rounded-xl text-xs font-bold transition-colors disabled:opacity-50"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>{downloadingId === slip.id ? 'Downloading...' : 'Download PDF'}</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Add Employee Modal (Admin Gender Selection Included Here) */}
      {showAddModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-bold text-white border-b border-slate-800 pb-3">Add New Employee Account</h3>
            
            {addMsg && (
              <div className="p-3 bg-rose-950/80 border border-rose-800 text-rose-300 text-xs rounded-xl">
                {addMsg}
              </div>
            )}

            <form onSubmit={handleAddEmployeeSubmit} className="space-y-3.5 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">First Name</label>
                  <input
                    type="text"
                    required
                    value={newEmp.first_name}
                    onChange={(e) => setNewEmp({...newEmp, first_name: e.target.value})}
                    className="w-full p-2.5 bg-slate-950 border border-slate-800 text-white rounded-xl"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Last Name</label>
                  <input
                    type="text"
                    required
                    value={newEmp.last_name}
                    onChange={(e) => setNewEmp({...newEmp, last_name: e.target.value})}
                    className="w-full p-2.5 bg-slate-950 border border-slate-800 text-white rounded-xl"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Email / Username</label>
                <input
                  type="email"
                  required
                  value={newEmp.username}
                  onChange={(e) => setNewEmp({...newEmp, username: e.target.value, email: e.target.value})}
                  className="w-full p-2.5 bg-slate-950 border border-slate-800 text-white rounded-xl"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                {/* Admin Selects Employee Gender -> Determines Shift Login Time */}
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Gender (Sets Shift Time)</label>
                  <select
                    value={newEmp.gender}
                    onChange={(e) => {
                      const g = e.target.value;
                      const prefix = g === 'MALE' ? 'DHG-M-' : 'DHG-F-';
                      const parts = newEmp.employee_id.split('-');
                      const currNum = parts.length > 1 ? parts[parts.length - 1] : '04';
                      setNewEmp({...newEmp, gender: g, employee_id: `${prefix}${currNum}`});
                    }}
                    className="w-full p-2.5 bg-slate-950 border border-slate-800 text-emerald-400 font-bold rounded-xl"
                  >
                    <option value="MALE">MALE (Shift: 10:00 AM)</option>
                    <option value="FEMALE">FEMALE (Shift: 9:30 AM)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Employee ID</label>
                  <input
                    type="text"
                    placeholder="e.g. DEG-105"
                    required
                    value={newEmp.employee_id}
                    onChange={(e) => setNewEmp({...newEmp, employee_id: e.target.value})}
                    className="w-full p-2.5 bg-slate-950 border border-slate-800 text-white rounded-xl"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Designation</label>
                  <input
                    type="text"
                    required
                    value={newEmp.designation}
                    onChange={(e) => setNewEmp({...newEmp, designation: e.target.value})}
                    className="w-full p-2.5 bg-slate-950 border border-slate-800 text-white rounded-xl"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Base Salary (INR)</label>
                  <input
                    type="number"
                    required
                    value={newEmp.base_salary}
                    onChange={(e) => setNewEmp({...newEmp, base_salary: e.target.value})}
                    className="w-full p-2.5 bg-slate-950 border border-slate-800 text-white rounded-xl"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Employee Bio</label>
                <textarea
                  rows="2"
                  value={newEmp.bio}
                  onChange={(e) => setNewEmp({...newEmp, bio: e.target.value})}
                  className="w-full p-2.5 bg-slate-950 border border-slate-800 text-white rounded-xl"
                  placeholder="Professional bio..."
                ></textarea>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl shadow-lg shadow-emerald-600/20"
                >
                  Create Employee
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Generate Salary Slip Modal */}
      {showSlipModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <h3 className="text-lg font-bold text-white border-b border-slate-800 pb-3">Generate Salary Slip</h3>

            <form onSubmit={handleGenerateSlipSubmit} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Select Employee</label>
                <select
                  required
                  value={slipForm.employee}
                  onChange={(e) => {
                    const selectedEmp = employees.find(emp => emp.id.toString() === e.target.value);
                    setSlipForm({
                      ...slipForm,
                      employee: e.target.value,
                      basic_salary: selectedEmp ? selectedEmp.base_salary : slipForm.basic_salary
                    });
                  }}
                  className="w-full p-2.5 bg-slate-950 border border-slate-800 text-white rounded-xl font-medium"
                >
                  <option value="">-- Choose Employee --</option>
                  {employees.map(e => (
                    <option key={e.id} value={e.id}>
                      {e.full_name} ({e.gender} • Shift: {e.scheduled_login_time})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Month</label>
                  <select
                    value={slipForm.month}
                    onChange={(e) => setSlipForm({...slipForm, month: e.target.value})}
                    className="w-full p-2.5 bg-slate-950 border border-slate-800 text-white rounded-xl"
                  >
                    <option value="1">January</option>
                    <option value="2">February</option>
                    <option value="3">March</option>
                    <option value="4">April</option>
                    <option value="5">May</option>
                    <option value="6">June</option>
                    <option value="7">July</option>
                    <option value="8">August</option>
                    <option value="9">September</option>
                    <option value="10">October</option>
                    <option value="11">November</option>
                    <option value="12">December</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Year</label>
                  <input
                    type="number"
                    value={slipForm.year}
                    onChange={(e) => setSlipForm({...slipForm, year: e.target.value})}
                    className="w-full p-2.5 bg-slate-950 border border-slate-800 text-white rounded-xl"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Basic Salary (INR)</label>
                <input
                  type="number"
                  required
                  value={slipForm.basic_salary}
                  onChange={(e) => setSlipForm({...slipForm, basic_salary: e.target.value})}
                  className="w-full p-2.5 bg-slate-950 border border-slate-800 text-white rounded-xl"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Allowances (INR)</label>
                  <input
                    type="number"
                    value={slipForm.allowances}
                    onChange={(e) => setSlipForm({...slipForm, allowances: e.target.value})}
                    className="w-full p-2.5 bg-slate-950 border border-slate-800 text-white rounded-xl"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Deductions (INR)</label>
                  <input
                    type="number"
                    value={slipForm.deductions}
                    onChange={(e) => setSlipForm({...slipForm, deductions: e.target.value})}
                    className="w-full p-2.5 bg-slate-950 border border-slate-800 text-white rounded-xl"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowSlipModal(false)}
                  className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl shadow-lg shadow-emerald-600/20"
                >
                  Generate Slip
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default AdminDashboard;
