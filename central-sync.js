(()=>{
'use strict';
const api=()=>localStorage.getItem('amirali_api_url')||window.AMIRALI_API_URL||'';
const keys=['amirali_products','amirali_lessons','amirali_classes','amirali_orders','amirali_receipts','amirali_assignments','amirali_submissions','amirali_content','amirali_settings'];
const clean=v=>{if(!Array.isArray(v))return v;if(v.length&&typeof v[0]==='object')return v.map(x=>{const y={...x};delete y.password;delete y.passwordHash;return y});return v};
async function sync(){const base=api().replace(/\/$/,'');if(!base)return;let user={};try{user=JSON.parse(localStorage.getItem('amirali_user')||'{}')}catch{};if(user.role!=='admin')return;const state={};for(const k of keys){try{const v=JSON.parse(localStorage.getItem(k));if(v!==null)state[k]=clean(v)}catch{}}try{await fetch(base+'/api/admin/state-sync',{method:'POST',credentials:'include',headers:{'Content-Type':'application/json'},body:JSON.stringify({state})})}catch(e){console.warn('central sync',e.message)}}
window.AmirAliCentralSync={sync};
setTimeout(sync,1800);setInterval(sync,12000);window.addEventListener('storage',()=>sync());
})();
