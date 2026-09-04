import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { Users, CalendarDays, Receipt, UserPlus, CheckCircle, XCircle, Clock, Search, Filter, ShieldCheck, DollarSign } from 'lucide-react';

export const AdminDashboard = ({ subTab = 'admin-dashboard' }) => {
  const [employees, setEmployees] = useState([]);
  const [leaves, setLeaves] = useState([]);
  const [slips, setSlips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Modal state for adding employee
  const [showAddModal, setShowAddModal] = useState(false);
  const [newEmp, setNewEmp] = useState({
    username: '',
    email: '',
    first_name: '',
    last_name: '',
    password: 'Employee@123',
    gender: 'MALE',
    role: 'EMPLOYEE',
    employee_id: '',
    designation: 'Software Engineer',
    department: 'Engineering',
    base_salary: '60000',
    bio: ''
  });
  const [addMsg, setAddMsg] = useState('');

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
      await api.post(`/leaves/${id}/approve/`, { admin_notes: 'Approved by Admin' });
      fetchData();
    } catch (err) {
      alert("Failed to approve leave request");
    }
  };

  const handleRejectLeave = async (id) => {
    try {
      await api.post(`/leaves/${id}/reject/`, { admin_notes: 'Rejected by Admin' });
      fetchData();
    } catch (err) {
      alert("Failed to reject leave request");
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
      setAddMsg(err.response?.data?.detail || 'Error creating employee. Check unique fields.');
    }
  };

  const handleGenerateSlipSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/payroll/slips/', slipForm);
      setShowSlipModal(false);
      fetchData();
    } catch (err) {
      alert(err.response?.data?.detail || 'Error generating salary slip. Check if already generated for this month.');
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
      <div className="p-8 text-center text-slate-500 flex flex-col items-center justify-center min-h-[400px]">
        <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-3"></div>
        <span>Loading Admin Control Panel...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 text-white rounded-2xl p-6 shadow-xl border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-blue-400 text-xs font-semibold uppercase tracking-wider mb-1">
            <ShieldCheck className="w-4 h-4" />
            <span>Administrative Command Center</span>
          </div>
          <h1 className="text-2xl font-extrabold tracking-tight">Dahera Groups Executive Dashboard</h1>
          <p className="text-slate-300 text-sm mt-1">Full management oversight across staff bio, gender shift schedules, leaves & payroll.</p>
        </div>
        
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowAddModal(true)}
            className="bg-blue-600 hover:bg-blue-500 text-white font-medium px-4 py-2.5 rounded-xl text-sm transition-all shadow-lg shadow-blue-600/30 flex items-center gap-2"
          >
            <UserPlus className="w-4 h-4" />
            <span>Add Employee</span>
          </button>
          
          <button
            onClick={() => setShowSlipModal(true)}
            className="bg-emerald-600 hover:bg-emerald-500 text-white font-medium px-4 py-2.5 rounded-xl text-sm transition-all shadow-lg shadow-emerald-600/30 flex items-center gap-2"
          >
            <Receipt className="w-4 h-4" />
            <span>Issue Salary Slip</span>
          </button>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">Total Staff</span>
            <span className="text-2xl font-bold text-slate-900">{totalEmployees}</span>
            <span className="text-xs text-slate-500 block mt-1">
              <strong className="text-blue-600">{maleCount}</strong> Male (10 AM) • <strong className="text-purple-600">{femaleCount}</strong> Female (9:30 AM)
            </span>
          </div>
          <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
            <Users className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">Pending Leaves</span>
            <span className="text-2xl font-bold text-amber-600">{pendingLeaves}</span>
            <span className="text-xs text-slate-500 block mt-1">Requires HR Approval</span>
          </div>
          <div className="p-3 bg-amber-50 text-amber-600 rounded-xl">
            <CalendarDays className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">Monthly Payroll</span>
            <span className="text-2xl font-bold text-emerald-600">₹{totalPayroll.toLocaleString('en-IN')}</span>
            <span className="text-xs text-slate-500 block mt-1">Total Issued Salary Slips</span>
          </div>
          <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
            <DollarSign className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">Shift Rules Active</span>
            <span className="text-sm font-bold text-slate-800">Male: 10:00 AM</span>
            <span className="text-xs text-purple-600 font-semibold block mt-0.5">Female: 9:30 AM</span>
          </div>
          <div className="p-3 bg-purple-50 text-purple-600 rounded-xl">
            <Clock className="w-6 h-6" />
          </div>
        </div>

      </div>

      {/* Main Content Area based on subTab */}
      {(subTab === 'admin-dashboard' || subTab === 'admin-leaves') && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div>
              <h2 className="text-lg font-bold text-slate-900">Leave Requests Approval Queue</h2>
              <p className="text-xs text-slate-500">Review pending employee leave applications.</p>
            </div>
            <span className="px-2.5 py-1 bg-amber-100 text-amber-800 font-semibold text-xs rounded-full">
              {pendingLeaves} Pending Action
            </span>
          </div>

          {leaves.length === 0 ? (
            <p className="text-sm text-slate-500 text-center py-6">No leave requests found.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 text-xs font-bold text-slate-500 uppercase bg-slate-50">
                    <th className="py-3 px-4">Employee</th>
                    <th className="py-3 px-4">Type</th>
                    <th className="py-3 px-4">Duration</th>
                    <th className="py-3 px-4">Reason</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-sm">
                  {leaves.map((l) => (
                    <tr key={l.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3.5 px-4 font-semibold text-slate-800">
                        {l.employee_details?.full_name || 'Employee'}
                        <span className="block text-xs font-normal text-slate-500">{l.employee_details?.employee_id}</span>
                      </td>
                      <td className="py-3.5 px-4 text-xs font-semibold text-slate-700">
                        <span className="px-2 py-1 bg-slate-100 rounded">{l.leave_type}</span>
                      </td>
                      <td className="py-3.5 px-4 text-xs text-slate-600">
                        {l.start_date} to {l.end_date}
                        <span className="block text-[11px] text-slate-400">({l.total_days} days)</span>
                      </td>
                      <td className="py-3.5 px-4 text-xs text-slate-600 max-w-xs truncate">{l.reason}</td>
                      <td className="py-3.5 px-4">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                          l.status === 'APPROVED' ? 'bg-emerald-100 text-emerald-800' :
                          l.status === 'REJECTED' ? 'bg-rose-100 text-rose-800' :
                          'bg-amber-100 text-amber-800'
                        }`}>
                          {l.status}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        {l.status === 'PENDING' ? (
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => handleApproveLeave(l.id)}
                              className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-500 text-white rounded text-xs font-medium flex items-center gap-1 transition-colors"
                            >
                              <CheckCircle className="w-3.5 h-3.5" />
                              <span>Approve</span>
                            </button>
                            <button
                              onClick={() => handleRejectLeave(l.id)}
                              className="px-2.5 py-1 bg-rose-600 hover:bg-rose-500 text-white rounded text-xs font-medium flex items-center gap-1 transition-colors"
                            >
                              <XCircle className="w-3.5 h-3.5" />
                              <span>Reject</span>
                            </button>
                          </div>
                        ) : (
                          <span className="text-xs text-slate-400">Decision Recorded</span>
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

      {/* Employee Directory */}
      {(subTab === 'admin-dashboard' || subTab === 'admin-employees') && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
            <div>
              <h2 className="text-lg font-bold text-slate-900">Dahera Staff & Gender Shift Directory</h2>
              <p className="text-xs text-slate-500">Overview of all active employees and their assigned login schedules.</p>
            </div>
            
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search staff, ID or dept..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9 pr-4 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs w-64 focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200 text-xs font-bold text-slate-500 uppercase bg-slate-50">
                  <th className="py-3 px-4">Employee ID</th>
                  <th className="py-3 px-4">Full Name & Email</th>
                  <th className="py-3 px-4">Gender & Shift Time</th>
                  <th className="py-3 px-4">Designation & Department</th>
                  <th className="py-3 px-4">Base Salary</th>
                  <th className="py-3 px-4">Role</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm">
                {filteredEmployees.map((emp) => (
                  <tr key={emp.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 px-4 font-bold text-blue-600 text-xs">{emp.employee_id || 'N/A'}</td>
                    <td className="py-3.5 px-4">
                      <span className="font-semibold text-slate-900 block">{emp.full_name}</span>
                      <span className="text-xs text-slate-500">{emp.email}</span>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold ${
                        emp.gender === 'FEMALE' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'
                      }`}>
                        <Clock className="w-3 h-3" />
                        {emp.gender} • {emp.scheduled_login_time}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-xs text-slate-700">
                      <span className="font-medium text-slate-800 block">{emp.designation}</span>
                      <span className="text-slate-500">{emp.department}</span>
                    </td>
                    <td className="py-3.5 px-4 font-semibold text-slate-800">
                      ₹{parseFloat(emp.base_salary || 0).toLocaleString('en-IN')}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className={`px-2 py-0.5 text-xs font-bold rounded ${
                        emp.role === 'ADMIN' ? 'bg-indigo-100 text-indigo-800' : 'bg-slate-100 text-slate-700'
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

      {/* Salary Slips Table */}
      {(subTab === 'admin-dashboard' || subTab === 'admin-payroll') && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div>
              <h2 className="text-lg font-bold text-slate-900">Issued Salary Slips</h2>
              <p className="text-xs text-slate-500">Complete log of generated payroll slips.</p>
            </div>
            <button
              onClick={() => setShowSlipModal(true)}
              className="bg-blue-600 hover:bg-blue-500 text-white font-medium px-3 py-1.5 rounded-lg text-xs transition-colors flex items-center gap-1.5"
            >
              <Receipt className="w-3.5 h-3.5" />
              <span>Generate New Slip</span>
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200 text-xs font-bold text-slate-500 uppercase bg-slate-50">
                  <th className="py-3 px-4">Employee</th>
                  <th className="py-3 px-4">Shift Schedule</th>
                  <th className="py-3 px-4">Pay Period</th>
                  <th className="py-3 px-4">Basic Salary</th>
                  <th className="py-3 px-4">Net Salary</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">PDF Download</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm">
                {slips.map((slip) => (
                  <tr key={slip.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 px-4 font-semibold text-slate-800">
                      {slip.employee_details?.full_name}
                      <span className="block text-xs font-normal text-slate-500">{slip.employee_details?.employee_id}</span>
                    </td>
                    <td className="py-3.5 px-4 text-xs font-semibold text-slate-600">
                      {slip.scheduled_login_time}
                    </td>
                    <td className="py-3.5 px-4 text-xs text-slate-700 font-medium">
                      {slip.month_name} {slip.year}
                    </td>
                    <td className="py-3.5 px-4 text-xs text-slate-700">₹{parseFloat(slip.basic_salary).toLocaleString('en-IN')}</td>
                    <td className="py-3.5 px-4 font-bold text-emerald-600">₹{parseFloat(slip.net_salary).toLocaleString('en-IN')}</td>
                    <td className="py-3.5 px-4">
                      <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 text-xs font-bold rounded">
                        {slip.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <a
                        href={`http://127.0.0.1:8000/api/payroll/slips/${slip.id}/download_pdf/`}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1.5 px-3 py-1 bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 rounded text-xs font-semibold transition-colors"
                      >
                        <Receipt className="w-3.5 h-3.5" />
                        <span>Download PDF</span>
                      </a>
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
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-bold text-slate-900 border-b pb-2">Add New Employee</h3>
            
            {addMsg && (
              <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-lg">
                {addMsg}
              </div>
            )}

            <form onSubmit={handleAddEmployeeSubmit} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">First Name</label>
                  <input
                    type="text"
                    required
                    value={newEmp.first_name}
                    onChange={(e) => setNewEmp({...newEmp, first_name: e.target.value})}
                    className="w-full p-2 border border-slate-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Last Name</label>
                  <input
                    type="text"
                    required
                    value={newEmp.last_name}
                    onChange={(e) => setNewEmp({...newEmp, last_name: e.target.value})}
                    className="w-full p-2 border border-slate-300 rounded-lg"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Email / Username</label>
                <input
                  type="email"
                  required
                  value={newEmp.username}
                  onChange={(e) => setNewEmp({...newEmp, username: e.target.value, email: e.target.value})}
                  className="w-full p-2 border border-slate-300 rounded-lg"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Gender (Sets Shift Time)</label>
                  <select
                    value={newEmp.gender}
                    onChange={(e) => setNewEmp({...newEmp, gender: e.target.value})}
                    className="w-full p-2 border border-slate-300 rounded-lg font-bold text-blue-700"
                  >
                    <option value="MALE">MALE (Shift: 10:00 AM)</option>
                    <option value="FEMALE">FEMALE (Shift: 9:30 AM)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Employee ID</label>
                  <input
                    type="text"
                    placeholder="e.g. DEG-105"
                    required
                    value={newEmp.employee_id}
                    onChange={(e) => setNewEmp({...newEmp, employee_id: e.target.value})}
                    className="w-full p-2 border border-slate-300 rounded-lg"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Designation</label>
                  <input
                    type="text"
                    required
                    value={newEmp.designation}
                    onChange={(e) => setNewEmp({...newEmp, designation: e.target.value})}
                    className="w-full p-2 border border-slate-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Base Salary (INR)</label>
                  <input
                    type="number"
                    required
                    value={newEmp.base_salary}
                    onChange={(e) => setNewEmp({...newEmp, base_salary: e.target.value})}
                    className="w-full p-2 border border-slate-300 rounded-lg"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Employee Bio</label>
                <textarea
                  rows="2"
                  value={newEmp.bio}
                  onChange={(e) => setNewEmp({...newEmp, bio: e.target.value})}
                  className="w-full p-2 border border-slate-300 rounded-lg"
                  placeholder="Short professional bio..."
                ></textarea>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-lg"
                >
                  Save Employee
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Generate Salary Slip Modal */}
      {showSlipModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <h3 className="text-lg font-bold text-slate-900 border-b pb-2">Generate Salary Slip</h3>

            <form onSubmit={handleGenerateSlipSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Select Employee</label>
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
                  className="w-full p-2 border border-slate-300 rounded-lg font-medium"
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
                  <label className="block text-slate-700 font-semibold mb-1">Month</label>
                  <select
                    value={slipForm.month}
                    onChange={(e) => setSlipForm({...slipForm, month: e.target.value})}
                    className="w-full p-2 border border-slate-300 rounded-lg"
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
                  <label className="block text-slate-700 font-semibold mb-1">Year</label>
                  <input
                    type="number"
                    value={slipForm.year}
                    onChange={(e) => setSlipForm({...slipForm, year: e.target.value})}
                    className="w-full p-2 border border-slate-300 rounded-lg"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Basic Salary (INR)</label>
                <input
                  type="number"
                  required
                  value={slipForm.basic_salary}
                  onChange={(e) => setSlipForm({...slipForm, basic_salary: e.target.value})}
                  className="w-full p-2 border border-slate-300 rounded-lg"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Allowances (INR)</label>
                  <input
                    type="number"
                    value={slipForm.allowances}
                    onChange={(e) => setSlipForm({...slipForm, allowances: e.target.value})}
                    className="w-full p-2 border border-slate-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Deductions (INR)</label>
                  <input
                    type="number"
                    value={slipForm.deductions}
                    onChange={(e) => setSlipForm({...slipForm, deductions: e.target.value})}
                    className="w-full p-2 border border-slate-300 rounded-lg"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowSlipModal(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold rounded-lg"
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
