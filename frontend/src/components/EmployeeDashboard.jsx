import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { Clock, UserCheck, CalendarDays, Receipt, Download, CheckCircle, AlertTriangle, ShieldCheck, User, Sparkles, Send } from 'lucide-react';

export const EmployeeDashboard = ({ subTab = 'dashboard' }) => {
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

  const isMale = user?.gender === 'MALE';
  const scheduledTime = user?.scheduled_login_time || (isMale ? '10:00 AM' : '09:30 AM');

  if (loading) {
    return (
      <div className="p-8 text-center text-slate-500 flex flex-col items-center justify-center min-h-[400px]">
        <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-3"></div>
        <span>Loading Employee Portal...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">

      {/* Employee Header & Bio Card */}
      {(subTab === 'dashboard' || subTab === 'all') && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          
          {/* Top Banner */}
          <div className={`p-6 text-white ${
            isMale ? 'bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900' : 'bg-gradient-to-r from-purple-900 via-pink-900 to-slate-900'
          }`}>
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-2xl bg-white/10 backdrop-blur border border-white/20 flex items-center justify-center text-white font-extrabold text-2xl shadow-inner">
                  {user?.full_name?.charAt(0) || 'E'}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h1 className="text-2xl font-bold">{user?.full_name || user?.username}</h1>
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-white/20 border border-white/30">
                      {user?.gender}
                    </span>
                  </div>
                  <p className="text-slate-300 text-xs mt-0.5">
                    {user?.designation} • {user?.department} • ID: <strong>{user?.employee_id || 'DEG-EMP'}</strong>
                  </p>
                </div>
              </div>

              {/* High-visibility Gender Login Time Requirement Card */}
              <div className="bg-white/10 backdrop-blur border border-white/20 p-4 rounded-xl flex items-center gap-3">
                <Clock className="w-8 h-8 text-yellow-300 animate-pulse" />
                <div>
                  <span className="text-[11px] font-bold tracking-wider uppercase text-slate-200 block">Your Scheduled Shift Login</span>
                  <span className="text-xl font-extrabold text-white tracking-tight">
                    {scheduledTime}
                  </span>
                  <span className="text-[10px] text-slate-300 block">
                    {isMale ? '(Standard Shift: 10:00 AM)' : '(Standard Shift: 9:30 AM)'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Bio Details */}
          <div className="p-6 bg-slate-50/50 border-t border-slate-100 grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            <div className="bg-white p-3.5 rounded-xl border border-slate-200/80">
              <span className="text-slate-400 font-semibold uppercase block mb-1">Email Address</span>
              <span className="font-bold text-slate-800">{user?.email}</span>
            </div>
            <div className="bg-white p-3.5 rounded-xl border border-slate-200/80">
              <span className="text-slate-400 font-semibold uppercase block mb-1">Date of Joining</span>
              <span className="font-bold text-slate-800">{user?.date_of_joining || 'Jan 15, 2023'}</span>
            </div>
            <div className="bg-white p-3.5 rounded-xl border border-slate-200/80">
              <span className="text-slate-400 font-semibold uppercase block mb-1">Professional Bio</span>
              <span className="font-medium text-slate-700 leading-relaxed block">{user?.bio || 'Dahera Groups Employee'}</span>
            </div>
          </div>

        </div>
      )}

      {/* Attendance & Check-In / Check-Out Widget */}
      {(subTab === 'dashboard' || subTab === 'attendance') && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Check In / Out Clock Panel */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Attendance Console</span>
                <span className="text-xs font-semibold px-2 py-0.5 bg-blue-50 text-blue-700 rounded-full border border-blue-200">
                  {new Date().toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                </span>
              </div>
              
              <div className="text-center py-4 bg-slate-900 text-white rounded-xl my-2 shadow-inner">
                <span className="text-xs text-blue-400 font-semibold block tracking-wider uppercase">Live Clock</span>
                <span className="text-3xl font-extrabold tracking-tight font-mono">{clockTime}</span>
                <span className="text-[11px] text-slate-400 block mt-1">Expected Login: <strong>{scheduledTime}</strong></span>
              </div>

              {todayAttendance ? (
                <div className="space-y-2 text-xs pt-2">
                  <div className="flex justify-between p-2 bg-slate-50 rounded-lg">
                    <span className="text-slate-500">Check-in:</span>
                    <span className="font-bold text-slate-800">
                      {todayAttendance.check_in ? new Date(todayAttendance.check_in).toLocaleTimeString() : 'Not Checked In'}
                    </span>
                  </div>
                  <div className="flex justify-between p-2 bg-slate-50 rounded-lg">
                    <span className="text-slate-500">Check-out:</span>
                    <span className="font-bold text-slate-800">
                      {todayAttendance.check_out ? new Date(todayAttendance.check_out).toLocaleTimeString() : 'Pending Check-Out'}
                    </span>
                  </div>
                  <div className="flex justify-between p-2 bg-slate-50 rounded-lg">
                    <span className="text-slate-500">Status:</span>
                    <span className={`font-bold px-2 py-0.5 rounded text-[11px] ${
                      todayAttendance.status === 'LATE' ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-800'
                    }`}>
                      {todayAttendance.status}
                    </span>
                  </div>
                </div>
              ) : (
                <p className="text-xs text-slate-500 text-center py-2">You haven't checked in yet today.</p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-3 pt-2">
              <button
                onClick={handleCheckIn}
                disabled={todayAttendance?.check_in}
                className="w-full bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 text-white font-bold py-2.5 rounded-xl text-xs transition-all shadow-md shadow-emerald-600/20 flex items-center justify-center gap-1.5"
              >
                <UserCheck className="w-4 h-4" />
                <span>Check In</span>
              </button>

              <button
                onClick={handleCheckOut}
                disabled={!todayAttendance?.check_in || todayAttendance?.check_out}
                className="w-full bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-white font-bold py-2.5 rounded-xl text-xs transition-all shadow-md flex items-center justify-center gap-1.5"
              >
                <Clock className="w-4 h-4" />
                <span>Check Out</span>
              </button>
            </div>
          </div>

          {/* Attendance Log Table */}
          <div className="md:col-span-2 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <h2 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3">My Recent Attendance Records</h2>
            
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 text-xs font-bold text-slate-500 uppercase bg-slate-50">
                    <th className="py-2.5 px-3">Date</th>
                    <th className="py-2.5 px-3">Scheduled Shift</th>
                    <th className="py-2.5 px-3">Check In</th>
                    <th className="py-2.5 px-3">Check Out</th>
                    <th className="py-2.5 px-3">Status</th>
                    <th className="py-2.5 px-3">Working Hrs</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs">
                  {attendanceLogs.length === 0 ? (
                    <tr><td colSpan="6" className="py-4 text-center text-slate-400">No attendance logs available.</td></tr>
                  ) : (
                    attendanceLogs.map((log) => (
                      <tr key={log.id} className="hover:bg-slate-50">
                        <td className="py-2.5 px-3 font-semibold text-slate-800">{log.date}</td>
                        <td className="py-2.5 px-3 font-bold text-blue-600">{log.expected_login_time}</td>
                        <td className="py-2.5 px-3 text-slate-700">
                          {log.check_in ? new Date(log.check_in).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : '-'}
                        </td>
                        <td className="py-2.5 px-3 text-slate-700">
                          {log.check_out ? new Date(log.check_out).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : '-'}
                        </td>
                        <td className="py-2.5 px-3">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            log.status === 'LATE' ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-800'
                          }`}>
                            {log.status}
                          </span>
                        </td>
                        <td className="py-2.5 px-3 font-medium text-slate-700">{log.working_hours} hrs</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      )}

      {/* Leave Application & History Portal */}
      {(subTab === 'dashboard' || subTab === 'leaves') && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Leave Application Form */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <div>
              <h2 className="text-base font-bold text-slate-900">Apply for Leave</h2>
              <p className="text-xs text-slate-500">Submit leave request for HR review.</p>
            </div>

            {leaveMsg && (
              <div className="p-3 bg-blue-50 border border-blue-200 text-blue-700 text-xs rounded-lg font-medium">
                {leaveMsg}
              </div>
            )}

            <form onSubmit={handleLeaveSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Leave Type</label>
                <select
                  value={leaveForm.leave_type}
                  onChange={(e) => setLeaveForm({...leaveForm, leave_type: e.target.value})}
                  className="w-full p-2.5 border border-slate-300 rounded-lg text-xs"
                >
                  <option value="CASUAL">Casual Leave</option>
                  <option value="SICK">Sick Leave</option>
                  <option value="PAID">Paid Leave</option>
                  <option value="UNPAID">Unpaid Leave</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Start Date</label>
                  <input
                    type="date"
                    required
                    value={leaveForm.start_date}
                    onChange={(e) => setLeaveForm({...leaveForm, start_date: e.target.value})}
                    className="w-full p-2 border border-slate-300 rounded-lg text-xs"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">End Date</label>
                  <input
                    type="date"
                    required
                    value={leaveForm.end_date}
                    onChange={(e) => setLeaveForm({...leaveForm, end_date: e.target.value})}
                    className="w-full p-2 border border-slate-300 rounded-lg text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Reason for Leave</label>
                <textarea
                  rows="3"
                  required
                  placeholder="Detailed explanation..."
                  value={leaveForm.reason}
                  onChange={(e) => setLeaveForm({...leaveForm, reason: e.target.value})}
                  className="w-full p-2.5 border border-slate-300 rounded-lg text-xs"
                ></textarea>
              </div>

              <button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-2.5 rounded-xl text-xs transition-all shadow-md shadow-blue-600/20 flex items-center justify-center gap-2"
              >
                <Send className="w-4 h-4" />
                <span>Submit Leave Request</span>
              </button>
            </form>
          </div>

          {/* Leave History List */}
          <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <h2 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3">My Leave Application History</h2>
            
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 text-xs font-bold text-slate-500 uppercase bg-slate-50">
                    <th className="py-2.5 px-3">Type</th>
                    <th className="py-2.5 px-3">Dates</th>
                    <th className="py-2.5 px-3">Reason</th>
                    <th className="py-2.5 px-3">Status</th>
                    <th className="py-2.5 px-3">Admin Remarks</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs">
                  {leaveRequests.length === 0 ? (
                    <tr><td colSpan="5" className="py-4 text-center text-slate-400">No leave applications submitted yet.</td></tr>
                  ) : (
                    leaveRequests.map((req) => (
                      <tr key={req.id} className="hover:bg-slate-50">
                        <td className="py-2.5 px-3 font-semibold text-slate-800">{req.leave_type}</td>
                        <td className="py-2.5 px-3 text-slate-600">
                          {req.start_date} to {req.end_date}
                          <span className="block text-[10px] text-slate-400">({req.total_days} days)</span>
                        </td>
                        <td className="py-2.5 px-3 text-slate-600 max-w-xs truncate">{req.reason}</td>
                        <td className="py-2.5 px-3">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            req.status === 'APPROVED' ? 'bg-emerald-100 text-emerald-800' :
                            req.status === 'REJECTED' ? 'bg-rose-100 text-rose-800' :
                            'bg-amber-100 text-amber-800'
                          }`}>
                            {req.status}
                          </span>
                        </td>
                        <td className="py-2.5 px-3 text-slate-500 italic">{req.admin_notes || '-'}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      )}

      {/* Salary Slips & Mobile/Desktop Download Portal */}
      {(subTab === 'dashboard' || subTab === 'payroll') && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
            <div>
              <h2 className="text-lg font-bold text-slate-900">My Salary Slips</h2>
              <p className="text-xs text-slate-500">View earnings breakdown and download official PDF payslips (Desktop & Mobile ready).</p>
            </div>
            <span className="text-xs font-semibold px-3 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-full w-fit">
              Payroll Verified
            </span>
          </div>

          {salarySlips.length === 0 ? (
            <p className="text-sm text-slate-500 text-center py-6">No salary slips issued yet.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {salarySlips.map((slip) => (
                <div key={slip.id} className="bg-slate-50 p-5 rounded-2xl border border-slate-200/80 space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-base font-bold text-slate-900 block">{slip.month_name} {slip.year} Payslip</span>
                      <span className="text-xs text-slate-500">Scheduled Login: <strong>{scheduledTime}</strong></span>
                    </div>
                    <span className="px-2.5 py-0.5 bg-emerald-100 text-emerald-800 text-xs font-bold rounded-full">
                      {slip.status}
                    </span>
                  </div>

                  <div className="grid grid-cols-3 gap-2 bg-white p-3 rounded-xl border border-slate-200 text-xs">
                    <div>
                      <span className="text-slate-400 block text-[10px]">BASIC</span>
                      <span className="font-semibold text-slate-800">₹{parseFloat(slip.basic_salary).toLocaleString('en-IN')}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px]">ALLOWANCES</span>
                      <span className="font-semibold text-slate-800">₹{parseFloat(slip.allowances).toLocaleString('en-IN')}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px]">NET SALARY</span>
                      <span className="font-bold text-emerald-600">₹{parseFloat(slip.net_salary).toLocaleString('en-IN')}</span>
                    </div>
                  </div>

                  <div className="pt-1 flex items-center justify-between">
                    <span className="text-[11px] text-slate-400">Generated on: {new Date(slip.generated_at).toLocaleDateString()}</span>
                    <a
                      href={`http://127.0.0.1:8000/api/payroll/slips/${slip.id}/download_pdf/`}
                      target="_blank"
                      rel="noreferrer"
                      className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl text-xs transition-all shadow-md shadow-blue-600/20 flex items-center gap-1.5"
                    >
                      <Download className="w-4 h-4" />
                      <span>Download PDF</span>
                    </a>
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
