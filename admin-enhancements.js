/* امکانات تکمیلی پنل مدیریت: انتخاب عکس از گالری، اعمال محتوای سایت و تنظیمات پوسته */
(function(){
  const read=k=>{try{return JSON.parse(localStorage.getItem(k))||{}}catch{return{}}};
  const write=(k,v)=>localStorage.setItem(k,JSON.stringify(v));
  const apply=()=>{
    const c=read('amirali_content');
    if(c.siteTitle) document.title=c.siteTitle;
    document.querySelectorAll('h1').forEach(el=>{if(el.textContent.includes('آکادمی و بازار'))el.textContent=c.heroTitle||el.textContent});
    document.querySelectorAll('.hero p').forEach(el=>{if(c.heroText)el.textContent=c.heroText});
    const s=read('amirali_settings');
    if(s.primary)document.documentElement.style.setProperty('--primary',s.primary);
    if(s.secondary)document.documentElement.style.setProperty('--secondary',s.secondary);
  };
  const imageMap=new WeakMap();
  document.addEventListener('change',e=>{
    const input=e.target;
    if(input instanceof HTMLInputElement&&input.type==='file'&&input.accept.includes('image')){
      const file=input.files&&input.files[0]; if(!file)return;
      const reader=new FileReader(); reader.onload=()=>{imageMap.set(input.form,reader.result);input.form?.setAttribute('data-gallery-image','selected')}; reader.readAsDataURL(file);
    }
  },true);
  document.addEventListener('submit',e=>{
    const form=e.target;
    if(!(form instanceof HTMLFormElement)||!form.querySelector('input[type=file][accept*="image"]'))return;
    const image=imageMap.get(form); if(!image)return;
    e.preventDefault(); e.stopImmediatePropagation();
    const data=Object.fromEntries(new FormData(form));
    const products=read('amirali_products') instanceof Array?read('amirali_products'):[];
    const p={id:Date.now(),title:data.title,description:data.description,price:Number(data.price||0),stock:Number(data.stock||0),type:data.type||'physical_hardware',category:data.category||'عمومی',imageUrl:image};
    write('amirali_products',[...products,p]);
    alert('محصول با عکس انتخاب‌شده از گالری ذخیره شد.'); location.reload();
  },true);
  const observer=new MutationObserver(apply); observer.observe(document.documentElement,{subtree:true,childList:true});
  setInterval(apply,1000); apply();
})();
