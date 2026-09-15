(()=>{
'use strict';
const read=(k,d=[])=>{try{return JSON.parse(localStorage.getItem(k))??d}catch{return d}};
const write=(k,v)=>localStorage.setItem(k,JSON.stringify(v));
const esc=s=>String(s??'').replace(/[&<>\"]/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','\"':'&quot;'}[m]));
const session=()=>read('amirali_session',null);
const courses=()=>read('amirali_products',[]).filter(p=>p.type==='course');
const assignments=()=>read('amirali_assignments',[]);
function adminUI(){
 const panels=[...document.querySelectorAll('.panel')];
 const panel=panels.find(p=>p.textContent.includes('بخش تکالیف آماده توسعه است'));
 if(!panel||panel.dataset.assignmentReady)return;
 panel.dataset.assignmentReady='1';
 const title=panel.querySelector('.panel-title');
 const manager=document.createElement('div');manager.className='am-assignment-manager';
 manager.innerHTML=`<div class="am-assignment-form"><h3>➕ ساخت تکلیف جدید</h3><div class="am-assignment-grid"><select id="amCourse" required><option value="">انتخاب دوره</option>${courses().map(c=>`<option value="${esc(c.id)}">${esc(c.title)}</option>`).join('')}</select><input id="amTitle" placeholder="عنوان تکلیف" required></div><textarea id="amDesc" placeholder="شرح تکلیف و توضیحات"></textarea><div class="am-assignment-grid"><input id="amDeadline" type="datetime-local"><button class="primary" id="amAdd">ثبت تکلیف / حداکثر نمره ۵</button></div></div><div id="amList"></div>`;
 panel.querySelector('.empty')?.replaceWith(manager); if(!panel.querySelector('#amList'))panel.append(manager);
 const render=()=>{const as=assignments();const subs=read('amirali_submissions',[]);document.querySelector('#amList').innerHTML=as.length?as.map(a=>{const c=courses().find(x=>String(x.id)===String(a.courseId));const ss=subs.filter(x=>String(x.assignmentId)===String(a.id));return `<div class="am-assignment-item"><div class="am-assignment-item-head"><div><b>${esc(a.title)}</b><div class="am-course-badge">📚 ${esc(c?.title||'دوره حذف‌شده')} ${a.deadline?' • مهلت: '+esc(a.deadline):''}</div></div><span class="am-five">۵ / ۵</span></div><p class="muted">${esc(a.description||'بدون توضیح')}</p>${ss.length?ss.map(s=>`<div class="am-submission"><span>👤 ${esc(s.username||'کاربر')} ${s.fileName?' • '+esc(s.fileName):''}</span><span>نمره فعلی: <b>${s.grade??'—'}</b> از ۵</span><input class="am-grade" type="number" min="0" max="5" step="0.25" value="${s.grade??''}" placeholder="۰ تا ۵"><button class="mini success am-save-grade" data-id="${s.id}">ذخیره نمره</button></div>`).join(''):`<div class="muted">هنوز تحویلی برای این تکلیف ثبت نشده است.</div>`}</div>`}).join(''):'<div class="empty"><h3>هنوز تکلیفی اضافه نشده</h3><p>ابتدا یک دوره بساز، سپس تکلیف را به همان دوره متصل کن.</p></div>';
 document.querySelectorAll('.am-save-grade').forEach(btn=>btn.onclick=()=>{const value=Number(btn.previousElementSibling.value);if(Number.isNaN(value)||value<0||value>5)return alert('نمره باید بین ۰ تا ۵ باشد.');const n=subs.map(s=>s.id==btn.dataset.id?{...s,grade:value,gradedAt:new Date().toISOString()}:s);write('amirali_submissions',n);render()});};
 document.querySelector('#amAdd').onclick=()=>{const courseId=document.querySelector('#amCourse').value,title=document.querySelector('#amTitle').value.trim(),description=document.querySelector('#amDesc').value.trim(),deadline=document.querySelector('#amDeadline').value;if(!courseId||!title)return alert('دوره و عنوان تکلیف را وارد کنید.');const n=[...assignments(),{id:Date.now(),courseId,title,description,deadline,maxGrade:5,createdAt:new Date().toISOString()}];write('amirali_assignments',n);document.querySelector('#amTitle').value='';document.querySelector('#amDesc').value='';render()};
 render();
}
function userUI(){
 const u=session();if(!u||u.role==='admin')return;if(document.querySelector('.am-user-assignments'))return;
 const as=assignments();if(!as.length)return;const subs=read('amirali_submissions',[]);const wrap=document.createElement('section');wrap.className='am-user-assignments panel glass';wrap.innerHTML=`<div class="panel-title"><h2>📝 تکالیف من</h2><span class="am-five">نمره از ۵</span></div>${as.map(a=>{const c=courses().find(x=>String(x.id)===String(a.courseId));const mine=subs.find(s=>String(s.assignmentId)===String(a.id)&&String(s.userId)===String(u.id));return `<div class="am-user-assignment"><b>${esc(a.title)}</b><small>📚 ${esc(c?.title||'دوره حذف‌شده')}${a.deadline?' • مهلت: '+esc(a.deadline):''}</small><div>${esc(a.description||'')}</div>${mine?`<p>وضعیت: تحویل شده ${mine.grade!=null?' • نمره: '+mine.grade+' از ۵':' • در انتظار نمره‌دهی'}</p>`:`<input type="file" class="am-submit-file" data-id="${a.id}" accept=".zip,.pdf,.js,.py,.txt,.ino,image/*"><button class="primary small am-submit-assignment" data-id="${a.id}">ارسال تکلیف</button>`}</div>`}).join('')}<a class="am-support" href="tel:09364601110">☎️ پشتیبانی: ۰۹۳۶۴۶۰۱۱۱۰</a>`;
 const host=document.querySelector('main')||document.body;host.appendChild(wrap);
 wrap.querySelectorAll('.am-submit-assignment').forEach(btn=>btn.onclick=()=>{const input=wrap.querySelector(`.am-submit-file[data-id="${btn.dataset.id}"]`),f=input?.files?.[0];if(!f)return alert('فایل تکلیف را انتخاب کنید.');const n=[...subs,{id:Date.now(),assignmentId:Number(btn.dataset.id),userId:u.id,username:u.username,fileName:f.name,submittedAt:new Date().toISOString(),grade:null}];write('amirali_submissions',n);alert('تکلیف با موفقیت ثبت شد و برای مدیر ارسال شد.');location.reload()});
}
const obs=new MutationObserver(()=>{if(session()?.role==='admin')adminUI();else userUI()});obs.observe(document.body,{subtree:true,childList:true});setTimeout(()=>{if(session()?.role==='admin')adminUI();else userUI()},500);setInterval(()=>{if(session()?.role==='admin')adminUI();else userUI()},1500);
})();