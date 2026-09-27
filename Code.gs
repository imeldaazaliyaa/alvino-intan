/**
 * RSVP Undangan Alvino & Intan -> Google Sheet
 * Tempel seluruh isi file ini di Apps Script (Extensions > Apps Script) dari Google Sheet kamu.
 */

const SHEET_NAME = 'RSVP';
const HEADERS = ['Timestamp', 'Nama', 'Kehadiran', 'Jumlah', 'Ucapan'];

function getSheet_() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sh = ss.getSheetByName(SHEET_NAME);
  if (!sh) sh = ss.insertSheet(SHEET_NAME);
  if (sh.getLastRow() === 0) {
    sh.appendRow(HEADERS);
    sh.getRange(1, 1, 1, HEADERS.length).setFontWeight('bold');
    sh.setFrozenRows(1);
  }
  return sh;
}

function json_(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}

/* Terima kiriman form RSVP dari website */
function doPost(e) {
  const lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    const data = JSON.parse(e.postData.contents || '{}');
    getSheet_().appendRow([
      new Date(),
      String(data.nama || '').slice(0, 100),
      String(data.kehadiran || ''),
      String(data.jumlah || ''),
      String(data.ucapan || '').slice(0, 1000)
    ]);
    return json_({ status: 'ok' });
  } catch (err) {
    return json_({ status: 'error', message: String(err) });
  } finally {
    lock.releaseLock();
  }
}

/* Kirim daftar ucapan ke website (?action=list), terbaru di atas */
function doGet(e) {
  if (e && e.parameter && e.parameter.action === 'list') {
    const sh = getSheet_();
    const rows = sh.getLastRow() > 1
      ? sh.getRange(2, 1, sh.getLastRow() - 1, HEADERS.length).getValues()
      : [];
    const wishes = rows
      .filter(r => String(r[4]).trim() !== '')
      .map(r => ({ nama: String(r[1]), ucapan: String(r[4]) }))
      .reverse();
    return json_(wishes);
  }
  return json_({ status: 'ok' });
}
