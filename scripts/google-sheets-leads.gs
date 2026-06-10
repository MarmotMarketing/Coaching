const SPREADSHEET_ID = '11HF1g7LuUsqYvkrpj-CIEx5GGXu3GvLNzFHJ1LNeBxY';
const LEADS_SHEET_NAME = 'Leads';
const NOTIFICATION_EMAIL = 'simon@marmot.com.au,michael@localhealthmarketing.com.au';

const HEADERS = [
  'Submitted At',
  'Name',
  'Email',
  'Phone',
  'Business Type',
  'Biggest Growth Bottleneck',
  'Page URL',
  'Email Sent',
  'Email Error'
];

function doPost(e) {
  const payload = JSON.parse(e.postData.contents || '{}');
  const sheet = getLeadsSheet_();
  const notification = sendLeadNotification_(payload);

  sheet.appendRow([
    payload.submitted_at || new Date().toISOString(),
    payload.name || '',
    payload.email || '',
    payload.phone || '',
    payload.business_type || '',
    payload.bottleneck || '',
    payload.page_url || '',
    notification.sent ? 'Yes' : 'No',
    notification.error || ''
  ]);

  return ContentService
    .createTextOutput(JSON.stringify({ ok: true, emailSent: notification.sent, emailError: notification.error }))
    .setMimeType(ContentService.MimeType.JSON);
}

function getLeadsSheet_() {
  const spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID);
  const sheet = spreadsheet.getSheetByName(LEADS_SHEET_NAME) || spreadsheet.insertSheet(LEADS_SHEET_NAME);

  if (sheet.getLastRow() === 0) {
    sheet.appendRow(HEADERS);
    sheet.setFrozenRows(1);
  } else {
    ensureHeaders_(sheet);
  }

  return sheet;
}

function ensureHeaders_(sheet) {
  const currentHeaders = sheet
    .getRange(1, 1, 1, Math.max(sheet.getLastColumn(), HEADERS.length))
    .getValues()[0];

  HEADERS.forEach((header, index) => {
    if (currentHeaders[index] !== header) {
      sheet.getRange(1, index + 1).setValue(header);
    }
  });
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
    return { sent: true, error: '' };
  } catch (error) {
    console.error(`Lead notification email failed: ${error.message}`);
    return { sent: false, error: error.message };
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
