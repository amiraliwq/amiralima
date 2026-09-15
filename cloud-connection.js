(()=>{
'use strict';
function api(){return localStorage.getItem('amirali_api_url')||''}
function mount(){if(document.querySelector('.am-cloud-connect'))return;const b=document.createElement('button');b.className='am-cloud-connect';b.textContent=api()?'☁️ سرور متصل':'☁️ اتصال سرور';Object.assign(b.style,{position:'fixed',left:'18px',bottom:'18px',zIndex:'10070',border:0,borderRadius:'14px',padding:'9px 12px',background:'#12283b',color:'#9ff8eb',fontFamily:'Vazirmatn,sans-serif',fontWeight:'800',cursor:'pointer',boxShadow:'0 8px 25px #0007'});b.onclick=()=>{const old=api();const url=prompt('نشانی API سرور امیرعلی را وارد کنید:',old);if(url!==null){const clean=url.trim().replace(/\/$/,'');if(clean)localStorage.setItem('amirali_api_url',clean);else localStorage.removeItem('amirali_api_url');location.reload()}};document.body.appendChild(b)}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',mount);else mount();
})();
