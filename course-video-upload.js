(()=>{
'use strict';
const api=()=>window.AmirAliCloud?.api?.()||localStorage.getItem('amirali_api_url')||'';
const setup=()=>{
  const form=[...document.querySelectorAll('.modal-form')].find(f=>f.querySelector('input[name="videoUrl"]'));
  if(!form||form.dataset.videoUploadReady)return;
  form.dataset.videoUploadReady='1';
  const url=form.querySelector('input[name="videoUrl"]');
  url.required=false;
  url.placeholder='لینک ویدئو (اختیاری؛ یا فایل را انتخاب کنید)';
  const label=document.createElement('label');
  label.className='am-video-picker';
  label.innerHTML='🎬 انتخاب فایل ویدئوی آموزشی از گوشی/کامپیوتر<input type="file" accept="video/mp4,video/webm,video/quicktime,video/x-matroska" style="display:none"><span class="am-video-info"></span>';
  url.parentNode.insertBefore(label,url);
  const input=label.querySelector('input'),info=label.querySelector('.am-video-info');
  let selected=null;
  input.onchange=()=>{selected=input.files?.[0]||null;if(!selected)return;info.textContent=`✓ ${selected.name} • ${(selected.size/1024/1024).toFixed(1)} MB`;};
  form.addEventListener('submit',async e=>{
    if(form.dataset.uploading==='1'||form.dataset.videoNativeSubmit==='1'||!selected)return;
    e.preventDefault();e.stopImmediatePropagation();
    const base=api();
    if(!base){alert('برای آپلود واقعی ویدئو، ابتدا «اتصال سرور» را تنظیم و وارد حساب مدیر شوید.');return;}
    const courseId=form.querySelector('[name="courseId"]')?.value;
    if(!courseId){alert('ابتدا دوره را انتخاب کنید.');return;}
    if(selected.size>500*1024*1024){alert('حجم ویدئو نباید بیشتر از ۵۰۰ مگابایت باشد.');return;}
    form.dataset.uploading='1';
    const btn=form.querySelector('button[type="submit"]')||form.querySelector('button');
    const old=btn?.innerHTML;if(btn){btn.disabled=true;btn.innerHTML='⏳ در حال آپلود ویدئو...';}
    try{
      const fd=new FormData();fd.append('video',selected);fd.append('productId',courseId);
      const r=await fetch(base.replace(/\/$/, '')+'/api/admin/course-videos',{method:'POST',body:fd,credentials:'include'});
      const data=await r.json().catch(()=>({}));
      if(!r.ok)throw new Error(data.message||'آپلود ویدئو ناموفق بود');
      url.value=base.replace(/\/$/,'')+data.url;
      selected=null;input.value='';info.textContent='✓ ویدئو روی سرور ذخیره شد';
      form.dataset.videoNativeSubmit='1';
      if(btn){btn.disabled=false;btn.innerHTML=old||'ذخیره';}
      form.requestSubmit();
    }catch(err){
      alert(err.message);form.dataset.uploading='';if(btn){btn.disabled=false;btn.innerHTML=old||'ذخیره';}
    }
  },true);
};
const style=document.createElement('style');style.textContent='.am-video-picker{display:flex;align-items:center;justify-content:center;flex-wrap:wrap;gap:8px;padding:15px;border:1px dashed #4fdcff88;border-radius:14px;background:linear-gradient(135deg,#12bde512,#8b5cf612);color:#75e7ff;cursor:pointer;font-weight:800;text-align:center}.am-video-picker:hover{background:#18c7ff18}.am-video-info{font-size:11px;color:#9db9d5;font-weight:600}.modal-form input[type="url"][name="videoUrl"]{border-color:#ffffff18}';document.head.appendChild(style);
new MutationObserver(setup).observe(document.body,{childList:true,subtree:true});setInterval(setup,700);setup();
})();
