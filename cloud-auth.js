(()=>{
'use strict';
const getApi=()=>localStorage.getItem('amirali_api_url')||window.AMIRALI_API_URL||'';
async function syncAuth(form){const api=getApi();if(!api)return;const data=Object.fromEntries(new FormData(form));try{const isRegister=!!form.querySelector('[name="confirmPassword"]');await fetch(api.replace(/\/$/,'')+(isRegister?'/api/auth/register':'/api/auth/login'),{method:'POST',headers:{'Content-Type':'application/json'},credentials:'include',body:JSON.stringify(isRegister?data:{username:data.username,password:data.password})});}catch(e){console.warn('AmirAli cloud auth:',e.message)}}
document.addEventListener('submit',e=>{if(e.target instanceof HTMLFormElement)syncAuth(e.target)},true);
window.AmirAliCloud={api:()=>getApi(),request:async(path,options={})=>{const api=getApi();if(!api)throw new Error('API URL تنظیم نشده است');return fetch(api.replace(/\/$/,'')+path,{credentials:'include',...options})}};
})();
