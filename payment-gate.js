(()=>{
'use strict';
const read=()=>{try{return JSON.parse(localStorage.getItem('amirali_session')||'null')}catch{return null}};
const sync=()=>{const admin=read()?.role==='admin';document.querySelectorAll('.am-payment-fab').forEach(el=>{el.style.display=admin?'none':''});document.querySelectorAll('.am-payment-overlay').forEach(el=>{if(admin)el.remove()});document.querySelectorAll('.card-number,.am-card-number').forEach(el=>{if(admin)el.closest('.setting-card,.card,.am-payment-box')?.classList.add('admin-hidden-payment')});};
const style=document.createElement('style');style.textContent='.admin-hidden-payment{display:none!important}';document.head.appendChild(style);
new MutationObserver(sync).observe(document.body,{childList:true,subtree:true});window.addEventListener('storage',sync);setInterval(sync,800);sync();
})();