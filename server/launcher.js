import fs from 'fs';

// Adds digital-product publishing rules and file/code storage to the existing API.
const sourcePath = new URL('./index.js', import.meta.url);
let source = fs.readFileSync(sourcePath, 'utf8');
const assetRoutes = `
if(pool) await db(\`CREATE TABLE IF NOT EXISTS digital_assets(id SERIAL PRIMARY KEY,product_id INTEGER UNIQUE REFERENCES products(id) ON DELETE CASCADE,file_url TEXT,original_name TEXT,file_size BIGINT,asset_kind TEXT NOT NULL,source_code TEXT,created_at TIMESTAMPTZ DEFAULT now())\`);
app.post('/api/admin/digital-assets',auth,admin,upload.single('zip'),async(req,res)=>{try{const productId=Number(req.body.productId);const kind=req.body.kind==='source_code'?'source_code':'zip';const code=String(req.body.sourceCode||'');if(!productId)return res.status(400).json({message:'محصول دیجیتال مشخص نشده است'});if(kind==='zip'&&!req.file)return res.status(400).json({message:'برای محصول دیجیتال فایل ZIP را انتخاب کنید'});if(kind==='source_code'&&!code.trim())return res.status(400).json({message:'کد برنامه‌نویسی را وارد کنید'});const p=await db('SELECT id,type FROM products WHERE id=$1',[productId]);if(!p.rowCount)return res.status(404).json({message:'محصول پیدا نشد'});if(p.rows[0].type!=='digital_asset')return res.status(400).json({message:'این محصول از نوع دیجیتال نیست'});const url=req.file?'/uploads/'+req.file.filename:null;const r=await db('INSERT INTO digital_assets(product_id,file_url,original_name,file_size,asset_kind,source_code) VALUES($1,$2,$3,$4,$5,$6) ON CONFLICT(product_id) DO UPDATE SET file_url=EXCLUDED.file_url,original_name=EXCLUDED.original_name,file_size=EXCLUDED.file_size,asset_kind=EXCLUDED.asset_kind,source_code=EXCLUDED.source_code RETURNING *',[productId,url,req.file?.originalname||null,req.file?.size||null,kind,kind==='source_code'?code:null]);await db('UPDATE products SET digital_asset_url=$1 WHERE id=$2',[url||'/api/digital-assets/'+productId,productId]);res.json({ok:true,asset:r.rows[0]})}catch(e){res.status(500).json({message:'ذخیره فایل دیجیتال ناموفق بود',detail:e.message})}});
app.get('/api/admin/digital-assets',auth,admin,async(_req,res)=>res.json((await db('SELECT * FROM digital_assets ORDER BY id DESC')).rows));
app.get('/api/digital-assets/:productId',auth,async(req,res)=>{try{const e=await db('SELECT 1 FROM enrollments WHERE user_id=$1 AND product_id=$2 AND status=$3',[req.user.id,req.params.productId,'active']);if(!e.rowCount&&req.user.role!=='admin')return res.status(403).json({message:'دسترسی فایل هنوز فعال نشده است'});const r=await db('SELECT * FROM digital_assets WHERE product_id=$1',[req.params.productId]);if(!r.rowCount)return res.status(404).json({message:'فایل دیجیتال هنوز اضافه نشده است'});res.json({asset:r.rows[0]})}catch(e){res.status(500).json({message:'خطای دریافت فایل دیجیتال'})}});
`;
if (!source.includes("CREATE TABLE IF NOT EXISTS digital_assets")) {
  const marker = "app.get('/api/health'";
  source = source.replace(marker, assetRoutes + marker);
}
await import('data:text/javascript;base64,'+Buffer.from(source).toString('base64'));
