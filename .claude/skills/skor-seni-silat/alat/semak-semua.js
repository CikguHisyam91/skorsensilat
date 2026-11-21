// Semakan menyeluruh: setiap kategori contoh x setiap tab KP + tetingkap ubah markah + cetak borang
// + skrin juri (telefon 360px) + penonton. Mesti keluar "errs []".
// Guna (selepas bina-ujian.sh): node .claude/skills/skor-seni-silat/alat/semak-semua.js
const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch();const ctx=await b.newContext({viewport:{width:1300,height:950}});const e=[];
const kp=await ctx.newPage();kp.on('pageerror',x=>e.push('KP '+x.message));kp.on('dialog',d=>d.accept());
await kp.goto('http://localhost:8767/app.html?v=kp&auto=1');await kp.evaluate(()=>{localStorage.clear();sessionStorage.clear()});await kp.reload();await kp.waitForTimeout(1500);
const j=await ctx.newPage();await j.setViewportSize({width:360,height:780});j.on('pageerror',x=>e.push('JURI '+x.message));await j.goto('http://localhost:8767/app.html?v=juri&j=1&auto=1');
const p=await ctx.newPage();p.on('pageerror',x=>e.push('PENONTON '+x.message));await p.goto('http://localhost:8767/app.html?v=penonton');await kp.waitForTimeout(1200);
const ids=await kp.evaluate(()=>ST.meta.senarai.map(x=>x.id));
for(const id of ids){
  await kp.evaluate(id=>pilihKat(id),id);await kp.waitForTimeout(500);
  for(const t of ['live','senarai','masa','keputusan']){await kp.evaluate(t=>{TAB=t;render();},t);await kp.waitForTimeout(150);}
  await kp.evaluate(()=>{TAB='live';render();});
  const pid=await kp.evaluate(()=>ST.kat.peserta.length?susunUndian(ST.kat.peserta)[0].id:'');
  if(pid){await kp.evaluate(pid=>kp('semasa',pid),pid);await kp.waitForTimeout(500);
    await kp.evaluate(pid=>{editMarkah(pid,1);tutupModal();cetakBorang(pid);},pid).catch(x=>e.push('edit '+x.message));}
  await j.waitForTimeout(300);
  console.log(id,await kp.evaluate(()=>ST.kat.jenis+' '+ST.kat.nama));
}
console.log('errs',e);await b.close();})();
