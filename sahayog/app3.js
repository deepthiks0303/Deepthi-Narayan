'use strict';

let emp = {};
let leaves = [];
let reqs = [];
let claims = [];
let punchedIn = false;
let punchTime = '';
window.editProfile = false;

function buildSidebar() {
  const nav = document.getElementById('sidebar-nav');
  if (emp.isAdmin) {
    document.getElementById('portal-title').innerText = 'HR Admin Portal';
    nav.innerHTML = `
      <li class="nav-item active" data-page="dashboard" onclick="navigate('dashboard')"><span class="nav-icon">📊</span><span class="nav-label">Admin Dashboard</span></li>
      <li class="nav-item" data-page="profile" onclick="navigate('profile')"><span class="nav-icon">👤</span><span class="nav-label">My Profile</span></li>
      <li class="nav-item" data-page="manage-users" onclick="navigate('manage-users')"><span class="nav-icon">👥</span><span class="nav-label">Manage Users</span></li>
      <li class="nav-item" data-page="all-approvals" onclick="navigate('all-approvals')"><span class="nav-icon">✅</span><span class="nav-label">All Approvals</span></li>
      <li class="nav-item" data-page="reports" onclick="navigate('reports')"><span class="nav-icon">📈</span><span class="nav-label">System Reports</span></li>
      <div class="sidebar-section-label">Settings</div>
      <li class="nav-item" data-page="settings" onclick="navigate('settings')"><span class="nav-icon">⚙️</span><span class="nav-label">Portal Settings</span></li>
    `;
  } else {
    document.getElementById('portal-title').innerText = 'HR Employee Portal';
    nav.innerHTML = `
      <li class="nav-item active" data-page="dashboard" onclick="navigate('dashboard')"><span class="nav-icon">🏠</span><span class="nav-label">Dashboard</span></li>
      <li class="nav-item" data-page="profile" onclick="navigate('profile')"><span class="nav-icon">👤</span><span class="nav-label">My Profile</span></li>
      <li class="nav-item has-sub" onclick="toggleSub(this)"><span class="nav-icon">🌿</span><span class="nav-label">My Leaves</span><span class="arrow">›</span>
        <ul class="sub-nav"><li onclick="navigate('leaves-apply')">Apply Leave</li><li onclick="navigate('leaves-history')">Leave History</li></ul>
      </li>
      <li class="nav-item has-sub" onclick="toggleSub(this)"><span class="nav-icon">📋</span><span class="nav-label">My Requests</span><span class="arrow">›</span>
        <ul class="sub-nav"><li onclick="navigate('requests-new')">New Request</li><li onclick="navigate('requests-history')">History</li></ul>
      </li>
      <li class="nav-item has-sub" onclick="toggleSub(this)"><span class="nav-icon">💰</span><span class="nav-label">Reimbursements</span><span class="arrow">›</span>
        <ul class="sub-nav"><li onclick="navigate('reimburse-claim')">Claim</li><li onclick="navigate('reimburse-history')">History</li></ul>
      </li>
      <div class="sidebar-section-label">Useful Links</div>
      <li class="nav-item link-item" onclick="navigate('talk-hr')"><span class="nav-icon">💬</span><span class="nav-label">Talk to HR</span></li>
    `;
  }
}

function updateTopbarAvatar(){
  const av = document.getElementById('topbar-avatar');
  if(emp.avatar){
    av.innerHTML=`<img src="${emp.avatar}" style="width:100%;height:100%;border-radius:50%;object-fit:cover;">`;
    av.style.background='none';
  }else{
    av.innerHTML = (emp.name||'User').split(' ').map(n=>n[0]).join('').substring(0,2).toUpperCase();
    av.style.background='linear-gradient(135deg,var(--primary-dark),var(--accent))';
  }
  document.getElementById('topbar-name').innerText=emp.name;
}

window.doLogin = function(){
  const u = document.getElementById('login-email').value;
  const p = document.getElementById('login-pass').value;
  if(!u||!p){alert('Please enter credentials');return;}
  
  const isAdmin = u.toLowerCase().includes('admin');
  const nameStr = u.split('@')[0].replace(/[._-]/g, ' ');
  const formattedName = nameStr.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');

  emp = {
    name: formattedName || 'Employee',
    id: isAdmin ? 'ADM001' : 'EMP' + Math.floor(Math.random()*9000+1000),
    role: isAdmin ? 'HR Administrator' : 'Software Engineer',
    dept: isAdmin ? 'Human Resources' : 'Engineering',
    email: u.includes('@') ? u : u + '@company.com',
    gender: 'Not Specified',
    blood: 'O+',
    company: 'TXPL',
    joined: new Date().toISOString().split('T')[0],
    phone: '+1 234 567 8900',
    location: 'Headquarters',
    manager: isAdmin ? 'CEO' : 'Manager Name',
    avatar: '',
    isAdmin: isAdmin
  };

  leaves = [];
  reqs = [];
  claims = [];
  punchedIn = false;
  punchTime = '';
  window.editProfile = false;

  buildSidebar();
  updateTopbarAvatar();
  
  document.getElementById('login-page').classList.add('hidden');
  document.getElementById('app').classList.remove('hidden');
  navigate('dashboard');
};

window.doLogout = function(){
  document.getElementById('app').classList.add('hidden');
  document.getElementById('login-page').classList.remove('hidden');
  document.getElementById('login-email').value = '';
  document.getElementById('login-pass').value = '';
};

window.toggleSidebar = function(){ document.getElementById('sidebar').classList.toggle('collapsed'); }
window.toggleSub = function(el){ el.classList.toggle('open'); }
window.toggleNotifs = function(){
  document.getElementById('notif-panel').classList.toggle('hidden');
  document.getElementById('notif-badge').style.display='none';
}

window.navigate = function(page){
  document.querySelectorAll('.nav-item').forEach(n=>n.classList.remove('active'));
  const m=document.getElementById('main-content');
  
  let fn;
  if(emp.isAdmin) {
    const adminPages = {
      'dashboard': adminDashPage,
      'profile': profilePage,
      'manage-users': manageUsersPage,
      'all-approvals': allApprovalsPage,
      'reports': reportsPage,
      'settings': settingsPage
    };
    fn = adminPages[page] || adminDashPage;
  } else {
    const userPages = {
      'dashboard': dashPage,
      'profile': profilePage,
      'leaves-apply': leaveApplyPage, 'leaves-history': leaveHistoryPage,
      'requests-new': requestNewPage, 'requests-history': requestHistoryPage,
      'reimburse-claim': reimbursePage, 'reimburse-history': reimburseHistoryPage,
      'talk-hr': talkPage('HR')
    };
    fn = userPages[page] || dashPage;
  }
  
  m.innerHTML = fn();
  document.querySelectorAll(`[data-page="${page}"]`).forEach(n=>n.classList.add('active'));
}

window.doPunchIn = function() {
  punchedIn = true;
  punchTime = new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
  alert('Virtual Punch In successful at ' + punchTime);
  navigate('dashboard');
};

function dashPage(){
  const today=new Date().toDateString();
  const punchBtn = punchedIn 
    ? `<button class="btn-secondary" disabled style="opacity:0.8;cursor:not-allowed">✅ Punched In (${punchTime})</button>`
    : `<button class="btn-primary" onclick="doPunchIn()">👆 Virtual Punch In</button>`;

  return `
  <div class="page-header"><div class="breadcrumb">Home › <span>Dashboard</span></div>
  <div style="display:flex; justify-content:space-between; align-items:center;">
    <div><h1>Welcome back, ${emp.name.split(' ')[0]} 👋</h1><p>Today is ${today}</p></div>
    <div>${punchBtn}</div>
  </div></div>
  <div class="grid-4 mb-4">
    <div class="stat-card"><div class="stat-icon" style="background:rgba(244,114,182,.2);color:var(--primary-dark)">🌿</div><div><div class="stat-val">12</div><div class="stat-label">Leave Balance</div></div></div>
    <div class="stat-card"><div class="stat-icon" style="background:rgba(16,185,129,.2);color:var(--success)">✅</div><div><div class="stat-val">96%</div><div class="stat-label">Attendance</div></div></div>
    <div class="stat-card"><div class="stat-icon" style="background:rgba(245,158,11,.2);color:var(--warning)">⏳</div><div><div class="stat-val">${reqs.length}</div><div class="stat-label">Pending Requests</div></div></div>
    <div class="stat-card"><div class="stat-icon" style="background:rgba(239,68,68,.2);color:var(--danger)">💰</div><div><div class="stat-val">₹${claims.length*100}</div><div class="stat-label">Pending Claims</div></div></div>
  </div>
  <div class="grid-2">
    <div class="card"><div class="card-title">📅 This Week Attendance</div>
    ${['Mon','Tue','Wed','Thu','Fri'].map((d,i)=>`<div class="flex justify-between" style="padding:8px 0;border-bottom:1px solid var(--border)"><span>${d}</span><span style="font-size:12px;color:var(--text2)">Present</span></div>`).join('')}
    </div>
    <div class="card"><div class="card-title">📋 My Recent Activity</div>
    <p style="font-size:13px;color:var(--text3)">${reqs.length===0 && leaves.length===0 ? 'No recent activity.' : 'View history pages for updates.'}</p>
    </div>
  </div>`;
}

function adminDashPage(){
  const today=new Date().toDateString();
  return `
  <div class="page-header"><div class="breadcrumb">Home › <span>Admin Dashboard</span></div>
  <h1>Admin Overview – ${emp.name.split(' ')[0]} 🛡️</h1><p>Today is ${today}</p></div>
  <div class="grid-4 mb-4">
    <div class="stat-card"><div class="stat-icon" style="background:rgba(244,114,182,.2)">👥</div><div><div class="stat-val">142</div><div class="stat-label">Total Employees</div></div></div>
    <div class="stat-card"><div class="stat-icon" style="background:rgba(16,185,129,.2)">✅</div><div><div class="stat-val">12</div><div class="stat-label">Pending Approvals</div></div></div>
    <div class="stat-card"><div class="stat-icon" style="background:rgba(245,158,11,.2)">🏢</div><div><div class="stat-val">4</div><div class="stat-label">Open Positions</div></div></div>
    <div class="stat-card"><div class="stat-icon" style="background:rgba(239,68,68,.2)">⚠️</div><div><div class="stat-val">3</div><div class="stat-label">System Alerts</div></div></div>
  </div>
  <div class="card"><div class="card-title">🚨 Recent Action Items</div>
  <div style="font-size:13px;color:var(--text2);padding:10px 0;border-bottom:1px solid var(--border)">John Doe requested 3 days of Sick Leave.</div>
  <div style="font-size:13px;color:var(--text2);padding:10px 0;border-bottom:1px solid var(--border)">Salary disbursement failed for 2 employees.</div>
  <div style="font-size:13px;color:var(--text2);padding:10px 0;">New hardware request from Engineering team.</div>
  </div>`;
}

function manageUsersPage(){
  return `<div class="page-header"><div class="breadcrumb">Home › <span>Manage Users</span></div><h1>Manage Users</h1></div>
  <div class="card"><div class="flex justify-between mb-4"><input type="text" placeholder="Search employees..." style="padding:8px 12px;border:1px solid var(--border);border-radius:6px;"/><button class="btn-primary">+ Add Employee</button></div>
  <div class="table-wrap"><table><thead><tr><th>Emp ID</th><th>Name</th><th>Role</th><th>Department</th><th>Status</th><th>Action</th></tr></thead>
  <tbody>
    <tr><td>EMP4517</td><td>K S Deepthi Narayan</td><td>Lead Engineer</td><td>Engineering</td><td><span class="status-badge" style="background:rgba(16,185,129,.2);color:#10b981">Active</span></td><td><button class="btn-secondary" style="font-size:11px;padding:4px 8px">Edit</button></td></tr>
    <tr><td>EMP9022</td><td>Rahul Sharma</td><td>QA Tester</td><td>Engineering</td><td><span class="status-badge" style="background:rgba(16,185,129,.2);color:#10b981">Active</span></td><td><button class="btn-secondary" style="font-size:11px;padding:4px 8px">Edit</button></td></tr>
  </tbody></table></div></div>`;
}

function allApprovalsPage(){
  return `<div class="page-header"><div class="breadcrumb">Home › <span>All Approvals</span></div><h1>Pending Approvals</h1></div>
  <div class="card"><div class="table-wrap"><table><thead><tr><th>Employee</th><th>Request Type</th><th>Date Submitted</th><th>Action</th></tr></thead>
  <tbody>
    <tr><td>John Doe</td><td>Casual Leave (2 days)</td><td>Today</td><td><button class="btn-primary" style="font-size:11px;padding:4px 8px">Approve</button> <button class="btn-secondary" style="font-size:11px;padding:4px 8px">Reject</button></td></tr>
  </tbody></table></div></div>`;
}

function reportsPage(){ return `<div class="page-header"><h1>System Reports</h1></div><div class="card"><p>Analytics and HR reports will be displayed here.</p></div>`; }
function settingsPage(){ return `<div class="page-header"><h1>Portal Settings</h1></div><div class="card"><p>Configure company policies, leave types, and integrations.</p></div>`; }

window.toggleEditProfile = function(){
  window.editProfile = !window.editProfile;
  navigate('profile');
};

window.saveProfile = function(){
  emp.name = document.getElementById('ep-name').value;
  emp.role = document.getElementById('ep-role').value;
  emp.phone = document.getElementById('ep-phone').value;
  emp.location = document.getElementById('ep-loc').value;
  
  const f = document.getElementById('ep-avatar').files[0];
  if(f){
    const reader = new FileReader();
    reader.onload = function(e){
      emp.avatar = e.target.result;
      window.editProfile = false;
      updateTopbarAvatar();
      navigate('profile');
    }
    reader.readAsDataURL(f);
  } else {
    window.editProfile = false;
    updateTopbarAvatar();
    navigate('profile');
  }
};

function profilePage(){
  const avHTML = emp.avatar ? `<img src="${emp.avatar}" style="width:100%;height:100%;border-radius:50%;object-fit:cover;">` : (emp.name.split(' ').map(n=>n[0]).join('').substring(0,2).toUpperCase());
  
  if(window.editProfile){
    return `<div class="page-header"><div class="breadcrumb">Home › <span>Edit Profile</span></div><h1>Edit Profile</h1></div>
    <div class="card" style="max-width:600px">
      <div class="form-group"><label>Profile Picture</label><input type="file" id="ep-avatar" accept="image/*"></div>
      <div class="form-group"><label>Full Name</label><input type="text" id="ep-name" value="${emp.name}"></div>
      <div class="form-group"><label>Role</label><input type="text" id="ep-role" value="${emp.role}"></div>
      <div class="form-group"><label>Phone</label><input type="text" id="ep-phone" value="${emp.phone}"></div>
      <div class="form-group"><label>Location</label><input type="text" id="ep-loc" value="${emp.location}"></div>
      <div class="form-actions"><button class="btn-primary" onclick="saveProfile()">Save Changes</button><button class="btn-secondary" onclick="toggleEditProfile()">Cancel</button></div>
    </div>`;
  }

  return `<div class="page-header"><div class="breadcrumb">Home › <span>My Profile</span></div></div>
  <div class="profile-hero">
    <div class="profile-avatar-large" style="${emp.avatar?'background:none;padding:0;border:none':''}">${avHTML}</div>
    <div class="profile-info">
      <h2>${emp.name} <span style="font-size:12px;background:var(--primary-dark);padding:2px 8px;border-radius:12px;vertical-align:middle;margin-left:8px;">${emp.isAdmin?'Admin':'User'}</span></h2>
      <p>${emp.role}</p>
      <div class="profile-stats">
        ${[['Emp ID',emp.id],['Dept',emp.dept],['Joined',emp.joined]].map(([l,v])=>`<div class="profile-stat"><div class="profile-stat-val" style="font-size:14px">${v}</div><div class="profile-stat-label">${l}</div></div>`).join('')}
      </div>
    </div>
    <button class="btn-secondary" style="margin-left:auto" onclick="toggleEditProfile()">✏️ Edit Profile</button>
  </div>
  <div class="card mb-4">
    <div class="info-section"><h3>Contact Information</h3>
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:16px;margin-top:14px;">
      <div><label style="font-size:11px;color:var(--text3)">Email</label><p style="font-size:14px;font-weight:500">${emp.email}</p></div>
      <div><label style="font-size:11px;color:var(--text3)">Phone</label><p style="font-size:14px;font-weight:500">${emp.phone}</p></div>
      <div><label style="font-size:11px;color:var(--text3)">Location</label><p style="font-size:14px;font-weight:500">${emp.location}</p></div>
    </div></div>
  </div>`;
}

// User Action Forms
window.submitLeave = function(){
  leaves.unshift({ type: document.getElementById('lv-type').value, from: document.getElementById('lv-from').value||'Today', days: document.getElementById('lv-days').value, status: 'pending' });
  alert('Leave applied!'); navigate('leaves-history');
};
function leaveApplyPage(){
  return `<div class="page-header"><h1>Apply for Leave</h1></div><div class="card" style="max-width:600px"><div class="form-group"><label>Type</label><select id="lv-type"><option>Casual</option><option>Sick</option></select></div><div class="form-group"><label>From</label><input type="date" id="lv-from"/></div><div class="form-group"><label>Days</label><input type="number" id="lv-days" value="1"/></div><button class="btn-primary" onclick="submitLeave()">Submit</button></div>`;
}
function leaveHistoryPage(){
  return `<div class="page-header"><h1>Leave History</h1></div><div class="card"><table><thead><tr><th>Type</th><th>From</th><th>Days</th><th>Status</th></tr></thead><tbody>${leaves.map(l=>`<tr><td>${l.type}</td><td>${l.from}</td><td>${l.days}</td><td><span class="status-badge" style="background:var(--warning);color:#fff">${l.status}</span></td></tr>`).join('')}</tbody></table></div>`;
}

window.submitRequest = function(){
  reqs.unshift({ type: document.getElementById('rq-type').value, date: 'Today', status: 'pending' });
  alert('Request submitted!'); navigate('requests-history');
};
function requestNewPage(){
  return `<div class="page-header"><h1>New Request</h1></div><div class="card" style="max-width:600px"><div class="form-group"><label>Type</label><select id="rq-type"><option>IT Request</option><option>WFH Request</option></select></div><div class="form-group"><label>Details</label><textarea></textarea></div><button class="btn-primary" onclick="submitRequest()">Submit</button></div>`;
}
function requestHistoryPage(){
  return `<div class="page-header"><h1>Request History</h1></div><div class="card"><table><thead><tr><th>Type</th><th>Date</th><th>Status</th></tr></thead><tbody>${reqs.map(r=>`<tr><td>${r.type}</td><td>${r.date}</td><td><span class="status-badge" style="background:var(--warning);color:#fff">${r.status}</span></td></tr>`).join('')}</tbody></table></div>`;
}

window.submitClaim = function(){
  claims.unshift({ type: document.getElementById('cl-type').value, amount: document.getElementById('cl-amt').value||'0', date: 'Today', status: 'pending' });
  alert('Claim submitted!'); navigate('reimburse-history');
};
function reimbursePage(){
  return `<div class="page-header"><h1>Claim Reimbursement</h1></div><div class="card" style="max-width:600px"><div class="form-group"><label>Type</label><select id="cl-type"><option>Travel</option><option>Food</option></select></div><div class="form-group"><label>Amount</label><input type="number" id="cl-amt"/></div><button class="btn-primary" onclick="submitClaim()">Submit</button></div>`;
}
function reimburseHistoryPage(){
  return `<div class="page-header"><h1>Claim History</h1></div><div class="card"><table><thead><tr><th>Type</th><th>Amount</th><th>Date</th><th>Status</th></tr></thead><tbody>${claims.map(c=>`<tr><td>${c.type}</td><td>₹${c.amount}</td><td>${c.date}</td><td><span class="status-badge" style="background:var(--warning);color:#fff">${c.status}</span></td></tr>`).join('')}</tbody></table></div>`;
}

function talkPage(dept){
  return ()=>`<div class="page-header"><h1>Talk to ${dept}</h1></div><div class="card"><p>Live chat support coming soon.</p></div>`;
}
