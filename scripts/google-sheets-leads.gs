const SPREADSHEET_ID = '11HF1g7LuUsqYvkrpj-CIEx5GGXu3GvLNzFHJ1LNeBxY';
const LEADS_SHEET_NAME = 'Leads';

const HEADERS = [
  'Submitted At',
  'Name',
  'Email',
  'Phone',
  'Business Type',
  'Biggest Growth Bottleneck',
  'Page URL'
];

function doPost(e) {
  const payload = JSON.parse(e.postData.contents || '{}');
  const sheet = getLeadsSheet_();

  sheet.appendRow([
    payload.submitted_at || new Date().toISOString(),
    payload.name || '',
    payload.email || '',
    payload.phone || '',
    payload.business_type || '',
    payload.bottleneck || '',
    payload.page_url || ''
  ]);

  return ContentService
    .createTextOutput(JSON.stringify({ ok: true }))
    .setMimeType(ContentService.MimeType.JSON);
}

function getLeadsSheet_() {
  const spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID);
  const sheet = spreadsheet.getSheetByName(LEADS_SHEET_NAME) || spreadsheet.insertSheet(LEADS_SHEET_NAME);

  if (sheet.getLastRow() === 0) {
    sheet.appendRow(HEADERS);
    sheet.setFrozenRows(1);
  }

  return sheet;
}
