// app.js
document.addEventListener("DOMContentLoaded", () => {
  const openUploadBtn = document.getElementById("openUploadBtn");
  const uploadModal = document.getElementById("uploadModal");
  const closeUploadBtn = document.getElementById("closeUploadBtn");
  const cancelUpload = document.getElementById("cancelUpload");
  const uploadForm = document.getElementById("uploadForm");
  const productImageInput = document.getElementById("productImage");
  const imagePreview = document.getElementById("imagePreview");
  const productsGrid = document.getElementById("productsGrid");
  const searchInput = document.getElementById("searchInput");

  // نمونه محصولات اولیه
  const initialProducts = [
    { name: "هدفون بلوتوث", price: 280000, src: "https://via.placeholder.com/400x300?text=Headphone" },
    { name: "کتاب توسعه شخصی", price: 65000, src: "https://via.placeholder.com/400x300?text=Book" },
    { name: "ظروف سرامیکی", price: 150000, src: "https://via.placeholder.com/400x300?text=Kitchen" }
  ];

  let products = [...initialProducts];

  // باز/بستن مودال
  openUploadBtn.addEventListener("click", () => {
    uploadModal.classList.remove("hidden");
  });
  closeUploadBtn.addEventListener("click", () => uploadModal.classList.add("hidden"));
  cancelUpload.addEventListener("click", () => uploadModal.classList.add("hidden"));

  // پیش‌نمایش عکس
  productImageInput.addEventListener("change", (e) => {
    const file = e.target.files[0];
    imagePreview.innerHTML = "";
    if (!file) {
      imagePreview.innerHTML = '<span class="hint">پیش‌نمایش عکس اینجا ظاهر می‌شود</span>';
      return;
    }
    const img = document.createElement("img");
    img.alt = "preview";
    imagePreview.appendChild(img);

    const reader = new FileReader();
    reader.onload = (ev) => {
      img.src = ev.target.result;
    };
    reader.readAsDataURL(file);
  });

  // افزودن محصول با عکس (ذخیره در حافظه مرورگر به‌صورت dataURL)
  uploadForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const name = document.getElementById("productName").value.trim();
    const price = Number(document.getElementById("productPrice").value) || 0;
    const file = productImageInput.files[0];

    if (!name) { alert("نام محصول را وارد کنید."); return; }

    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        products.unshift({ name, price, src: ev.target.result });
        renderProducts(products);
        uploadModal.classList.add("hidden");
        uploadForm.reset();
        imagePreview.innerHTML = '<span class="hint">پیش‌نمایش عکس اینجا ظاهر می‌شود</span>';
      };
      reader.readAsDataURL(file);
    } else {
      // اگر عکس آپلود نشد به‌صورت پیش‌فرض از placeholder استفاده کن
      products.unshift({ name, price, src: "https://via.placeholder.com/400x300?text=No+Image" });
      renderProducts(products);
      uploadModal.classList.add("hidden");
      uploadForm.reset();
      imagePreview.innerHTML = '<span class="hint">پیش‌نمایش عکس اینجا ظاهر می‌شود</span>';
    }
  });

  // رندر کارت‌ها
  function renderProducts(list) {
    productsGrid.innerHTML = "";
    if (list.length === 0) {
      productsGrid.innerHTML = "<p>هیچ محصولی وجود ندارد.</p>";
      return;
    }
    list.forEach((p, idx) => {
      const card = document.createElement("article");
      card.className = "card";
      card.innerHTML = `
        <div class="imgwrap"><img src="${p.src}" alt="${escapeHtml(p.name)}" /></div>
        <div class="title">${escapeHtml(p.name)}</div>
        <div class="price">${formatPrice(p.price)} تومان</div>
        <div style="margin-top:auto;text-align:left">
          <button class="btn" data-index="${idx}" onclick="viewProduct(${idx})">مشاهده</button>
        </div>
      `;
      productsGrid.appendChild(card);
    });
  }

  // جستجو زنده
  searchInput.addEventListener("input", (e) => {
    const q = e.target.value.trim().toLowerCase();
    const filtered = products.filter(p => p.name.toLowerCase().includes(q));
    renderProducts(filtered);
  });

  // ابزارهای کمکی
  function formatPrice(num) {
    return Number(num).toLocaleString("fa-IR");
  }
  function escapeHtml(text) {
    const div = document.createElement("div");
    div.textContent = text;
    return div.innerHTML;
  }

  // تابع مشاهده محصول (قابل گسترش)
  window.viewProduct = function(index) {
    const p = products[index];
    if (!p) return alert("محصول یافت نشد");
    alert(`${p.name}\nقیمت: ${formatPrice(p.price)} تومان`);
  };

  // اولین رندر
  renderProducts(products);
});
