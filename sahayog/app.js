'use strict';
const emp={name:'K S Deepthi Narayan',id:'EMP4517',role:'Lead Software Engineer',dept:'Engineering',email:'deepthi@company.com',gender:'Female',blood:'B-',company:'TXPL',joined:'2021-03-15',phone:'+91 98765 43210',manager:'Ravi Kumar',location:'Bengaluru'};

function doLogin(){
  const u=document.getElementById('login-email').value;
  const p=document.getElementById('login-pass').value;
  if(!u||!p){alert('Please enter credentials');return;}
  document.getElementById('login-page').classList.add('hidden');
  document.getElementById('app').classList.remove('hidden');
  navigate('dashboard');
}
function doLogout(){
  document.getElementById('app').classList.add('hidden');
  document.getElementById('login-page').classList.remove('hidden');
}
function toggleSidebar(){
  document.getElementById('sidebar').classList.toggle('collapsed');
}
function toggleSub(el){
  el.classList.toggle('open');
}
function toggleNotifs(){
  document.getElementById('notif-panel').classList.toggle('hidden');
  document.getElementById('notif-badge').style.display='none';
}
function globalSearch(v){
  const pages=['Dashboard','My Profile','Apply Leave','Leave History','Leave Balance','My Attendance','New Request','Claim Reimbursement','Approvals','Team Dashboard','Team Attendance','Virtual Attendance','Talk to Facility','Talk to Payroll','Talk with Travel Desk'];
  const r=document.getElementById('search-results');
  if(!v){r.style.display='none';return;}
  const f=pages.filter(p=>p.toLowerCase().includes(v.toLowerCase()));
  r.style.display=f.length?'block':'none';
  r.innerHTML=f.map(p=>`<div class="search-result-item" onclick="r.style.display='none';navigate('${p.toLowerCase().replace(/ /g,'-')}')">${p}</div>`).join('');
}

function navigate(page){
  document.querySelectorAll('.nav-item').forEach(n=>n.classList.remove('active'));
  const m=document.getElementById('main-content');
  const pages={
    'dashboard':dashPage,'profile':profilePage,'attendance':attendancePage,
    'leaves-apply':leaveApplyPage,'leaves-history':leaveHistoryPage,'leaves-balance':leaveBalancePage,
    'requests-new':requestNewPage,'requests-history':requestHistoryPage,
    'reimburse-claim':reimbursePage,'reimburse-history':reimburseHistoryPage,
    'approvals':approvalsPage,'team-dashboard':teamDashPage,'team-attendance':teamAttPage,
    'virtual-attendance':virtualAttPage,'talk-facility':talkPage('Facility/Admin'),
    'talk-payroll':talkPage('Payroll'),'talk-travel':talkPage('Travel Desk')
  };
  const fn=pages[page]||dashPage;
  m.innerHTML=fn();
  document.querySelectorAll(`[data-page="${page}"]`).forEach(n=>n.classList.add('active'));
  attachTabListeners();
}

function dashPage(){
  const today=new Date().toDateString();
  return `
  <div class="page-header"><div class="breadcrumb">Home › <span>Dashboard</span></div>
  <h1>Welcome back, ${emp.name.split(' ')[2]} 👋</h1><p>Today is ${today}</p></div>
  <div class="grid-4 mb-4">
    <div class="stat-card"><div class="stat-icon" style="background:rgba(79,70,229,.2)">🌿</div><div><div class="stat-val">12</div><div class="stat-label">Leave Balance</div></div></div>
    <div class="stat-card"><div class="stat-icon" style="background:rgba(16,185,129,.2)">✅</div><div><div class="stat-val">96%</div><div class="stat-label">Attendance This Month</div></div></div>
    <div class="stat-card"><div class="stat-icon" style="background:rgba(245,158,11,.2)">⏳</div><div><div class="stat-val">2</div><div class="stat-label">Pending Requests</div></div></div>
    <div class="stat-card"><div class="stat-icon" style="background:rgba(239,68,68,.2)">💰</div><div><div class="stat-val">₹1,200</div><div class="stat-label">Pending Reimbursement</div></div></div>
  </div>
  <div class="grid-2">
    <div class="card"><div class="card-title">📅 This Week Attendance</div>
    ${['Mon','Tue','Wed','Thu','Fri'].map((d,i)=>`<div class="flex justify-between" style="padding:8px 0;border-bottom:1px solid var(--border)"><span>${d}</span><span class="status-badge ${i<3?'approved':i===3?'pending':'processing'}">${i<3?'Present':i===3?'Half Day':'WFH'}</span></div>`).join('')}
    </div>
    <div class="card"><div class="card-title">📋 Recent Requests</div>
    ${[{t:'Casual Leave',d:'Jun 25',s:'approved'},{t:'Travel Reimbursement',d:'Jun 20',s:'pending'},{t:'WFH Request',d:'Jun 18',s:'approved'}].map(r=>`<div class="flex justify-between" style="padding:8px 0;border-bottom:1px solid var(--border)"><div><div style="font-size:13px;font-weight:500">${r.t}</div><div style="font-size:11px;color:var(--text3)">${r.d}</div></div><span class="status-badge ${r.s}">${r.s}</span></div>`).join('')}
    </div>
  </div>`;
}

function profilePage(){
  return `<div class="page-header"><div class="breadcrumb">Home › <span>My Profile</span></div></div>
  <div class="profile-hero">
    <div class="profile-avatar-large">KD</div>
    <div class="profile-info">
      <h2>${emp.name}</h2><p>${emp.role}</p>
      <div class="profile-stats">
        ${[['7','Points'],['4','Colleagues'],['7','Activities'],['0','Thanks']].map(([v,l])=>`<div class="profile-stat"><div class="profile-stat-val">${v}</div><div class="profile-stat-label">${l}</div></div>`).join('')}
      </div>
    </div>
    <button class="btn-secondary" style="margin-left:auto">✏️ Edit Profile</button>
  </div>
  <div class="tabs">
    ${['Employee Details','Payroll','Goalsheet','Leaves','Employee Timeline'].map((t,i)=>`<div class="tab${i===0?' active':''}" onclick="switchTab(this,'tab-${i}')">${t}</div>`).join('')}
  </div>
  <div id="tab-0">
    <div class="card mb-4"><div class="info-section"><h3>Basic Information</h3>
    <div class="info-grid">
      ${[['Gender',emp.gender],['Employee Code',emp.id],['Blood Group',emp.blood],['Company',emp.company]].map(([l,v])=>`<div class="info-field"><label>${l}</label><p class="highlight">${v}</p></div>`).join('')}
    </div></div>
    <div class="info-section"><h3>Contact Information</h3>
    <div class="info-grid">
      ${[['Email',emp.email],['Phone',emp.phone],['Location',emp.location]].map(([l,v])=>`<div class="info-field"><label>${l}</label><p>${v}</p></div>`).join('')}
    </div></div>
    <div class="info-section"><h3>Employment Information</h3>
    <div class="info-grid">
      ${[['Department',emp.dept],['Manager',emp.manager],['Date of Joining',emp.joined]].map(([l,v])=>`<div class="info-field"><label>${l}</label><p class="highlight">${v}</p></div>`).join('')}
    </div></div></div>
  </div>`;
}

function attendancePage(){
  const days=['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
  const status=['weekend','present','present','present','present','half','present','weekend','present','absent','present','present','present','present','weekend','present','present','present','present','present','present','weekend','present','present','present','present','present','processing','weekend','present','empty'];
  return `<div class="page-header"><div class="breadcrumb">Home › <span>My Attendance</span></div><h1>My Attendance</h1><p>June 2025</p></div>
  <div class="grid-4 mb-4">
    <div class="stat-card"><div class="stat-icon" style="background:rgba(16,185,129,.2)">✅</div><div><div class="stat-val">22</div><div class="stat-label">Days Present</div></div></div>
    <div class="stat-card"><div class="stat-icon" style="background:rgba(239,68,68,.2)">❌</div><div><div class="stat-val">1</div><div class="stat-label">Days Absent</div></div></div>
    <div class="stat-card"><div class="stat-icon" style="background:rgba(245,158,11,.2)">🌓</div><div><div class="stat-val">1</div><div class="stat-label">Half Days</div></div></div>
    <div class="stat-card"><div class="stat-icon" style="background:rgba(79,70,229,.2)">🎉</div><div><div class="stat-val">2</div><div class="stat-label">Holidays</div></div></div>
  </div>
  <div class="card"><div class="card-title">📅 June 2025 Calendar</div>
  <div class="attendance-cal">${days.map(d=>`<div class="cal-day-name">${d}</div>`).join('')}
  ${status.map((s,i)=>`<div class="cal-day ${s} ${i===28?'today':''}" title="${s}">${s==='empty'?'':i+1<=30?i+1:''}</div>`).join('')}
  </div>
  <div class="flex gap-4 mt-4" style="flex-wrap:wrap;font-size:12px;color:var(--text2)">
    <span><span style="color:#34d399">■</span> Present</span><span><span style="color:#f87171">■</span> Absent</span><span><span style="color:#fbbf24">■</span> Half Day</span><span><span style="color:#818cf8">■</span> Holiday</span><span><span style="color:var(--text3)">■</span> Weekend</span>
  </div></div>`;
}

function leaveApplyPage(){
  return `<div class="page-header"><div class="breadcrumb">Home › My Leaves › <span>Apply Leave</span></div><h1>Apply for Leave</h1></div>
  <div class="card" style="max-width:600px"><div class="card-title">📝 Leave Application</div>
  <div class="form-group"><label>Leave Type</label><select><option>Casual Leave</option><option>Sick Leave</option><option>Earned Leave</option><option>Compensatory Off</option><option>Maternity Leave</option><option>Paternity Leave</option></select></div>
  <div class="form-row"><div class="form-group"><label>From Date</label><input type="date"/></div><div class="form-group"><label>To Date</label><input type="date"/></div></div>
  <div class="form-group"><label>Number of Days</label><input type="number" value="1" min="0.5" step="0.5"/></div>
  <div class="form-group"><label>Reason</label><textarea placeholder="Please provide reason for leave..."></textarea></div>
  <div class="form-group"><label>Contact During Leave</label><input type="text" placeholder="+91 XXXXX XXXXX"/></div>
  <div class="form-actions"><button class="btn-primary" onclick="alert('Leave application submitted!')">Submit Application</button><button class="btn-secondary">Cancel</button></div></div>`;
}

function leaveHistoryPage(){
  const leaves=[{type:'Casual Leave',from:'Jun 10',to:'Jun 11',days:2,reason:'Personal',status:'approved'},{type:'Sick Leave',from:'May 22',to:'May 22',days:1,reason:'Not feeling well',status:'approved'},{type:'Earned Leave',from:'Apr 14',to:'Apr 16',days:3,reason:'Family function',status:'approved'},{type:'Casual Leave',from:'Mar 5',to:'Mar 5',days:1,reason:'Personal work',status:'rejected'}];
  return `<div class="page-header"><div class="breadcrumb">Home › My Leaves › <span>Leave History</span></div><h1>Leave History</h1></div>
  <div class="card"><div class="table-wrap"><table><thead><tr><th>Leave Type</th><th>From</th><th>To</th><th>Days</th><th>Reason</th><th>Status</th></tr></thead>
  <tbody>${leaves.map(l=>`<tr><td>${l.type}</td><td>${l.from}</td><td>${l.to}</td><td>${l.days}</td><td>${l.reason}</td><td><span class="status-badge ${l.status}">${l.status}</span></td></tr>`).join('')}</tbody></table></div></div>`;
}

function leaveBalancePage(){
  const bal=[{type:'Casual Leave',total:12,used:4,color:'#818cf8'},{type:'Sick Leave',total:10,used:1,color:'#34d399'},{type:'Earned Leave',total:15,used:3,color:'#fbbf24'},{type:'Comp Off',total:3,used:0,color:'#22d3ee'},{type:'Maternity',total:180,used:0,color:'#f472b6'}];
  return `<div class="page-header"><div class="breadcrumb">Home › My Leaves › <span>Leave Balance</span></div><h1>Leave Balance</h1></div>
  <div class="leave-balance-grid">${bal.map(b=>`<div class="leave-bal-card"><div class="leave-bal-val" style="color:${b.color}">${b.total-b.used}</div><div class="leave-bal-type">${b.type}</div><div class="leave-bal-used">Used: ${b.used} / ${b.total}</div><div class="progress-bar mt-4"><div class="progress-fill" style="width:${(b.used/b.total)*100}%;background:${b.color}"></div></div></div>`).join('')}</div>`;
}

function requestNewPage(){
  return `<div class="page-header"><div class="breadcrumb">Home › My Requests › <span>New Request</span></div><h1>New Request</h1></div>
  <div class="card" style="max-width:600px"><div class="card-title">📋 Raise a Request</div>
  <div class="form-group"><label>Request Type</label><select><option>WFH Request</option><option>Access Card Request</option><option>IT Equipment Request</option><option>Certificate Request</option><option>Gate Pass</option><option>Cabin/Seat Change</option></select></div>
  <div class="form-group"><label>Priority</label><select><option>Normal</option><option>High</option><option>Urgent</option></select></div>
  <div class="form-group"><label>Description</label><textarea placeholder="Describe your request in detail..."></textarea></div>
  <div class="form-group"><label>Attach Document (optional)</label><input type="file"/></div>
  <div class="form-actions"><button class="btn-primary" onclick="alert('Request submitted successfully!')">Submit Request</button><button class="btn-secondary">Cancel</button></div></div>`;
}

function requestHistoryPage(){
  const reqs=[{type:'WFH Request',date:'Jun 28',status:'approved'},{type:'IT Equipment',date:'Jun 15',status:'processing'},{type:'Certificate',date:'Jun 1',status:'approved'},{type:'Gate Pass',date:'May 28',status:'rejected'}];
  return `<div class="page-header"><div class="breadcrumb">Home › My Requests › <span>Request History</span></div><h1>Request History</h1></div>
  <div class="card"><div class="table-wrap"><table><thead><tr><th>Request Type</th><th>Date</th><th>Status</th><th>Action</th></tr></thead>
  <tbody>${reqs.map(r=>`<tr><td>${r.type}</td><td>${r.date}</td><td><span class="status-badge ${r.status}">${r.status}</span></td><td><button class="btn-secondary" style="padding:4px 10px;font-size:12px">View</button></td></tr>`).join('')}</tbody></table></div></div>`;
}

function reimbursePage(){
  return `<div class="page-header"><div class="breadcrumb">Home › Reimbursements › <span>Claim</span></div><h1>Claim Reimbursement</h1></div>
  <div class="card" style="max-width:600px"><div class="card-title">💰 New Claim</div>
  <div class="form-group"><label>Expense Type</label><select><option>Travel</option><option>Food</option><option>Accommodation</option><option>Medical</option><option>Telephone</option><option>Internet</option><option>Other</option></select></div>
  <div class="form-row"><div class="form-group"><label>Expense Date</label><input type="date"/></div><div class="form-group"><label>Amount (₹)</label><input type="number" placeholder="0.00"/></div></div>
  <div class="form-group"><label>Description</label><textarea placeholder="Details of the expense..."></textarea></div>
  <div class="form-group"><label>Upload Bill/Receipt</label><input type="file" accept="image/*,.pdf"/></div>
  <div class="form-actions"><button class="btn-primary" onclick="alert('Reimbursement claim submitted!')">Submit Claim</button><button class="btn-secondary">Cancel</button></div></div>`;
}

function reimburseHistoryPage(){
  const claims=[{type:'Travel',date:'Jun 20',amount:'₹1,200',status:'pending'},{type:'Food',date:'Jun 10',amount:'₹450',status:'approved'},{type:'Telephone',date:'May 30',amount:'₹299',status:'approved'}];
  return `<div class="page-header"><div class="breadcrumb">Home › Reimbursements › <span>History</span></div><h1>Claim History</h1></div>
  <div class="card"><div class="table-wrap"><table><thead><tr><th>Type</th><th>Date</th><th>Amount</th><th>Status</th></tr></thead>
  <tbody>${claims.map(c=>`<tr><td>${c.type}</td><td>${c.date}</td><td style="font-weight:600">${c.amount}</td><td><span class="status-badge ${c.status}">${c.status}</span></td></tr>`).join('')}</tbody></table></div></div>`;
}

function approvalsPage(){
  const items=[{emp:'Rahul Sharma',type:'Casual Leave',date:'Jun 28',days:'2',status:'pending'},{emp:'Priya Menon',type:'WFH Request',date:'Jun 27',days:'-',status:'pending'},{emp:'Arjun Nair',type:'Reimbursement ₹800',date:'Jun 25',days:'-',status:'approved'}];
  return `<div class="page-header"><div class="breadcrumb">Home › <span>Approvals</span></div><h1>List All Approvals</h1></div>
  <div class="card"><div class="table-wrap"><table><thead><tr><th>Employee</th><th>Request Type</th><th>Date</th><th>Days</th><th>Status</th><th>Action</th></tr></thead>
  <tbody>${items.map(i=>`<tr><td>${i.emp}</td><td>${i.type}</td><td>${i.date}</td><td>${i.days}</td><td><span class="status-badge ${i.status}">${i.status}</span></td><td style="display:flex;gap:6px;padding:12px 14px"><button class="btn-primary" style="padding:4px 10px;font-size:12px" onclick="alert('Approved!')">Approve</button><button class="btn-secondary" style="padding:4px 10px;font-size:12px;color:#f87171" onclick="alert('Rejected!')">Reject</button></td></tr>`).join('')}</tbody></table></div></div>`;
}

function teamDashPage(){
  const members=[{name:'Rahul Sharma',role:'Senior Dev',initials:'RS',color:'#818cf8',online:true},{name:'Priya Menon',role:'QA Engineer',initials:'PM',color:'#34d399',online:true},{name:'Arjun Nair',role:'UI Designer',initials:'AN',color:'#fbbf24',online:false},{name:'Sneha Reddy',role:'Backend Dev',initials:'SR',color:'#f472b6',online:true},{name:'Vikram Singh',role:'DevOps',initials:'VS',color:'#22d3ee',online:false},{name:'Kavya Iyer',role:'Data Analyst',initials:'KI',color:'#fb923c',online:true}];
  return `<div class="page-header"><div class="breadcrumb">Home › <span>My Team's Dashboard</span></div><h1>My Team</h1><p>6 team members</p></div>
  <div class="grid-3">${members.map(m=>`<div class="team-member-card"><div class="team-avatar" style="background:${m.color}22;color:${m.color}">${m.initials}</div><div class="team-info"><h4>${m.name}</h4><p>${m.role}</p></div><div class="${m.online?'online':'offline'}-dot" title="${m.online?'Online':'Offline'}"></div></div>`).join('')}</div>`;
}

function teamAttPage(){
  const rows=[{name:'Rahul Sharma',present:22,absent:0,half:1,wfh:3},{name:'Priya Menon',present:21,absent:1,half:0,wfh:2},{name:'Arjun Nair',present:20,absent:2,half:1,wfh:1},{name:'Sneha Reddy',present:23,absent:0,half:0,wfh:4}];
  return `<div class="page-header"><div class="breadcrumb">Home › <span>Team Attendance</span></div><h1>Team Attendance – June 2025</h1></div>
  <div class="card"><div class="table-wrap"><table><thead><tr><th>Name</th><th>Present</th><th>Absent</th><th>Half Day</th><th>WFH</th><th>%</th></tr></thead>
  <tbody>${rows.map(r=>`<tr><td>${r.name}</td><td class="text-success">${r.present}</td><td class="text-danger">${r.absent}</td><td class="text-warning">${r.half}</td><td style="color:#22d3ee">${r.wfh}</td><td>${Math.round(r.present/24*100)}%</td></tr>`).join('')}</tbody></table></div></div>`;
}

function virtualAttPage(){
  return `<div class="page-header"><div class="breadcrumb">Home › <span>Virtual Attendance Approvals</span></div><h1>Virtual Attendance</h1></div>
  <div class="card mb-4"><div class="card-title">🖥️ Mark Virtual Attendance</div>
  <div class="form-row"><div class="form-group"><label>Date</label><input type="date"/></div><div class="form-group"><label>Reason</label><input type="text" placeholder="WFH / Travel / On-site"/></div></div>
  <div class="form-group"><label>Remarks</label><textarea placeholder="Additional remarks..."></textarea></div>
  <div class="form-actions"><button class="btn-primary" onclick="alert('Virtual attendance marked!')">Mark Attendance</button></div></div>
  <div class="card"><div class="card-title">📋 Pending Approvals</div>
  <p style="color:var(--text2);font-size:14px">No pending virtual attendance approvals.</p></div>`;
}

function talkPage(dept){
  return ()=>`<div class="page-header"><div class="breadcrumb">Home › Useful Links › <span>Talk to ${dept}</span></div><h1>Talk to ${dept}</h1></div>
  <div class="chat-container"><div class="chat-messages" id="chat-msgs">
  <div class="chat-msg bot">Hello! I'm the ${dept} assistant. How can I help you today?</div></div>
  <div class="chat-input-wrap"><input type="text" id="chat-inp" placeholder="Type your message..." onkeydown="if(event.key==='Enter')sendChat('${dept}')"/><button onclick="sendChat('${dept}')">Send</button></div></div>`;
}

function sendChat(dept){
  const inp=document.getElementById('chat-inp');
  const msgs=document.getElementById('chat-msgs');
  if(!inp||!msgs||!inp.value.trim())return;
  msgs.innerHTML+=`<div class="chat-msg user">${inp.value}</div>`;
  const replies={'Facility/Admin':'Thank you for reaching out! Our team will respond within 24 hours.','Payroll':'Your payroll query has been noted. Expected response within 2 business days.','Travel Desk':'Travel request received. Our travel coordinator will contact you shortly.'};
  setTimeout(()=>{msgs.innerHTML+=`<div class="chat-msg bot">${replies[dept]||'Thank you! We will get back to you soon.'}</div>`;msgs.scrollTop=msgs.scrollHeight;},600);
  inp.value='';msgs.scrollTop=msgs.scrollHeight;
}

function switchTab(el,tabId){
  document.querySelectorAll('.tab').forEach(t=>t.classList.remove('active'));
  el.classList.add('active');
}
function attachTabListeners(){}

document.addEventListener('keydown',e=>{if(e.key==='Escape'){document.getElementById('notif-panel').classList.add('hidden');}});
