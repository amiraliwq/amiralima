(() => {
  const CARD = '6219-8619-5696-0073';
  const OWNER = 'امیرعلی رضی خادمی';
  const BANK = 'بلو بانک';
  const nf = n => Number(n || 0).toLocaleString('fa-IR');
  const css = `
  .am-payment-fab{position:fixed;left:18px;bottom:22px;z-index:9998;border:0;border-radius:18px;padding:13px 17px;background:linear-gradient(135deg,#18b9ef,#7257ed);color:#fff;font:800 14px Vazirmatn,sans-serif;box-shadow:0 14px 40px #0007;cursor:pointer}
  .am-payment-overlay{position:fixed;inset:0;z-index:9999;background:#020817cc;backdrop-filter:blur(10px);display:none;align-items:center;justify-content:center;padding:18px}
  .am-payment-overlay.open{display:flex}
  .am-payment-box{width:min(560px,100%);max-height:92vh;overflow:auto;background:linear-gradient(145deg,#0d2036,#091426);border:1px solid #ffffff18;border-radius:24px;padding:24px;color:#eef6ff;font-family:Vazirmatn,sans-serif;box-shadow:0 30px 90px #000b}
  .am-payment-head{display:flex;justify-content:space-between;align-items:center;gap:10px}.am-payment-head h2{margin:0;font-size:24px}.am-close{border:0;background:#ffffff0d;color:#fff;border-radius:10px;width:38px;height:38px;cursor:pointer;font-size:20px}
  .am-card{margin:18px 0;padding:20px;border-radius:20px;background:linear-gradient(135deg,#173c5b,#30205b);border:1px solid #ffffff18}.am-card small{color:#a9c0d8}.am-card-number{direction:ltr;text-align:center;font:900 22px monospace;letter-spacing:1px;margin:13px 0;color:#fff}.am-owner{text-align:center;font-weight:800}.am-bank{text-align:center;color:#70e0ff;font-size:12px;margin-top:5px}
  .am-copy{display:block;margin:13px auto 0;border:1px solid #ffffff20;background:#ffffff10;color:#fff;padding:8px 13px;border-radius:10px;cursor:pointer}
  .am-payment-box label{display:block;margin:15px 0 7px;color:#adc0d5;font-size:13px}.am-payment-box input[type=file],.am-payment-box input[type=number]{width:100%;padding:12px;border:1px solid #ffffff16;background:#050e1d;color:#fff;border-radius:12px;font-family:inherit}.am-payment-submit{width:100%;margin-top:16px;border:0;border-radius:13px;padding:13px;background:linear-gradient(135deg,#20c3f2,#725be8);color:#fff;font-weight:900;cursor:pointer}.am-payment-note{color:#849ab4;font-size:12px;line-height:1.8}.am-payment-status{margin-top:13px;padding:12px;border-radius:12px;background:#13c77b18;color:#72e5b1;display:none}.am-payment-preview{max-width:100%;max-height:190px;display:none;margin-top:10px;border-radius:12px;border:1px solid #ffffff15}
  `;
  const style = document.createElement('style'); style.textContent = css; document.head.appendChild(style);
  const fab = document.createElement('button'); fab.className='am-payment-fab'; fab.textContent='💳 پرداخت و بارگذاری فیش';
  const overlay = document.createElement('div'); overlay.className='am-payment-overlay';
  overlay.innerHTML=`<div class="am-payment-box" role="dialog" aria-modal="true"><div class="am-payment-head"><h2>پرداخت و بارگذاری فیش</h2><button class="am-close" aria-label="بستن">×</button></div><div class="am-card"><small>شماره کارت مقصد</small><div class="am-card-number">${CARD}</div><div class="am-owner">${OWNER}</div><div class="am-bank">${BANK}</div><button class="am-copy" type="button">📋 کپی شماره کارت</button></div><p class="am-payment-note">پس از واریز، تصویر واضح رسید را انتخاب کنید. در نسخه GitHub Pages اطلاعات فیش فقط در مرورگر شما ذخیره می‌شود؛ برای بررسی واقعی و امن، اتصال بک‌اند لازم است.</p><label>مبلغ واریزی (تومان)</label><input class="am-amount" type="number" min="0" placeholder="مثلاً ۱۵۰۰۰۰۰"><label>تصویر فیش واریزی</label><input class="am-file" type="file" accept="image/*,.pdf"><img class="am-payment-preview" alt="پیش‌نمایش فیش"><button class="am-payment-submit" type="button">ثبت فیش واریزی</button><div class="am-payment-status"></div></div>`;
  document.body.append(fab,overlay);
  const close=()=>overlay.classList.remove('open'); fab.onclick=()=>overlay.classList.add('open'); overlay.querySelector('.am-close').onclick=close; overlay.addEventListener('click',e=>{if(e.target===overlay)close()});
  overlay.querySelector('.am-copy').onclick=async()=>{try{await navigator.clipboard.writeText(CARD.replaceAll('-',''));overlay.querySelector('.am-copy').textContent='✓ شماره کارت کپی شد'}catch{overlay.querySelector('.am-copy').textContent=CARD}};
  const file=overlay.querySelector('.am-file'), preview=overlay.querySelector('.am-payment-preview');
  file.onchange=()=>{const f=file.files?.[0];if(!f)return; if(f.type.startsWith('image/')){preview.src=URL.createObjectURL(f);preview.style.display='block'}else preview.style.display='none'};
  overlay.querySelector('.am-payment-submit').onclick=()=>{const amount=overlay.querySelector('.am-amount').value;const f=file.files?.[0];if(!amount||!f){alert('لطفاً مبلغ و تصویر فیش را وارد کنید.');return}const receipt={id:Date.now(),amount:Number(amount),fileName:f.name,createdAt:new Date().toISOString(),status:'slip_uploaded',cardLast4:CARD.slice(-4)};localStorage.setItem('amirali_last_receipt',JSON.stringify(receipt));const status=overlay.querySelector('.am-payment-status');status.textContent=`✓ فیش ثبت شد — مبلغ ${nf(amount)} تومان. وضعیت: در انتظار بررسی مدیر`;status.style.display='block'};
})();
