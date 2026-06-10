const SPREADSHEET_ID = '11HF1g7LuUsqYvkrpj-CIEx5GGXu3GvLNzFHJ1LNeBxY';
const LEADS_SHEET_NAME = 'Leads';
const NOTIFICATION_EMAIL = 'simon@marmot.com.au';

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

  const emailSent = sendLeadNotification_(payload);

  return ContentService
    .createTextOutput(JSON.stringify({ ok: true, emailSent }))
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

function sendLeadNotification_(payload) {
  const name = payload.name || 'New applicant';
  const subject = `New Marmot Coaching application: ${name}`;
  const htmlBody = `
    <h2>New Marmot Coaching application</h2>
    <p><strong>Name:</strong> ${escapeHtml_(payload.name)}</p>
    <p><strong>Email:</strong> ${escapeHtml_(payload.email)}</p>
    <p><strong>Phone:</strong> ${escapeHtml_(payload.phone)}</p>
    <p><strong>Business type:</strong> ${escapeHtml_(payload.business_type)}</p>
    <p><strong>Biggest growth bottleneck:</strong><br>${escapeHtml_(payload.bottleneck).replace(/\n/g, '<br>')}</p>
    <p><strong>Submitted at:</strong> ${escapeHtml_(payload.submitted_at)}</p>
    <p><strong>Page URL:</strong> ${escapeHtml_(payload.page_url)}</p>
    <p><a href="https://docs.google.com/spreadsheets/d/${SPREADSHEET_ID}/edit">Open the lead sheet</a></p>
  `;

  try {
    MailApp.sendEmail({
      to: NOTIFICATION_EMAIL,
      subject,
      htmlBody
    });
    return true;
  } catch (error) {
    console.error(`Lead notification email failed: ${error.message}`);
    return false;
  }
}

function authorizeMailApp() {
  MailApp.sendEmail({
    to: NOTIFICATION_EMAIL,
    subject: 'Marmot Coaching lead notifications authorised',
    htmlBody: '<p>Email notifications are authorised and ready for Marmot Coaching leads.</p>'
  });
}

function escapeHtml_(value) {
  return String(value || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}
