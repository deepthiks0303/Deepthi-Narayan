'use strict';
let emp={name:'K S Deepthi Narayan',id:'EMP4517',role:'Lead Software Engineer',dept:'Engineering',email:'deepthi@company.com',gender:'Female',blood:'B-',company:'TXPL',joined:'2021-03-15',phone:'+91 98765 43210',manager:'Ravi Kumar',location:'Bengaluru',avatar:''};

let leaves=[{type:'Casual Leave',from:'Jun 10',to:'Jun 11',days:2,reason:'Personal',status:'approved'},{type:'Sick Leave',from:'May 22',to:'May 22',days:1,reason:'Not feeling well',status:'approved'},{type:'Earned Leave',from:'Apr 14',to:'Apr 16',days:3,reason:'Family function',status:'approved'}];
let reqs=[{type:'WFH Request',date:'Jun 28',status:'approved'},{type:'IT Equipment',date:'Jun 15',status:'processing'},{type:'Certificate',date:'Jun 1',status:'approved'}];
let claims=[{type:'Travel',date:'Jun 20',amount:'₹1,200',status:'pending'},{type:'Food',date:'Jun 10',amount:'₹450',status:'approved'}];

function updateTopbarAvatar(){
  const av=document.querySelector('.avatar');
  if(emp.avatar){
    av.innerHTML=`<img src="${emp.avatar}" style="width:100%;height:100%;border-radius:50%;object-fit:cover;">`;
    av.style.background='none';
  }else{
    av.innerHTML=emp.name.split(' ').map(n=>n[0]).join('').substring(0,2).toUpperCase();
    av.style.background='linear-gradient(135deg,var(--primary),var(--accent))';
  }
  document.querySelector('.avatar-name').innerText=emp.name;
}

function doLogin(){
  const u=document.getElementById('login-email').value;
  const p=document.getElementById('login-pass').value;
  if(!u||!p){alert('Please enter credentials');return;}
  
  const nameFromEmail = u.split('@')[0].replace(/[._-]/g, ' ');
  emp.name = nameFromEmail.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ') || 'New User';
  emp.email = u.includes('@') ? u : u + '@company.com';
  if(u.toUpperCase().startsWith('EMP')) emp.id = u.toUpperCase();
  
  document.getElementById('login-page').classList.add('hidden');
  document.getElementById('app').classList.remove('hidden');
  updateTopbarAvatar();
  navigate('dashboard');
}
function doLogout(){
  document.getElementById('app').classList.add('hidden');
  document.getElementById('login-page').classList.remove('hidden');
}
function toggleSidebar(){ document.getElementById('sidebar').classList.toggle('collapsed'); }
function toggleSub(el){ el.classList.toggle('open'); }
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
  m.innerHTML=(pages[page]||dashPage)();
  document.querySelectorAll(`[data-page="${page}"]`).forEach(n=>n.classList.add('active'));
}

let punchedIn = false;
let punchTime = '';

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
    <div class="stat-card"><div class="stat-icon" style="background:rgba(79,70,229,.2)">🌿</div><div><div class="stat-val">12</div><div class="stat-label">Leave Balance</div></div></div>
    <div class="stat-card"><div class="stat-icon" style="background:rgba(16,185,129,.2)">✅</div><div><div class="stat-val">96%</div><div class="stat-label">Attendance This Month</div></div></div>
    <div class="stat-card"><div class="stat-icon" style="background:rgba(245,158,11,.2)">⏳</div><div><div class="stat-val">${reqs.length}</div><div class="stat-label">Pending Requests</div></div></div>
    <div class="stat-card"><div class="stat-icon" style="background:rgba(239,68,68,.2)">💰</div><div><div class="stat-val">₹1,200</div><div class="stat-label">Pending Reimbursement</div></div></div>
  </div>
  <div class="grid-2">
    <div class="card"><div class="card-title">📅 This Week Attendance</div>
    ${['Mon','Tue','Wed','Thu','Fri'].map((d,i)=>`<div class="flex justify-between" style="padding:8px 0;border-bottom:1px solid var(--border)"><span>${d}</span><span class="status-badge ${i<3?'approved':i===3?'pending':'processing'}">${i<3?'Present':i===3?'Half Day':'WFH'}</span></div>`).join('')}
    </div>
    <div class="card"><div class="card-title">📋 Recent Requests</div>
    ${reqs.slice(0,3).map(r=>`<div class="flex justify-between" style="padding:8px 0;border-bottom:1px solid var(--border)"><div><div style="font-size:13px;font-weight:500">${r.type}</div><div style="font-size:11px;color:var(--text3)">${r.date}</div></div><span class="status-badge ${r.status}">${r.status}</span></div>`).join('')}
    </div>
  </div>`;
}

window.editProfile = false;
function toggleEditProfile(){
  window.editProfile = !window.editProfile;
  navigate('profile');
}
function saveProfile(){
  emp.name = document.getElementById('ep-name').value;
  emp.role = document.getElementById('ep-role').value;
  emp.phone = document.getElementById('ep-phone').value;
  emp.location = document.getElementById('ep-loc').value;
  
  const f = document.getElementById('ep-avatar').files[0];
  if(f){
    const reader = new FileReader();
    reader.onload = function(e){
      emp.avatar = e.target.result;
      updateTopbarAvatar();
      window.editProfile = false;
      navigate('profile');
    }
    reader.readAsDataURL(f);
  } else {
    window.editProfile = false;
    updateTopbarAvatar();
    navigate('profile');
  }
}

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
      <h2>${emp.name}</h2><p>${emp.role}</p>
      <div class="profile-stats">
        ${[['7','Points'],['4','Colleagues'],['7','Activities'],['0','Thanks']].map(([v,l])=>`<div class="profile-stat"><div class="profile-stat-val">${v}</div><div class="profile-stat-label">${l}</div></div>`).join('')}
      </div>
    </div>
    <button class="btn-secondary" style="margin-left:auto" onclick="toggleEditProfile()">✏️ Edit Profile</button>
  </div>
  <div class="tabs">
    <div class="tab active">Employee Details</div><div class="tab">Payroll</div><div class="tab">Goalsheet</div><div class="tab">Leaves</div>
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
  </div></div>`;
}

window.submitLeave = function(){
  leaves.unshift({
    type: document.getElementById('lv-type').value,
    from: document.getElementById('lv-from').value || 'Today',
    to: document.getElementById('lv-to').value || 'Today',
    days: document.getElementById('lv-days').value,
    reason: document.getElementById('lv-reason').value,
    status: 'pending'
  });
  alert('Leave application submitted!');
  navigate('leaves-history');
};
function leaveApplyPage(){
  return `<div class="page-header"><div class="breadcrumb">Home › My Leaves › <span>Apply Leave</span></div><h1>Apply for Leave</h1></div>
  <div class="card" style="max-width:600px"><div class="card-title">📝 Leave Application</div>
  <div class="form-group"><label>Leave Type</label><select id="lv-type"><option>Casual Leave</option><option>Sick Leave</option><option>Earned Leave</option></select></div>
  <div class="form-row"><div class="form-group"><label>From Date</label><input type="date" id="lv-from"/></div><div class="form-group"><label>To Date</label><input type="date" id="lv-to"/></div></div>
  <div class="form-group"><label>Number of Days</label><input type="number" id="lv-days" value="1"/></div>
  <div class="form-group"><label>Reason</label><textarea id="lv-reason" placeholder="Reason..."></textarea></div>
  <div class="form-actions"><button class="btn-primary" onclick="submitLeave()">Submit Application</button></div></div>`;
}

function leaveHistoryPage(){
  return `<div class="page-header"><div class="breadcrumb">Home › My Leaves › <span>Leave History</span></div><h1>Leave History</h1></div>
  <div class="card"><div class="table-wrap"><table><thead><tr><th>Leave Type</th><th>From</th><th>To</th><th>Days</th><th>Reason</th><th>Status</th></tr></thead>
  <tbody>${leaves.map(l=>`<tr><td>${l.type}</td><td>${l.from}</td><td>${l.to}</td><td>${l.days}</td><td>${l.reason}</td><td><span class="status-badge ${l.status}">${l.status}</span></td></tr>`).join('')}</tbody></table></div></div>`;
}

function leaveBalancePage(){
  const bal=[{type:'Casual Leave',total:12,used:4,color:'#818cf8'},{type:'Sick Leave',total:10,used:1,color:'#34d399'},{type:'Earned Leave',total:15,used:3,color:'#fbbf24'}];
  return `<div class="page-header"><div class="breadcrumb">Home › My Leaves › <span>Leave Balance</span></div><h1>Leave Balance</h1></div>
  <div class="leave-balance-grid">${bal.map(b=>`<div class="leave-bal-card"><div class="leave-bal-val" style="color:${b.color}">${b.total-b.used}</div><div class="leave-bal-type">${b.type}</div><div class="leave-bal-used">Used: ${b.used} / ${b.total}</div><div class="progress-bar mt-4"><div class="progress-fill" style="width:${(b.used/b.total)*100}%;background:${b.color}"></div></div></div>`).join('')}</div>`;
}

window.submitRequest = function(){
  reqs.unshift({
    type: document.getElementById('rq-type').value,
    date: 'Today',
    status: 'pending'
  });
  alert('Request submitted!');
  navigate('requests-history');
};
function requestNewPage(){
  return `<div class="page-header"><div class="breadcrumb">Home › My Requests › <span>New Request</span></div><h1>New Request</h1></div>
  <div class="card" style="max-width:600px"><div class="card-title">📋 Raise a Request</div>
  <div class="form-group"><label>Request Type</label><select id="rq-type"><option>WFH Request</option><option>IT Equipment</option><option>Gate Pass</option></select></div>
  <div class="form-group"><label>Description</label><textarea placeholder="Details..."></textarea></div>
  <div class="form-group"><label>Attach Document (optional)</label><input type="file"/></div>
  <div class="form-actions"><button class="btn-primary" onclick="submitRequest()">Submit Request</button></div></div>`;
}

function requestHistoryPage(){
  return `<div class="page-header"><div class="breadcrumb">Home › My Requests › <span>Request History</span></div><h1>Request History</h1></div>
  <div class="card"><div class="table-wrap"><table><thead><tr><th>Request Type</th><th>Date</th><th>Status</th></tr></thead>
  <tbody>${reqs.map(r=>`<tr><td>${r.type}</td><td>${r.date}</td><td><span class="status-badge ${r.status}">${r.status}</span></td></tr>`).join('')}</tbody></table></div></div>`;
}

window.submitClaim = function(){
  claims.unshift({
    type: document.getElementById('cl-type').value,
    date: document.getElementById('cl-date').value || 'Today',
    amount: '₹' + (document.getElementById('cl-amt').value || '0'),
    status: 'pending'
  });
  alert('Claim submitted!');
  navigate('reimburse-history');
};
function reimbursePage(){
  return `<div class="page-header"><div class="breadcrumb">Home › Reimbursements › <span>Claim</span></div><h1>Claim Reimbursement</h1></div>
  <div class="card" style="max-width:600px"><div class="card-title">💰 New Claim</div>
  <div class="form-group"><label>Expense Type</label><select id="cl-type"><option>Travel</option><option>Food</option></select></div>
  <div class="form-row"><div class="form-group"><label>Date</label><input type="date" id="cl-date"/></div><div class="form-group"><label>Amount</label><input type="number" id="cl-amt"/></div></div>
  <div class="form-group"><label>Upload Bill</label><input type="file"/></div>
  <div class="form-actions"><button class="btn-primary" onclick="submitClaim()">Submit Claim</button></div></div>`;
}

function reimburseHistoryPage(){
  return `<div class="page-header"><div class="breadcrumb">Home › Reimbursements › <span>History</span></div><h1>Claim History</h1></div>
  <div class="card"><div class="table-wrap"><table><thead><tr><th>Type</th><th>Date</th><th>Amount</th><th>Status</th></tr></thead>
  <tbody>${claims.map(c=>`<tr><td>${c.type}</td><td>${c.date}</td><td style="font-weight:600">${c.amount}</td><td><span class="status-badge ${c.status}">${c.status}</span></td></tr>`).join('')}</tbody></table></div></div>`;
}

function approvalsPage(){
  const items=[{emp:'Rahul Sharma',type:'Casual Leave',date:'Jun 28',status:'pending'}];
  return `<div class="page-header"><div class="breadcrumb">Home › <span>Approvals</span></div><h1>List All Approvals</h1></div>
  <div class="card"><div class="table-wrap"><table><thead><tr><th>Employee</th><th>Type</th><th>Date</th><th>Status</th><th>Action</th></tr></thead>
  <tbody>${items.map(i=>`<tr><td>${i.emp}</td><td>${i.type}</td><td>${i.date}</td><td><span class="status-badge ${i.status}">${i.status}</span></td><td><button class="btn-primary" onclick="alert('Approved!')">Approve</button></td></tr>`).join('')}</tbody></table></div></div>`;
}

function teamDashPage(){
  const members=[{name:'Rahul Sharma',role:'Senior Dev',initials:'RS',color:'#818cf8',online:true},{name:'Priya Menon',role:'QA',initials:'PM',color:'#34d399',online:true}];
  return `<div class="page-header"><div class="breadcrumb">Home › <span>Team Dashboard</span></div><h1>My Team</h1></div>
  <div class="grid-3">${members.map(m=>`<div class="team-member-card"><div class="team-avatar" style="background:${m.color}22;color:${m.color}">${m.initials}</div><div class="team-info"><h4>${m.name}</h4><p>${m.role}</p></div><div class="${m.online?'online':'offline'}-dot"></div></div>`).join('')}</div>`;
}

function teamAttPage(){
  return `<div class="page-header"><h1>Team Attendance</h1></div><div class="card"><p>View team stats here.</p></div>`;
}
function virtualAttPage(){
  return `<div class="page-header"><h1>Virtual Attendance</h1></div><div class="card"><p>Mark virtual attendance.</p></div>`;
}

function talkPage(dept){
  return ()=>`<div class="page-header"><div class="breadcrumb">Home › <span>Talk to ${dept}</span></div><h1>Talk to ${dept}</h1></div>
  <div class="chat-container"><div class="chat-messages" id="chat-msgs"><div class="chat-msg bot">Hello! I'm the ${dept} assistant.</div></div>
  <div class="chat-input-wrap"><input type="text" id="chat-inp" onkeydown="if(event.key==='Enter')sendChat('${dept}')"/><button onclick="sendChat('${dept}')">Send</button></div></div>`;
}

function sendChat(dept){
  const inp=document.getElementById('chat-inp'), msgs=document.getElementById('chat-msgs');
  if(!inp||!msgs||!inp.value.trim())return;
  msgs.innerHTML+=`<div class="chat-msg user">${inp.value}</div>`;
  setTimeout(()=>{msgs.innerHTML+=`<div class="chat-msg bot">Thank you. Our team will get back to you.</div>`;msgs.scrollTop=msgs.scrollHeight;},600);
  inp.value=''; msgs.scrollTop=msgs.scrollHeight;
}
document.addEventListener('keydown',e=>{if(e.key==='Escape'){document.getElementById('notif-panel').classList.add('hidden');}});
