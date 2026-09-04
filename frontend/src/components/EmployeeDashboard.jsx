import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { Clock, UserCheck, CalendarDays, Receipt, Download, Send, Lock, KeyRound, CheckCircle, ShieldCheck } from 'lucide-react';

export const EmployeeDashboard = ({ subTab = 'dashboard', darkMode = false }) => {
  const { user } = useAuth();

  // Attendance state
  const [todayAttendance, setTodayAttendance] = useState(null);
  const [attendanceLogs, setAttendanceLogs] = useState([]);
  const [clockTime, setClockTime] = useState(new Date().toLocaleTimeString());

  // Leave state
  const [leaveRequests, setLeaveRequests] = useState([]);
  const [leaveForm, setLeaveForm] = useState({
    leave_type: 'CASUAL',
    start_date: '',
    end_date: '',
    reason: ''
  });
  const [leaveMsg, setLeaveMsg] = useState('');

  // Salary slip state
  const [salarySlips, setSalarySlips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [downloadingId, setDownloadingId] = useState(null);

  // Change Password state
  const [passForm, setPassForm] = useState({ old_password: '', new_password: '' });
  const [passMsg, setPassMsg] = useState('');
  const [passError, setPassError] = useState('');
  const [passLoading, setPassLoading] = useState(false);

  // Live Clock Effect
  useEffect(() => {
    const timer = setInterval(() => setClockTime(new Date().toLocaleTimeString()), 1000);
    return () => clearInterval(timer);
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [todayRes, logsRes, leavesRes, slipsRes] = await Promise.all([
        api.get('/attendance/today/'),
        api.get('/attendance/logs/'),
        api.get('/leaves/'),
        api.get('/payroll/slips/')
      ]);
      setTodayAttendance(todayRes.data.attendance);
      setAttendanceLogs(logsRes.data.results || logsRes.data);
      setLeaveRequests(leavesRes.data.results || leavesRes.data);
      setSalarySlips(slipsRes.data.results || slipsRes.data);
    } catch (err) {
      console.error("Employee dashboard error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleCheckIn = async () => {
    try {
      await api.post('/attendance/check-in/');
      fetchData();
    } catch (err) {
      alert(err.response?.data?.detail || 'Check-in failed.');
    }
  };

  const handleCheckOut = async () => {
    try {
      await api.post('/attendance/check-out/');
      fetchData();
    } catch (err) {
      alert(err.response?.data?.detail || 'Check-out failed.');
    }
  };

  const handleLeaveSubmit = async (e) => {
    e.preventDefault();
    setLeaveMsg('');
    try {
      await api.post('/leaves/', leaveForm);
      setLeaveForm({ leave_type: 'CASUAL', start_date: '', end_date: '', reason: '' });
      setLeaveMsg('Leave application submitted successfully!');
      fetchData();
    } catch (err) {
      setLeaveMsg(err.response?.data?.detail || 'Error submitting leave request.');
    }
  };

  const handleChangePasswordSubmit = async (e) => {
    e.preventDefault();
    setPassMsg('');
    setPassError('');
    setPassLoading(true);
    try {
      const res = await api.post('/users/change-password/', passForm);
      setPassMsg(res.data.message || 'Password changed successfully!');
      setPassForm({ old_password: '', new_password: '' });
    } catch (err) {
      setPassError(err.response?.data?.detail || 'Error changing password. Verify current password.');
    } finally {
      setPassLoading(false);
    }
  };

  // Blob PDF Download
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
      link.setAttribute('download', `Thahira_Salary_Slip_${employeeId || 'EMP'}_${monthName}_${year}.pdf`);
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

  const isMale = user?.gender === 'MALE';
  const scheduledTime = user?.scheduled_login_time || (isMale ? '10:00 AM' : '09:30 AM');

  if (loading) {
    return (
      <div className="p-8 text-center flex flex-col items-center justify-center min-h-[400px]">
        <div className="w-8 h-8 border-4 border-rose-900 border-t-transparent rounded-full animate-spin mb-3"></div>
        <span className={darkMode ? 'text-stone-400' : 'text-stone-500'}>Loading Thahira Employee Portal...</span>
      </div>
    );
  }

  const cardBg = darkMode ? 'bg-stone-900 border-stone-800 text-white' : 'bg-white border-stone-200 text-stone-900';
  const innerBg = darkMode ? 'bg-stone-950 border-stone-800' : 'bg-stone-50 border-stone-200';
  const textMuted = darkMode ? 'text-stone-400' : 'text-stone-500';

  return (
    <div className="space-y-6 font-['Plus_Jakarta_Sans',sans-serif]">

      {/* Employee Bio Card & Password Change Option */}
      {(subTab === 'dashboard' || subTab === 'all') && (
        <div className={`rounded-3xl border shadow-sm overflow-hidden ${cardBg}`}>
          
          {/* Top Banner */}
          <div className="p-6 md:p-8 bg-gradient-to-r from-[#4C0519] via-[#881337] to-[#991B1B] text-white">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-2xl bg-white/10 backdrop-blur border border-white/20 text-white flex items-center justify-center font-black text-2xl shadow-lg">
                  {user?.full_name?.charAt(0) || 'T'}
                </div>
                <div>
                  <div className="flex items-center gap-2.5">
                    <h1 className="text-2xl font-black text-white">{user?.full_name || user?.username}</h1>
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-white/10 border border-white/20 text-rose-200">
                      {user?.gender}
                    </span>
                  </div>
                  <p className="text-rose-100 text-xs mt-1">
                    {user?.designation} • {user?.department} • ID: <strong className="text-white font-mono">{user?.employee_id || 'THG-EMP'}</strong>
                  </p>
                </div>
              </div>

              {/* Shift Schedule Banner */}
              <div className="bg-black/20 backdrop-blur border border-white/20 p-4 rounded-2xl flex items-center gap-4">
                <div className="p-3 bg-white/10 rounded-xl text-rose-200">
                  <Clock className="w-7 h-7" />
                </div>
                <div>
                  <span className="text-[10px] font-bold tracking-wider uppercase text-rose-200 block">Scheduled Shift Login</span>
                  <span className="text-2xl font-black text-white tracking-tight">
                    {scheduledTime}
                  </span>
                  <span className="text-[10px] text-rose-200 font-semibold block">
                    {isMale ? 'Shift Schedule: 10:00 AM' : 'Shift Schedule: 9:30 AM'}
                  </span>
                </div>
              </div>

            </div>
          </div>

          {/* Bio Grid */}
          <div className={`p-6 grid grid-cols-1 md:grid-cols-3 gap-4 text-xs border-t ${darkMode ? 'bg-stone-950 border-stone-800' : 'bg-stone-50/60 border-stone-100'}`}>
            <div className={`p-4 rounded-2xl border ${cardBg}`}>
              <span className={`${textMuted} font-bold uppercase block mb-1`}>Email Address</span>
              <span className="font-bold text-sm">{user?.email}</span>
            </div>
            <div className={`p-4 rounded-2xl border ${cardBg}`}>
              <span className={`${textMuted} font-bold uppercase block mb-1`}>Date of Joining</span>
              <span className="font-bold text-sm">{user?.date_of_joining || 'Jan 15, 2023'}</span>
            </div>
            <div className={`p-4 rounded-2xl border ${cardBg}`}>
              <span className={`${textMuted} font-bold uppercase block mb-1`}>Professional Bio</span>
              <span className="font-medium leading-relaxed block">{user?.bio || 'Thahira Groups Employee'}</span>
            </div>
          </div>

        </div>
      )}

      {/* Change Password Portal Section */}
      {(subTab === 'dashboard' || subTab === 'all') && (
        <div className={`p-6 rounded-3xl border shadow-sm space-y-4 ${cardBg}`}>
          <div className="flex items-center gap-2 border-b pb-3 border-stone-200">
            <KeyRound className="w-5 h-5 text-rose-800" />
            <div>
              <h2 className="text-base font-bold">Change Portal Password</h2>
              <p className={`text-xs ${textMuted}`}>Update your password from your initial Mobile Number password.</p>
            </div>
          </div>

          {passMsg && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-xl font-bold flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-emerald-600" />
              <span>{passMsg}</span>
            </div>
          )}

          {passError && (
            <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 text-xs rounded-xl font-bold">
              {passError}
            </div>
          )}

          <form onSubmit={handleChangePasswordSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
            <div>
              <label className="block font-bold mb-1">Current Password (Mobile Number)</label>
              <input
                type="password"
                required
                value={passForm.old_password}
                onChange={(e) => setPassForm({...passForm, old_password: e.target.value})}
                placeholder="Current password"
                className={`w-full p-2.5 rounded-xl border ${innerBg}`}
              />
            </div>
            <div>
              <label className="block font-bold mb-1">New Password</label>
              <input
                type="password"
                required
                value={passForm.new_password}
                onChange={(e) => setPassForm({...passForm, new_password: e.target.value})}
                placeholder="New password"
                className={`w-full p-2.5 rounded-xl border ${innerBg}`}
              />
            </div>
            <div className="flex items-end">
              <button
                type="submit"
                disabled={passLoading}
                className="w-full bg-[#881337] hover:bg-[#991B1B] text-white font-bold py-2.5 px-4 rounded-xl text-xs transition-all shadow-md flex items-center justify-center gap-2 disabled:opacity-50"
              >
                <Lock className="w-4 h-4" />
                <span>{passLoading ? 'Updating...' : 'Update Password'}</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Attendance Console */}
      {(subTab === 'dashboard' || subTab === 'attendance') && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Check In / Out Console */}
          <div className={`p-6 rounded-3xl border shadow-sm flex flex-col justify-between space-y-4 ${cardBg}`}>
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className={`text-xs font-bold uppercase tracking-wider ${textMuted}`}>Attendance Console</span>
                <span className="text-xs font-bold px-2.5 py-0.5 bg-rose-50 text-rose-900 border border-rose-200 rounded-full">
                  {new Date().toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                </span>
              </div>
              
              <div className="text-center py-5 bg-[#881337] text-white rounded-2xl my-2 shadow-lg shadow-rose-950/20">
                <span className="text-xs text-rose-200 font-bold tracking-wider uppercase block">Live Clock</span>
                <span className="text-3xl font-black font-mono text-white tracking-tight">{clockTime}</span>
                <span className="text-[11px] text-rose-100 block mt-1">Scheduled Shift: <strong className="text-white">{scheduledTime}</strong></span>
              </div>

              {todayAttendance ? (
                <div className="space-y-2 text-xs pt-2">
                  <div className={`flex justify-between p-2.5 rounded-xl border ${innerBg}`}>
                    <span className={textMuted}>Check-in:</span>
                    <span className="font-bold">
                      {todayAttendance.check_in ? new Date(todayAttendance.check_in).toLocaleTimeString() : 'Not Checked In'}
                    </span>
                  </div>
                  <div className={`flex justify-between p-2.5 rounded-xl border ${innerBg}`}>
                    <span className={textMuted}>Check-out:</span>
                    <span className="font-bold">
                      {todayAttendance.check_out ? new Date(todayAttendance.check_out).toLocaleTimeString() : 'Pending Check-Out'}
                    </span>
                  </div>
                  <div className={`flex justify-between p-2.5 rounded-xl border ${innerBg}`}>
                    <span className={textMuted}>Arrival Status:</span>
                    <span className={`font-bold px-2 py-0.5 rounded text-[11px] ${
                      todayAttendance.status === 'LATE' ? 'bg-amber-100 text-amber-800 border border-amber-200' : 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                    }`}>
                      {todayAttendance.status}
                    </span>
                  </div>
                </div>
              ) : (
                <p className={`text-xs text-center py-2 ${textMuted}`}>No check-in record for today yet.</p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-3 pt-2">
              <button
                onClick={handleCheckIn}
                disabled={todayAttendance?.check_in}
                className="w-full bg-emerald-600 hover:bg-emerald-500 disabled:opacity-30 text-white font-bold py-3 rounded-xl text-xs transition-all shadow-md flex items-center justify-center gap-1.5"
              >
                <UserCheck className="w-4 h-4" />
                <span>Check In</span>
              </button>

              <button
                onClick={handleCheckOut}
                disabled={!todayAttendance?.check_in || todayAttendance?.check_out}
                className="w-full bg-stone-800 hover:bg-stone-700 disabled:opacity-30 text-white font-bold py-3 rounded-xl text-xs transition-all shadow-md flex items-center justify-center gap-1.5"
              >
                <Clock className="w-4 h-4" />
                <span>Check Out</span>
              </button>
            </div>
          </div>

          {/* Attendance Log History */}
          <div className={`md:col-span-2 p-6 rounded-3xl border shadow-sm space-y-4 ${cardBg}`}>
            <h2 className="text-base font-bold border-b border-stone-100 pb-3">My Attendance Log History</h2>
            
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className={`border-b text-[11px] font-bold uppercase ${darkMode ? 'border-stone-800 text-stone-400 bg-stone-950' : 'border-stone-200 text-stone-500 bg-stone-50'}`}>
                    <th className="py-3 px-3">Date</th>
                    <th className="py-3 px-3">Scheduled Shift</th>
                    <th className="py-3 px-3">Check In</th>
                    <th className="py-3 px-3">Check Out</th>
                    <th className="py-3 px-3">Status</th>
                    <th className="py-3 px-3">Working Hrs</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100 text-xs">
                  {attendanceLogs.length === 0 ? (
                    <tr><td colSpan="6" className={`py-4 text-center ${textMuted}`}>No attendance logs recorded.</td></tr>
                  ) : (
                    attendanceLogs.map((log) => (
                      <tr key={log.id} className="hover:bg-stone-50/80 transition-colors">
                        <td className="py-3 px-3 font-semibold">{log.date}</td>
                        <td className="py-3 px-3 font-bold text-rose-900">{log.expected_login_time}</td>
                        <td className="py-3 px-3">
                          {log.check_in ? new Date(log.check_in).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : '-'}
                        </td>
                        <td className="py-3 px-3">
                          {log.check_out ? new Date(log.check_out).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : '-'}
                        </td>
                        <td className="py-3 px-3">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            log.status === 'LATE' ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-800'
                          }`}>
                            {log.status}
                          </span>
                        </td>
                        <td className="py-3 px-3 font-medium">{log.working_hours} hrs</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      )}

      {/* Leave Application Portal */}
      {(subTab === 'dashboard' || subTab === 'leaves') && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Apply Form */}
          <div className={`p-6 rounded-3xl border shadow-sm space-y-4 ${cardBg}`}>
            <div>
              <h2 className="text-base font-bold">Apply for Leave</h2>
              <p className={`text-xs mt-0.5 ${textMuted}`}>Submit request for HR administrator review.</p>
            </div>

            {leaveMsg && (
              <div className="p-3 bg-rose-50 border border-rose-200 text-rose-900 text-xs rounded-xl font-medium">
                {leaveMsg}
              </div>
            )}

            <form onSubmit={handleLeaveSubmit} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-bold mb-1">Leave Type</label>
                <select
                  value={leaveForm.leave_type}
                  onChange={(e) => setLeaveForm({...leaveForm, leave_type: e.target.value})}
                  className={`w-full p-2.5 rounded-xl border ${innerBg}`}
                >
                  <option value="CASUAL">Casual Leave</option>
                  <option value="SICK">Sick Leave</option>
                  <option value="PAID">Paid Leave</option>
                  <option value="UNPAID">Unpaid Leave</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-bold mb-1">Start Date</label>
                  <input
                    type="date"
                    required
                    value={leaveForm.start_date}
                    onChange={(e) => setLeaveForm({...leaveForm, start_date: e.target.value})}
                    className={`w-full p-2 rounded-xl border ${innerBg}`}
                  />
                </div>
                <div>
                  <label className="block font-bold mb-1">End Date</label>
                  <input
                    type="date"
                    required
                    value={leaveForm.end_date}
                    onChange={(e) => setLeaveForm({...leaveForm, end_date: e.target.value})}
                    className={`w-full p-2 rounded-xl border ${innerBg}`}
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold mb-1">Reason for Leave</label>
                <textarea
                  rows="3"
                  required
                  placeholder="Detailed explanation..."
                  value={leaveForm.reason}
                  onChange={(e) => setLeaveForm({...leaveForm, reason: e.target.value})}
                  className={`w-full p-2.5 rounded-xl border ${innerBg}`}
                ></textarea>
              </div>

              <button
                type="submit"
                className="w-full bg-[#881337] hover:bg-[#991B1B] text-white font-bold py-3 rounded-xl text-xs transition-all shadow-md flex items-center justify-center gap-2"
              >
                <Send className="w-4 h-4" />
                <span>Submit Leave Request</span>
              </button>
            </form>
          </div>

          {/* Leave History Table */}
          <div className={`lg:col-span-2 p-6 rounded-3xl border shadow-sm space-y-4 ${cardBg}`}>
            <h2 className="text-base font-bold border-b border-stone-100 pb-3">My Leave Application History</h2>
            
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className={`border-b text-[11px] font-bold uppercase ${darkMode ? 'border-stone-800 text-stone-400 bg-stone-950' : 'border-stone-200 text-stone-500 bg-stone-50'}`}>
                    <th className="py-3 px-3">Type</th>
                    <th className="py-3 px-3">Dates</th>
                    <th className="py-3 px-3">Reason</th>
                    <th className="py-3 px-3">Status</th>
                    <th className="py-3 px-3">Admin Remarks</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100 text-xs">
                  {leaveRequests.length === 0 ? (
                    <tr><td colSpan="5" className={`py-4 text-center ${textMuted}`}>No leave applications submitted yet.</td></tr>
                  ) : (
                    leaveRequests.map((req) => (
                      <tr key={req.id} className="hover:bg-stone-50/80 transition-colors">
                        <td className="py-3 px-3 font-semibold">{req.leave_type}</td>
                        <td className="py-3 px-3">
                          {req.start_date} to {req.end_date}
                          <span className={`block text-[10px] ${textMuted}`}>({req.total_days} days)</span>
                        </td>
                        <td className="py-3 px-3 max-w-xs truncate">{req.reason}</td>
                        <td className="py-3 px-3">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            req.status === 'APPROVED' ? 'bg-emerald-100 text-emerald-800' :
                            req.status === 'REJECTED' ? 'bg-rose-100 text-rose-800' :
                            'bg-amber-100 text-amber-800'
                          }`}>
                            {req.status}
                          </span>
                        </td>
                        <td className="py-3 px-3 italic">{req.admin_notes || '-'}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      )}

      {/* Salary Slips & PDF Download Portal */}
      {(subTab === 'dashboard' || subTab === 'payroll') && (
        <div className={`rounded-3xl border shadow-sm p-6 space-y-4 ${cardBg}`}>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-stone-100 pb-3">
            <div>
              <h2 className="text-lg font-bold">My Salary Slips</h2>
              <p className={`text-xs mt-0.5 ${textMuted}`}>Official earnings statements with 1-click verified PDF download (Mobile & Desktop ready).</p>
            </div>
            <span className="text-xs font-bold px-3 py-1 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-full w-fit">
              Payroll Verified
            </span>
          </div>

          {salarySlips.length === 0 ? (
            <p className={`text-sm text-center py-6 ${textMuted}`}>No salary slips generated yet.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {salarySlips.map((slip) => (
                <div key={slip.id} className={`p-5 rounded-2xl border space-y-3 ${innerBg}`}>
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-base font-bold block">{slip.month_name} {slip.year} Payslip</span>
                      <span className={`text-xs ${textMuted}`}>Scheduled Shift: <strong className="text-rose-900">{scheduledTime}</strong></span>
                    </div>
                    <span className="px-2.5 py-0.5 bg-emerald-100 text-emerald-800 text-xs font-bold rounded-full">
                      {slip.status}
                    </span>
                  </div>

                  <div className={`grid grid-cols-3 gap-2 p-3 rounded-xl border text-xs ${cardBg}`}>
                    <div>
                      <span className={`block text-[10px] ${textMuted}`}>BASIC</span>
                      <span className="font-semibold">₹{parseFloat(slip.basic_salary).toLocaleString('en-IN')}</span>
                    </div>
                    <div>
                      <span className={`block text-[10px] ${textMuted}`}>ALLOWANCES</span>
                      <span className="font-semibold">₹{parseFloat(slip.allowances).toLocaleString('en-IN')}</span>
                    </div>
                    <div>
                      <span className={`block text-[10px] ${textMuted}`}>NET PAYABLE</span>
                      <span className="font-bold text-emerald-700">₹{parseFloat(slip.net_salary).toLocaleString('en-IN')}</span>
                    </div>
                  </div>

                  <div className="pt-2 flex items-center justify-between border-t border-stone-200/60">
                    <span className={`text-[11px] ${textMuted}`}>Issued: {new Date(slip.generated_at).toLocaleDateString()}</span>
                    
                    {/* PDF Download Button */}
                    <button
                      type="button"
                      disabled={downloadingId === slip.id}
                      onClick={() => handleDownloadPdf(slip.id, slip.month_name, slip.year, user?.employee_id)}
                      className="px-4 py-2 bg-[#881337] hover:bg-[#991B1B] text-white font-bold rounded-xl text-xs transition-all shadow-md flex items-center gap-2 disabled:opacity-50"
                    >
                      <Download className="w-4 h-4" />
                      <span>{downloadingId === slip.id ? 'Downloading...' : 'Download PDF'}</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

    </div>
  );
};

export default EmployeeDashboard;
