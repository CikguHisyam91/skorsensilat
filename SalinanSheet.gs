/**
 * SALINAN KEPUTUSAN KE GOOGLE SHEET — Sistem Pemarkahan Silat
 * ------------------------------------------------------------
 * Cara pasang:
 *   1. Buka script.new  (projek Apps Script baru, BUKAN dari dalam Sheet)
 *   2. Padam semua kod asal, tampal SEMUA kod ini, tekan Save.
 *   3. Deploy > New deployment > ikon gear > Web app
 *        Execute as: Me      Who has access: Anyone
 *   4. Authorize access (benarkan Drive & Sheets), salin URL Web App.
 *
 * Setiap NAMA KEJOHANAN dalam sistem = satu fail Google Sheet tersendiri,
 * disimpan dalam folder Google Drive "KEPUTUSAN SILAT".
 * Setiap kategori yang DISAHKAN = satu tab dalam fail tersebut.
 */

var NAMA_FOLDER = 'KEPUTUSAN SILAT';

function doGet() {
  return jsonOut({ ok: true, mesej: 'Sambungan Google Sheet berjaya', versi: 3 });
}

function doPost(e) {
  var lock = LockService.getScriptLock();
  lock.waitLock(30000);
  try {
    var d = JSON.parse(e.postData.contents);
    var kejohanan = String(d.kejohanan || 'KEJOHANAN TANPA NAMA').trim().toUpperCase();
    var ss = dapatkanFail(kejohanan);
    var tab = tulisKategori(ss, d, kejohanan);
    kemaskiniRingkasan(ss, d, tab);
    return jsonOut({ ok: true, fail: ss.getName(), url: ss.getUrl(), tab: tab });
  } catch (err) {
    return jsonOut({ ok: false, ralat: String(err) });
  } finally {
    lock.releaseLock();
  }
}

/* Cari atau cipta fail Sheet bagi kejohanan ini */
function dapatkanFail(kejohanan) {
  var props = PropertiesService.getScriptProperties();
  var kunci = 'ss:' + kejohanan;
  var id = props.getProperty(kunci);
  if (id) {
    try {
      if (!DriveApp.getFileById(id).isTrashed()) return SpreadsheetApp.openById(id);
    } catch (x) { /* fail dipadam terus */ }
  }
  var folder = dapatkanFolder();
  var namaFail = 'KEPUTUSAN · ' + kejohanan;
  var cari = folder.getFilesByName(namaFail);
  var ss = null;
  while (cari.hasNext()) {
    var f = cari.next();
    if (!f.isTrashed()) { ss = SpreadsheetApp.open(f); break; }
  }
  if (!ss) {
    ss = SpreadsheetApp.create(namaFail);
    DriveApp.getFileById(ss.getId()).moveTo(folder);
    var r = ss.getSheets()[0];
    r.setName('RINGKASAN');
    r.getRange(1, 1, 1, 7).setValues([['KATEGORI', 'BORANG', 'ACARA', 'PESERTA', 'DISAHKAN OLEH KP', 'DEWAN JURI', 'MASA DISAHKAN']]);
    r.getRange(1, 1, 1, 7).setFontWeight('bold').setBackground('#8c1d2c').setFontColor('#ffffff');
    r.setFrozenRows(1);
  }
  props.setProperty(kunci, ss.getId());
  return ss;
}

function dapatkanFolder() {
  var f = DriveApp.getFoldersByName(NAMA_FOLDER);
  return f.hasNext() ? f.next() : DriveApp.createFolder(NAMA_FOLDER);
}

/* Satu tab bagi setiap kategori */
function tulisKategori(ss, d, kejohanan) {
  var nama = ('SAH ' + d.kategori + ' ' + (d.acara || '')).toUpperCase().replace(/[\[\]\*\?\/\\:]/g, ' ').replace(/\s+/g, ' ').trim().slice(0, 95);
  var sh = ss.getSheetByName(nama);
  if (sh) {
    sh.getProtections(SpreadsheetApp.ProtectionType.SHEET).forEach(function (p) { p.remove(); });
    sh.clear();
  } else {
    sh = ss.insertSheet(nama);
  }
  var n = d.bilJuri || 3;
  var tajuk = ['KEDUDUKAN', 'UNDIAN', 'NAMA', 'PASUKAN'];
  for (var i = 1; i <= n; i++) tajuk.push('JURI ' + i);
  tajuk = tajuk.concat(['MASA', 'PENOLAKAN', 'JUMLAH']);
  var w = tajuk.length;
  var rows = [
    [kejohanan],
    [(d.jenis + ' — ' + d.kategori + ' — ACARA ' + (d.acara || '') + ' ' + (d.tarikh || '')).toUpperCase()],
    ['DISAHKAN: KP ' + String(d.oleh || '').toUpperCase() + ' / DJ ' + String(d.dj || '').toUpperCase() + ' — ' + Utilities.formatDate(new Date(), 'Asia/Kuala_Lumpur', 'dd/MM/yyyy HH:mm')],
    [''],
    tajuk
  ];
  (d.baris || []).forEach(function (r) {
    var row = [r.kedudukan, r.undian, String(r.nama || '').toUpperCase(), String(r.pasukan || '').toUpperCase()];
    for (var i = 0; i < n; i++) row.push(r.j && r.j[i] != null ? r.j[i] : '');
    var jum = r.papar != null && r.papar !== '' ? r.papar : r.jumlah;
    rows.push(row.concat([r.masa, r.tolak, jum]));
  });
  rows = rows.map(function (r) { while (r.length < w) r.push(''); return r.slice(0, w); });
  sh.getRange(1, 1, rows.length, w).setValues(rows);
  sh.getRange(1, 1, 3, w).setFontWeight('bold');
  sh.getRange(1, 1).setFontSize(14);
  sh.getRange(5, 1, 1, w).setFontWeight('bold').setBackground('#8c1d2c').setFontColor('#ffffff');
  sh.setFrozenRows(5);
  sh.autoResizeColumns(1, w);
  sh.protect().setDescription('Keputusan disahkan — jangan ubah');
  return nama;
}

/* Tab RINGKASAN: satu baris bagi setiap kategori */
function kemaskiniRingkasan(ss, d, tab) {
  var r = ss.getSheetByName('RINGKASAN') || ss.insertSheet('RINGKASAN', 0);
  var data = r.getDataRange().getValues();
  var baris = [String(d.kategori).toUpperCase(), d.jenis, d.acara || '', (d.baris || []).length,
    String(d.oleh || '').toUpperCase(), String(d.dj || '').toUpperCase(), Utilities.formatDate(new Date(), 'Asia/Kuala_Lumpur', 'dd/MM/yyyy HH:mm')];
  for (var i = 1; i < data.length; i++) {
    if (data[i][0] === baris[0] && data[i][2] === baris[2]) { r.getRange(i + 1, 1, 1, 7).setValues([baris]); return; }
  }
  r.appendRow(baris);
}

function jsonOut(o) {
  return ContentService.createTextOutput(JSON.stringify(o)).setMimeType(ContentService.MimeType.JSON);
}
