import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { Users, CalendarDays, Receipt, UserPlus, CheckCircle, XCircle, Clock, Search, ShieldCheck, DollarSign, Download, UserX, UserCheck, Calculator } from 'lucide-react';

export const AdminDashboard = ({ subTab = 'admin-dashboard', darkMode = false }) => {
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
    password: '',
    gender: 'MALE',
    role: 'EMPLOYEE',
    employee_id: 'THG-M-01',
    phone: '',
    designation: 'Software Engineer',
    department: 'Engineering',
    base_salary: '60000',
    bio: 'Dedicated team member at Thahira Groups.'
  });

  const handleOpenAddModal = () => {
    const maleCount = employees.filter(emp => emp.gender === 'MALE' && emp.role === 'EMPLOYEE').length + 1;
    const formattedNum = maleCount >= 10 ? `${maleCount}` : `0${maleCount}`;
    const initialId = `THG-M-${formattedNum}`;
    
    setNewEmp({
      username: '',
      email: '',
      first_name: '',
      last_name: '',
      password: '',
      gender: 'MALE',
      role: 'EMPLOYEE',
      employee_id: initialId,
      phone: '',
      designation: 'Software Engineer',
      department: 'Engineering',
      base_salary: '60000',
      bio: 'Dedicated team member at Thahira Groups.'
    });
    setAddMsg('');
    setShowAddModal(true);
  };

  // Modal state for generating salary slip with calendar days & leave deductions
  const [showSlipModal, setShowSlipModal] = useState(false);
  const [slipForm, setSlipForm] = useState({
    employee: '',
    month: '9',
    year: '2026',
    basic_salary: '30000',
    leave_days_deducted: '1',
    allowances: '5000',
    deductions: '1000'
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

  const handleTerminateEmployee = async (id, empName) => {
    if (!window.confirm(`Are you sure you want to terminate ${empName}? They will be immediately blocked from logging in.`)) {
      return;
    }
    try {
      await api.post(`/users/employees/${id}/terminate/`);
      fetchData();
    } catch (err) {
      alert("Failed to terminate employee account.");
    }
  };

  const handleReactivateEmployee = async (id, empName) => {
    try {
      await api.post(`/users/employees/${id}/reactivate/`);
      fetchData();
    } catch (err) {
      alert("Failed to reactivate employee account.");
    }
  };

  const handleAddEmployeeSubmit = async (e) => {
    e.preventDefault();
    setAddMsg('');
    try {
      const formattedEmail = (newEmp.email || newEmp.username || '').trim();
      const payload = {
        ...newEmp,
        username: formattedEmail,
        email: formattedEmail,
        phone: (newEmp.phone || '').trim()
      };
      if (!payload.password || !payload.password.trim()) {
        delete payload.password;
      }
      await api.post('/users/employees/', payload);
      setShowAddModal(false);
      fetchData();
    } catch (err) {
      console.error("Employee creation error:", err.response?.data);
      let errMsg = 'Error creating employee.';
      if (err.response?.data) {
        if (typeof err.response.data === 'string') {
          errMsg = err.response.data;
        } else if (err.response.data.detail) {
          errMsg = err.response.data.detail;
        } else {
          errMsg = Object.entries(err.response.data)
            .map(([field, msgs]) => `${field}: ${Array.isArray(msgs) ? msgs.join(', ') : msgs}`)
            .join(' | ');
        }
      }
      setAddMsg(errMsg);
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

  // Robust PDF Blob Download
  const handleDownloadPdf = async (slipId, monthName, year, employeeId) => {
    setDownloadingId(slipId);
    try {
      const response = await api.get(`/payroll/slips/${slipId}/download_pdf/`, {
        responseType: 'blob',
      });

      if (response.data.type && response.data.type.includes('json')) {
        const errorText = await response.data.text();
        const json = JSON.parse(errorText);
        alert(json.detail || "Error downloading PDF.");
        return;
      }

      const blob = new Blob([response.data], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `Thahira_Salary_Slip_${employeeId || 'EMP'}_${monthName}_${year}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      setTimeout(() => window.URL.revokeObjectURL(url), 1000);
    } catch (err) {
      console.error("PDF download error:", err);
      if (err.response && err.response.data instanceof Blob) {
        try {
          const text = await err.response.data.text();
          const json = JSON.parse(text);
          alert(json.detail || "Failed to download PDF salary slip.");
          return;
        } catch (e) {}
      }
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

  // Real-time calculation preview in modal
  const calcBase = parseFloat(slipForm.basic_salary || 0);
  const calcDaysInMonth = 30; // approx
  const calcDailyRate = calcBase > 0 ? (calcBase / calcDaysInMonth) : 0;
  const calcLeaveDays = parseFloat(slipForm.leave_days_deducted || 0);
  const calcLeaveDeduction = calcLeaveDays * calcDailyRate;
  const calcAllowances = parseFloat(slipForm.allowances || 0);
  const calcDeductions = parseFloat(slipForm.deductions || 0);
  const calcNetSalary = (calcBase - calcLeaveDeduction) + calcAllowances - calcDeductions;

  if (loading) {
    return (
      <div className="p-8 text-center flex flex-col items-center justify-center min-h-[400px]">
        <div className="w-8 h-8 border-4 border-rose-900 border-t-transparent rounded-full animate-spin mb-3"></div>
        <span className={darkMode ? 'text-stone-400' : 'text-stone-500'}>Loading Thahira Groups Admin Console...</span>
      </div>
    );
  }

  const cardBg = darkMode ? 'bg-stone-900 border-stone-800 text-white' : 'bg-white border-stone-200 text-stone-900';
  const innerBg = darkMode ? 'bg-stone-950 border-stone-800' : 'bg-stone-50 border-stone-200';
  const textMuted = darkMode ? 'text-stone-400' : 'text-stone-500';

  return (
    <div className="space-y-6 font-['Plus_Jakarta_Sans',sans-serif]">
      
      {/* Executive Command Header */}
      <div className="bg-gradient-to-r from-[#4C0519] via-[#881337] to-[#991B1B] text-white rounded-3xl p-6 md:p-8 shadow-xl border border-rose-900 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-rose-200 text-xs font-bold uppercase tracking-wider mb-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Admin Executive Dashboard</span>
          </div>
          <h1 className="text-2xl font-black tracking-tight">Thahira Groups Executive Control Panel</h1>
          <p className="text-rose-100 text-xs mt-1">Manage employee profiles, leave request approvals, and month calendar salary slip deductions.</p>
        </div>
        
        <div className="flex items-center gap-3">
          <button
            onClick={handleOpenAddModal}
            className="bg-white hover:bg-rose-50 text-[#881337] font-black px-4 py-2.5 rounded-xl text-xs transition-all shadow-lg flex items-center gap-2"
          >
            <UserPlus className="w-4 h-4" />
            <span>Add New Employee</span>
          </button>
          
          <button
            onClick={() => setShowSlipModal(true)}
            className="bg-rose-950/60 hover:bg-rose-950 text-white font-bold px-4 py-2.5 rounded-xl text-xs transition-all border border-white/20 flex items-center gap-2"
          >
            <Receipt className="w-4 h-4" />
            <span>Issue Payslip</span>
          </button>
        </div>
      </div>

      {/* Strategic Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div className={`p-5 rounded-2xl border shadow-sm flex items-center justify-between ${cardBg}`}>
          <div>
            <span className={`text-[11px] font-bold uppercase tracking-wider block ${textMuted}`}>Total Staff</span>
            <span className="text-2xl font-black">{totalEmployees}</span>
            <span className={`text-xs block mt-1 ${textMuted}`}>
              <strong className="text-rose-800">{maleCount}</strong> Male (10 AM) • <strong className="text-amber-800">{femaleCount}</strong> Female (9:30 AM)
            </span>
          </div>
          <div className="p-3 bg-rose-50 text-rose-900 rounded-xl">
            <Users className="w-6 h-6" />
          </div>
        </div>

        <div className={`p-5 rounded-2xl border shadow-sm flex items-center justify-between ${cardBg}`}>
          <div>
            <span className={`text-[11px] font-bold uppercase tracking-wider block ${textMuted}`}>Pending Leave Queue</span>
            <span className="text-2xl font-black text-amber-600">{pendingLeaves}</span>
            <span className={`text-xs block mt-1 ${textMuted}`}>Awaiting HR Approval</span>
          </div>
          <div className="p-3 bg-amber-50 text-amber-700 rounded-xl">
            <CalendarDays className="w-6 h-6" />
          </div>
        </div>

        <div className={`p-5 rounded-2xl border shadow-sm flex items-center justify-between ${cardBg}`}>
          <div>
            <span className={`text-[11px] font-bold uppercase tracking-wider block ${textMuted}`}>Monthly Payroll</span>
            <span className="text-2xl font-black text-emerald-600">₹{totalPayroll.toLocaleString('en-IN')}</span>
            <span className={`text-xs block mt-1 ${textMuted}`}>Total Issued Payslips</span>
          </div>
          <div className="p-3 bg-emerald-50 text-emerald-700 rounded-xl">
            <DollarSign className="w-6 h-6" />
          </div>
        </div>

        <div className={`p-5 rounded-2xl border shadow-sm flex items-center justify-between ${cardBg}`}>
          <div>
            <span className={`text-[11px] font-bold uppercase tracking-wider block ${textMuted}`}>Shift Rules Active</span>
            <span className="text-xs font-bold block mt-1">Male: <strong className="text-rose-800">10:00 AM</strong></span>
            <span className="text-xs font-bold block mt-0.5">Female: <strong className="text-amber-800">9:30 AM</strong></span>
          </div>
          <div className={`p-3 rounded-xl ${innerBg}`}>
            <Clock className="w-6 h-6" />
          </div>
        </div>

      </div>

      {/* Leave Approval Queue */}
      {(subTab === 'admin-dashboard' || subTab === 'admin-leaves') && (
        <div className={`rounded-3xl border shadow-sm p-6 space-y-4 ${cardBg}`}>
          <div className="flex items-center justify-between border-b border-stone-100 pb-4">
            <div>
              <h2 className="text-lg font-bold">Leave Requests Approval Queue</h2>
              <p className={`text-xs mt-0.5 ${textMuted}`}>Click Approve or Reject to process staff leave applications.</p>
            </div>
            <span className="px-3 py-1 bg-amber-50 text-amber-800 font-bold text-xs rounded-full border border-amber-200">
              {pendingLeaves} Pending Action
            </span>
          </div>

          {leaves.length === 0 ? (
            <p className={`text-sm text-center py-6 ${textMuted}`}>No leave requests found.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className={`border-b text-[11px] font-bold uppercase ${darkMode ? 'border-stone-800 text-stone-400 bg-stone-950' : 'border-stone-200 text-stone-500 bg-stone-50'}`}>
                    <th className="py-3 px-4">Employee</th>
                    <th className="py-3 px-4">Type</th>
                    <th className="py-3 px-4">Duration</th>
                    <th className="py-3 px-4">Reason</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100 text-xs">
                  {leaves.map((l) => (
                    <tr key={l.id} className="hover:bg-stone-50/80 transition-colors">
                      <td className="py-3.5 px-4 font-bold">
                        {l.employee_details?.full_name || 'Employee'}
                        <span className="block text-[11px] font-mono text-rose-800">{l.employee_details?.employee_id}</span>
                      </td>
                      <td className="py-3.5 px-4 font-semibold">
                        <span className={`px-2 py-0.5 rounded border ${innerBg}`}>{l.leave_type}</span>
                      </td>
                      <td className="py-3.5 px-4">
                        {l.start_date} to {l.end_date}
                        <span className={`block text-[10px] ${textMuted}`}>({l.total_days} days)</span>
                      </td>
                      <td className="py-3.5 px-4 max-w-xs truncate">{l.reason}</td>
                      <td className="py-3.5 px-4">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                          l.status === 'APPROVED' ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' :
                          l.status === 'REJECTED' ? 'bg-rose-50 text-rose-800 border border-rose-200' :
                          'bg-amber-50 text-amber-800 border border-amber-200'
                        }`}>
                          {l.status}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        {l.status === 'PENDING' ? (
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => handleApproveLeave(l.id)}
                              className="px-3 py-1 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg font-bold text-[11px] flex items-center gap-1 transition-colors shadow-xs"
                            >
                              <CheckCircle className="w-3.5 h-3.5" />
                              <span>Approve</span>
                            </button>
                            <button
                              onClick={() => handleRejectLeave(l.id)}
                              className="px-3 py-1 bg-rose-800 hover:bg-rose-700 text-white rounded-lg font-bold text-[11px] flex items-center gap-1 transition-colors shadow-xs"
                            >
                              <XCircle className="w-3.5 h-3.5" />
                              <span>Reject</span>
                            </button>
                          </div>
                        ) : (
                          <span className={`text-[11px] font-medium ${textMuted}`}>Action Recorded</span>
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
        <div className={`rounded-3xl border shadow-sm p-6 space-y-4 ${cardBg}`}>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-100 pb-4">
            <div>
              <h2 className="text-lg font-bold">Thahira Employee Directory</h2>
              <p className={`text-xs mt-0.5 ${textMuted}`}>Manage staff profiles, initial mobile password, and termination status.</p>
            </div>
            
            <div className="relative">
              <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search staff, ID or dept..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={`pl-9 pr-4 py-2 rounded-xl text-xs w-64 focus:outline-none focus:border-[#881337] border ${innerBg}`}
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className={`border-b text-[11px] font-bold uppercase ${darkMode ? 'border-stone-800 text-stone-400 bg-stone-950' : 'border-stone-200 text-stone-500 bg-stone-50'}`}>
                  <th className="py-3 px-4">Employee ID</th>
                  <th className="py-3 px-4">Full Name & Contact</th>
                  <th className="py-3 px-4">Gender & Shift Time</th>
                  <th className="py-3 px-4">Designation & Department</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Termination Controls</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100 text-xs">
                {filteredEmployees.map((emp) => {
                  const isTerminated = !emp.is_active || emp.status === 'TERMINATED';
                  return (
                    <tr key={emp.id} className="hover:bg-stone-50/80 transition-colors">
                      <td className="py-3.5 px-4 font-black text-rose-800 font-mono">{emp.employee_id || 'N/A'}</td>
                      <td className="py-3.5 px-4">
                        <span className="font-bold block">{emp.full_name}</span>
                        <span className={`text-[11px] block ${textMuted}`}>{emp.email} • Mobile: <strong className="font-mono">{emp.phone || 'N/A'}</strong></span>
                      </td>
                      <td className="py-3.5 px-4">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                          emp.gender === 'FEMALE' ? 'bg-amber-50 text-amber-900 border border-amber-200' : 'bg-rose-50 text-rose-900 border border-rose-200'
                        }`}>
                          <Clock className="w-3 h-3" />
                          {emp.gender} • {emp.scheduled_login_time}
                        </span>
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="font-semibold block">{emp.designation}</span>
                        <span className={`text-[11px] ${textMuted}`}>{emp.department}</span>
                      </td>
                      <td className="py-3.5 px-4">
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
                          isTerminated ? 'bg-rose-100 text-rose-900 border-rose-300' : 'bg-emerald-50 text-emerald-800 border-emerald-200'
                        }`}>
                          {isTerminated ? 'TERMINATED' : 'ACTIVE'}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        {emp.role !== 'ADMIN' && (
                          isTerminated ? (
                            <button
                              onClick={() => handleReactivateEmployee(emp.id, emp.full_name)}
                              className="px-3 py-1 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-bold text-[11px] flex items-center gap-1.5 transition-colors shadow-xs ml-auto"
                            >
                              <UserCheck className="w-3.5 h-3.5" />
                              <span>Reactivate</span>
                            </button>
                          ) : (
                            <button
                              onClick={() => handleTerminateEmployee(emp.id, emp.full_name)}
                              className="px-3 py-1 bg-rose-800 hover:bg-rose-700 text-white rounded-xl font-bold text-[11px] flex items-center gap-1.5 transition-colors shadow-xs ml-auto"
                            >
                              <UserX className="w-3.5 h-3.5" />
                              <span>Terminate</span>
                            </button>
                          )
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Salary Slips Log */}
      {(subTab === 'admin-dashboard' || subTab === 'admin-payroll') && (
        <div className={`rounded-3xl border shadow-sm p-6 space-y-4 ${cardBg}`}>
          <div className="flex items-center justify-between border-b border-stone-100 pb-4">
            <div>
              <h2 className="text-lg font-bold">Issued Salary Slips & Calendar Deductions</h2>
              <p className={`text-xs mt-0.5 ${textMuted}`}>Complete record of monthly payroll statements with calendar rate calculations.</p>
            </div>
            <button
              onClick={() => setShowSlipModal(true)}
              className="bg-[#881337] hover:bg-[#991B1B] text-white font-bold px-3.5 py-2 rounded-xl text-xs transition-colors flex items-center gap-1.5 shadow-md shadow-rose-950/20"
            >
              <Receipt className="w-4 h-4" />
              <span>Generate New Slip</span>
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className={`border-b text-[11px] font-bold uppercase ${darkMode ? 'border-stone-800 text-stone-400 bg-stone-950' : 'border-stone-200 text-stone-500 bg-stone-50'}`}>
                  <th className="py-3 px-4">Employee</th>
                  <th className="py-3 px-4">Month & Days</th>
                  <th className="py-3 px-4">Daily Rate</th>
                  <th className="py-3 px-4">Leave Deduction</th>
                  <th className="py-3 px-4">Net Salary</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">PDF Download</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100 text-xs">
                {slips.map((slip) => (
                  <tr key={slip.id} className="hover:bg-stone-50/80 transition-colors">
                    <td className="py-3.5 px-4 font-bold">
                      {slip.employee_details?.full_name}
                      <span className="block text-[11px] font-mono text-rose-800">{slip.employee_details?.employee_id}</span>
                    </td>
                    <td className="py-3.5 px-4 font-semibold">
                      {slip.month_name} {slip.year}
                      <span className="block text-[10px] text-stone-500">{slip.days_in_month || 30} Days in Month</span>
                    </td>
                    <td className="py-3.5 px-4 font-mono font-bold text-stone-700">
                      ₹{parseFloat(slip.daily_rate || 0).toLocaleString('en-IN')}/day
                    </td>
                    <td className="py-3.5 px-4 font-mono font-bold text-rose-800">
                      -₹{parseFloat(slip.leave_deduction_amount || 0).toLocaleString('en-IN')}
                      <span className="block text-[10px] font-sans font-normal text-stone-500">({slip.leave_days_deducted || 0} day leave)</span>
                    </td>
                    <td className="py-3.5 px-4 font-black text-emerald-600">₹{parseFloat(slip.net_salary).toLocaleString('en-IN')}</td>
                    <td className="py-3.5 px-4">
                      <span className="px-2 py-0.5 bg-emerald-50 text-emerald-800 border border-emerald-200 text-[10px] font-bold rounded-full">
                        {slip.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      {/* PDF Blob Download */}
                      <button
                        type="button"
                        disabled={downloadingId === slip.id}
                        onClick={() => handleDownloadPdf(slip.id, slip.month_name, slip.year, slip.employee_details?.employee_id)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-900 border border-rose-200 rounded-xl text-xs font-bold transition-colors disabled:opacity-50"
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

      {/* Add Employee Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-stone-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-stone-200 rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-bold text-stone-900 border-b border-stone-100 pb-3">Add New Employee Account</h3>
            
            {addMsg && (
              <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 text-xs rounded-xl">
                {addMsg}
              </div>
            )}

            <form onSubmit={handleAddEmployeeSubmit} className="space-y-3.5 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-stone-700 font-bold mb-1">First Name</label>
                  <input
                    type="text"
                    required
                    value={newEmp.first_name}
                    onChange={(e) => setNewEmp({...newEmp, first_name: e.target.value})}
                    className="w-full p-2.5 bg-stone-50 border border-stone-300 rounded-xl text-stone-900"
                  />
                </div>
                <div>
                  <label className="block text-stone-700 font-bold mb-1">Last Name</label>
                  <input
                    type="text"
                    required
                    value={newEmp.last_name}
                    onChange={(e) => setNewEmp({...newEmp, last_name: e.target.value})}
                    className="w-full p-2.5 bg-stone-50 border border-stone-300 rounded-xl text-stone-900"
                  />
                </div>
              </div>

              <div>
                <label className="block text-stone-700 font-bold mb-1">Email Address</label>
                <input
                  type="email"
                  required
                  value={newEmp.email}
                  onChange={(e) => setNewEmp({...newEmp, username: e.target.value, email: e.target.value})}
                  className="w-full p-2.5 bg-stone-50 border border-stone-300 rounded-xl text-stone-900"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-stone-700 font-bold mb-1">Gender (Sets Shift Time)</label>
                  <select
                    value={newEmp.gender}
                    onChange={(e) => {
                      const g = e.target.value;
                      const prefix = g === 'MALE' ? 'THG-M-' : 'THG-F-';
                      const count = employees.filter(emp => emp.gender === g && emp.role === 'EMPLOYEE').length + 1;
                      const formattedNum = count >= 10 ? `${count}` : `0${count}`;
                      setNewEmp({...newEmp, gender: g, employee_id: `${prefix}${formattedNum}`});
                    }}
                    className="w-full p-2.5 bg-stone-50 border border-stone-300 text-rose-800 font-bold rounded-xl"
                  >
                    <option value="MALE">MALE (Shift: 10:00 AM)</option>
                    <option value="FEMALE">FEMALE (Shift: 9:30 AM)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-stone-700 font-bold mb-1">
                    Employee ID <span className="text-emerald-600 font-semibold">(Auto-Generated Order)</span>
                  </label>
                  <input
                    type="text"
                    readOnly
                    value={newEmp.employee_id}
                    className="w-full p-2.5 bg-stone-100 border border-stone-300 text-rose-900 font-mono font-black rounded-xl cursor-not-allowed select-none shadow-inner"
                    title="Employee ID is automatically assigned in sequential order upon creation"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-stone-700 font-bold mb-1">
                    Mobile Number <span className="text-stone-500 font-normal">(Initial Password)</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 9876543210"
                    value={newEmp.phone}
                    onChange={(e) => setNewEmp({...newEmp, phone: e.target.value})}
                    className="w-full p-2.5 bg-stone-50 border border-stone-300 font-mono rounded-xl text-stone-900"
                  />
                </div>
                <div>
                  <label className="block text-stone-700 font-bold mb-1">Designation</label>
                  <input
                    type="text"
                    required
                    value={newEmp.designation}
                    onChange={(e) => setNewEmp({...newEmp, designation: e.target.value})}
                    className="w-full p-2.5 bg-stone-50 border border-stone-300 rounded-xl text-stone-900"
                  />
                </div>
              </div>

              <div>
                <label className="block text-stone-700 font-bold mb-1">Employee Bio</label>
                <textarea
                  rows="2"
                  value={newEmp.bio}
                  onChange={(e) => setNewEmp({...newEmp, bio: e.target.value})}
                  className="w-full p-2.5 bg-stone-50 border border-stone-300 rounded-xl text-stone-900"
                  placeholder="Professional bio..."
                ></textarea>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-stone-100">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2.5 bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2.5 bg-[#881337] hover:bg-[#991B1B] text-white font-bold rounded-xl shadow-md shadow-rose-950/20"
                >
                  Create Employee
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Generate Salary Slip Modal with Calendar & Leave Deduction Calculation */}
      {showSlipModal && (
        <div className="fixed inset-0 bg-stone-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-stone-200 rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-bold text-stone-900 border-b border-stone-100 pb-3">Generate Salary Slip (Calendar Deductions Enabled)</h3>

            <form onSubmit={handleGenerateSlipSubmit} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-stone-700 font-bold mb-1">Select Employee</label>
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
                  className="w-full p-2.5 bg-stone-50 border border-stone-300 text-stone-900 rounded-xl font-medium"
                >
                  <option value="">-- Choose Employee --</option>
                  {employees.map(e => (
                    <option key={e.id} value={e.id}>
                      {e.full_name} ({e.employee_id} • Shift: {e.scheduled_login_time})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-stone-700 font-bold mb-1">Pay Month</label>
                  <select
                    value={slipForm.month}
                    onChange={(e) => setSlipForm({...slipForm, month: e.target.value})}
                    className="w-full p-2.5 bg-stone-50 border border-stone-300 rounded-xl text-stone-900"
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
                  <label className="block text-stone-700 font-bold mb-1">Pay Year</label>
                  <input
                    type="number"
                    value={slipForm.year}
                    onChange={(e) => setSlipForm({...slipForm, year: e.target.value})}
                    className="w-full p-2.5 bg-stone-50 border border-stone-300 rounded-xl text-stone-900"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-stone-700 font-bold mb-1">Monthly Basic Salary (INR)</label>
                  <input
                    type="number"
                    required
                    value={slipForm.basic_salary}
                    onChange={(e) => setSlipForm({...slipForm, basic_salary: e.target.value})}
                    className="w-full p-2.5 bg-stone-50 border border-stone-300 rounded-xl text-stone-900 font-bold"
                  />
                </div>
                <div>
                  <label className="block text-stone-700 font-bold mb-1">
                    Leave Days Deducted <span className="text-rose-800 font-semibold">(Absence)</span>
                  </label>
                  <input
                    type="number"
                    step="0.5"
                    value={slipForm.leave_days_deducted}
                    onChange={(e) => setSlipForm({...slipForm, leave_days_deducted: e.target.value})}
                    placeholder="e.g. 1 or 2 days"
                    className="w-full p-2.5 bg-stone-50 border border-stone-300 text-rose-900 rounded-xl text-stone-900 font-bold"
                  />
                </div>
              </div>

              {/* Real-time Calculation Breakdown Box */}
              <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-xl text-xs space-y-1.5">
                <div className="flex items-center gap-1.5 text-rose-900 font-bold text-[11px] mb-1">
                  <Calculator className="w-4 h-4 text-rose-800" />
                  <span>Calendar Rate & Net Salary Live Breakdown</span>
                </div>
                <div className="flex justify-between text-stone-700">
                  <span>Month Days: <strong>30 Days</strong></span>
                  <span>Daily Rate: <strong>₹{calcDailyRate.toFixed(2)}/day</strong></span>
                </div>
                <div className="flex justify-between text-stone-700">
                  <span>Leave Deduction ({calcLeaveDays} day leave):</span>
                  <strong className="text-rose-900">-₹{calcLeaveDeduction.toFixed(2)}</strong>
                </div>
                <div className="flex justify-between text-stone-900 border-t border-rose-200 pt-1 font-bold">
                  <span>Calculated Net Salary:</span>
                  <span className="text-emerald-700 text-sm font-black">₹{calcNetSalary.toFixed(2)}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-stone-700 font-bold mb-1">Allowances (INR)</label>
                  <input
                    type="number"
                    value={slipForm.allowances}
                    onChange={(e) => setSlipForm({...slipForm, allowances: e.target.value})}
                    className="w-full p-2.5 bg-stone-50 border border-stone-300 rounded-xl text-stone-900"
                  />
                </div>
                <div>
                  <label className="block text-stone-700 font-bold mb-1">Deductions (INR)</label>
                  <input
                    type="number"
                    value={slipForm.deductions}
                    onChange={(e) => setSlipForm({...slipForm, deductions: e.target.value})}
                    className="w-full p-2.5 bg-stone-50 border border-stone-300 rounded-xl text-stone-900"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-stone-100">
                <button
                  type="button"
                  onClick={() => setShowSlipModal(false)}
                  className="px-4 py-2.5 bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2.5 bg-[#881337] hover:bg-[#991B1B] text-white font-bold rounded-xl shadow-md shadow-rose-950/20"
                >
                  Generate Payslip
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
