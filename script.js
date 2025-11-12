// Client-side UConnect Portal (clean: no demo users)
// Stores users in localStorage under 'uconnect_users'
const STORAGE_KEY = 'uconnect_users';

function $(sel){return document.querySelector(sel)}
function $all(sel){return document.querySelectorAll(sel)}

let users = [];

function saveUsers(){ localStorage.setItem(STORAGE_KEY, JSON.stringify(users)); }
function loadUsers(){ const raw = localStorage.getItem(STORAGE_KEY); users = raw ? JSON.parse(raw) : []; renderUsers(); }

function renderUsers(){
  const list = $('#user-list'); list.innerHTML='';
  users.forEach(u=>{
    const div = document.createElement('div'); div.className='user-item';
    div.innerHTML = `
      <div class="user-meta"><strong>${u.email}</strong><div class="muted">Role: ${u.role} · Pass: ${u.password}</div></div>
      <div class="user-actions">
        <button data-email="${u.email}" class="copy-link">Generate link</button>
        <button data-id="${u.id}" class="delete-user" style="background:#ef4444;color:white">Delete</button>
      </div>
    `;
    list.appendChild(div);
  });
  $('#user-count').textContent = users.length;
  // attach events
  $all('.copy-link').forEach(btn=>btn.onclick = ()=>{ const u = users.find(x=>x.email===btn.dataset.email); const link = generateInviteLink(u); navigator.clipboard.writeText(link).then(()=>alert('Invite link copied to clipboard')); });
  $all('.delete-user').forEach(btn=>btn.onclick = ()=>{ if(confirm('Delete this user?')){ users = users.filter(x=>x.id!==Number(btn.dataset.id)); saveUsers(); renderUsers(); } });
}

function generateInviteLink(user){
  const payload = { email: user.email, id: user.id, ts: Date.now() };
  const token = btoa(JSON.stringify(payload));
  return `${window.location.origin}${window.location.pathname}?token=${token}`;
}

// Login flow
$('#login-form').addEventListener('submit', (e)=>{
  e.preventDefault();
  const email = $('#email').value.trim().toLowerCase();
  const password = $('#password').value;
  const u = users.find(x=>x.email.toLowerCase()===email && x.password===password);
  if(u){
    onLogin(u);
  } else {
    $('#message').textContent = 'Invalid email or password.';
  }
});

function onLogin(user){
  $('#login-section').classList.add('hidden');
  $('#signedin-section').classList.remove('hidden');
  $('#current-email').textContent = user.email;
  $('#current-role').textContent = user.role;
  $('#message').textContent = '';
}

// Logout
$('#logout-btn').onclick = ()=>{
  $('#signedin-section').classList.add('hidden');
  $('#login-section').classList.remove('hidden');
  $('#email').value=''; $('#password').value='';
  $('#message').textContent = 'Logged out.';
}

// Dashboard button (demo)
$('#dashboard-btn').onclick = ()=> alert('Redirect to dashboard (demo)')

// Admin toggle
$('#admin-toggle').onclick = ()=>{
  const panel = $('#admin-panel');
  panel.classList.toggle('hidden');
  // Also clear message
  $('#message').textContent='';
}

// Add user form
$('#add-user-form').addEventListener('submit', (e)=>{
  e.preventDefault();
  const email = $('#new-email').value.trim();
  const password = $('#new-password').value;
  const role = $('#new-role').value;
  if(!email || !password){ $('#message').textContent = 'Provide email and password.'; return; }
  if(users.some(u=>u.email.toLowerCase()===email.toLowerCase())){ $('#message').textContent = 'A user with this email already exists.'; return; }
  const id = Date.now();
  users.push({ id, email, password, role });
  saveUsers(); renderUsers();
  $('#new-email').value=''; $('#new-password').value=''; $('#new-role').value='agent';
  $('#message').textContent = 'User added. Generate invite link to share.';
});

$('#reset-user').onclick = ()=>{ $('#new-email').value=''; $('#new-password').value=''; $('#new-role').value='agent'; }

// Auto-login via ?token= in URL (demo)
function tryAutoLoginFromToken(){
  const params = new URLSearchParams(window.location.search);
  const token = params.get('token');
  if(token){
    try{
      const payload = JSON.parse(atob(token));
      const u = users.find(x=>x.email===payload.email);
      if(u){ onLogin(u); $('#message').textContent = 'Logged in via invite link.'; }
      else { $('#message').textContent = 'Invite link invalid or user not found.'; }
    }catch(err){ $('#message').textContent = 'Invalid token.'; }
  }
}

loadUsers();
tryAutoLoginFromToken();
