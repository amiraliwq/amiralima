(()=>{
'use strict';
const load=(k,d)=>{try{return JSON.parse(localStorage.getItem(k))??d}catch{return d}};
const save=(k,v)=>localStorage.setItem(k,JSON.stringify(v));
const fa=n=>String(n).replace(/\d/g,d=>'۰۱۲۳۴۵۶۷۸۹'[d]);
const now=new Date();
const pad=n=>String(n).padStart(2,'0');
function toDateTime(date,time){return date&&time?`${date}T${time}`:''}
function meta(){return load('amirali_class_meta',{})}
function setMeta(v){save('amirali_class_meta',v)}
function enhanceAdminModal(){
 const modal=[...document.querySelectorAll('.modal')].find(x=>/ایجاد کلاس آنلاین|برگزاری کلاس/.test(x.textContent));
 if(!modal||modal.dataset.classEnhanced==='1')return;
 const form=modal.querySelector('form');if(!form)return;
 modal.dataset.classEnhanced='1';
 const scheduled=form.querySelector('[name="scheduledAt"]');
 if(scheduled){
   scheduled.type='hidden';
   const wrap=document.createElement('div');wrap.className='am-class-schedule';
   wrap.innerHTML=`<div><label>📅 تاریخ برگزاری</label><input name="classDate" type="date" required value="${now.getFullYear()}-${pad(now.getMonth()+1)}-${pad(now.getDate())}"></div><div><label>⏰ ساعت شروع</label><input name="classTime" type="time" required value="18:00"></div>`;
   scheduled.parentElement.insertBefore(wrap,scheduled);
 }
 const link=form.querySelector('[name="meetingUrl"]');
 if(link){
   const p=document.createElement('select');p.name='classPlatform';p.innerHTML='<option value="google-meet">Google Meet</option><option value="alocam">الوکام</option>';p.className='am-class-platform';
   link.parentElement.insertBefore(p,link);link.placeholder='نشانی جلسه را در روز کلاس وارد کن؛ مثال https://meet.google.com/...';
   const note=document.createElement('small');note.className='am-class-note';note.textContent='لینک می‌تواند همان روز کلاس وارد یا اصلاح شود. دانش‌آموز فقط در زمان مجاز آن را می‌بیند.';link.parentElement.appendChild(note);
 }
 form.addEventListener('submit',()=>{
   const data=new FormData(form);const title=data.get('title'),date=data.get('classDate'),time=data.get('classTime'),platform=data.get('classPlatform')||'google-meet';
   const url=data.get('meetingUrl');
   if(title&&date&&time){const m=meta();m[`${title}|${date}|${time}`]={date,time,platform,url:String(url||'').trim(),updatedAt:Date.now()};setMeta(m)}
   scheduled&& (scheduled.value=toDateTime(date,time));
 },true);
}
function accessForUser(){
 const s=load('amirali_session',null);return s&&s.role!=='admin';
}
function userPanel(){
 if(!accessForUser())return;
 const classes=load('amirali_classes',[]),m=meta();if(!classes.length)return;
 let box=document.getElementById('am-today-classes');
 if(!box){box=document.createElement('section');box.id='am-today-classes';box.className='am-today-classes glass';document.body.appendChild(box)}
 const approved=load('amirali_access',[]).some(a=>String(a.userId)===String(load('amirali_session',{}).id));
 const rows=classes.map(c=>{const keys=Object.keys(m);const key=keys.find(k=>k.startsWith(String(c.title)+'|'));const x=key?m[key]:{};return {...c,...x}});
 const visible=rows.filter(c=>c.date||c.scheduledAt);
 box.innerHTML=`<div class="am-today-head"><div><span>🎥 کلاس‌های آنلاین</span><h2>کلاس‌های برنامه‌ریزی‌شده</h2></div><button id="am-refresh-class">↻</button></div>${!approved?'<div class="am-class-locked">🔒 برای ورود به کلاس، پرداخت دوره باید توسط مدیر تأیید شده باشد.</div>':''}<div class="am-class-list">${visible.map(c=>renderClass(c,approved)).join('')}</div>`;
 box.querySelector('#am-refresh-class').onclick=()=>userPanel();
}
function parseSchedule(c){
 if(c.date&&c.time)return new Date(`${c.date}T${c.time}:00`);
 const d=new Date(c.scheduledAt);return isNaN(d)?null:d;
}
function renderClass(c,approved){
 const start=parseSchedule(c),today=new Date(), same=start&&start.toDateString()===today.toDateString();
 const ready=approved&&start&&same&&today>=start&&String(c.meetingUrl||'').trim();
 const future=approved&&start&&start>today;
 const platform=c.platform==='alocam'?'الوکام':'Google Meet';
 let status=ready?'🟢 اکنون قابل ورود':future?`⏳ شروع در ${fa(persianDate(start))}`:same?'⏰ امروز؛ منتظر ساعت شروع':'📅 در روز تعیین‌شده فعال می‌شود';
 return `<article class="am-class-card"><div><b>${escapeHtml(c.title||'کلاس آنلاین')}</b><small>${escapeHtml(c.course||c.courseId||'دوره مرتبط')} • ${escapeHtml(platform)} • ${c.date?fa(c.date):''} ${c.time?fa(c.time):''}</small><span>${status}</span></div>${ready?`<a class="am-class-join" href="${escapeAttr(c.meetingUrl)}" target="_blank" rel="noopener noreferrer">ورود به کلاس ↗</a>`:`<button class="am-class-join disabled" disabled>${future?'هنوز شروع نشده':'ورود بسته است'}</button>`}</article>`;
}
function persianDate(d){return `${pad(d.getHours())}:${pad(d.getMinutes())}`}
function escapeHtml(s){return String(s??'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[m]))}
function escapeAttr(s){return escapeHtml(s)}
const style=document.createElement('style');style.textContent=`
.am-class-schedule{display:grid;grid-template-columns:1fr 1fr;gap:10px;margin:8px 0}.am-class-schedule label{display:block;margin-bottom:5px}.am-class-schedule input,.am-class-platform{width:100%;box-sizing:border-box}.am-class-note{display:block;color:#8fa9c2;margin-top:7px;line-height:1.7}.am-today-classes{position:fixed;left:18px;bottom:22px;width:min(520px,calc(100vw - 36px));z-index:9000;padding:18px;border:1px solid #19d3c533;background:linear-gradient(145deg,#10283a,#20203d);border-radius:22px;box-shadow:0 20px 70px #0008}.am-today-head{display:flex;justify-content:space-between;align-items:center}.am-today-head h2{margin:4px 0 12px;font-size:18px}.am-today-head span{color:#75fff0;font-weight:800}.am-today-head button{border:0;border-radius:10px;background:#ffffff10;color:#fff;padding:8px}.am-class-list{display:grid;gap:9px;max-height:45vh;overflow:auto}.am-class-card{display:flex;justify-content:space-between;align-items:center;gap:12px;padding:12px;border-radius:15px;background:#071321;border:1px solid #ffffff0d}.am-class-card b,.am-class-card small,.am-class-card span{display:block}.am-class-card small{color:#8fa9c2;margin:4px 0}.am-class-card span{font-size:12px;color:#ffd166}.am-class-join{white-space:nowrap;text-decoration:none;border:0;border-radius:11px;padding:10px 13px;background:linear-gradient(135deg,#19d3c5,#4f8cff);color:#fff;font-weight:900}.am-class-join.disabled{opacity:.45;cursor:not-allowed}.am-class-locked{padding:10px;border-radius:12px;background:#ff6b8a12;color:#ffb4c0;margin-bottom:10px}@media(max-width:700px){.am-class-schedule{grid-template-columns:1fr}.am-today-classes{left:10px;bottom:72px;width:calc(100vw - 20px)}.am-class-card{align-items:stretch;flex-direction:column}.am-class-join{text-align:center}}
`;document.head.appendChild(style);
const ob=new MutationObserver(()=>{enhanceAdminModal();userPanel()});ob.observe(document.body,{subtree:true,childList:true});setInterval(()=>{enhanceAdminModal();userPanel()},1500);enhanceAdminModal();userPanel();
})();