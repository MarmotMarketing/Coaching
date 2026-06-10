# Google Sheets Lead Capture

Sheet:
https://docs.google.com/spreadsheets/d/11HF1g7LuUsqYvkrpj-CIEx5GGXu3GvLNzFHJ1LNeBxY/edit?usp=sharing

## Setup

1. Open the Google Sheet.
2. Go to Extensions > Apps Script.
3. Paste the contents of `scripts/google-sheets-leads.gs`.
4. Deploy > New deployment.
5. Select type: Web app.
6. Execute as: Me.
7. Who has access: Anyone.
8. Click Deploy, approve the requested permissions, then copy the full Web app URL ending in `/exec`.
9. Create `.env` from `.env.example` and set:

```bash
PUBLIC_LEADS_ENDPOINT="PASTE_WEB_APP_URL_HERE"
```

10. Restart the Astro dev server.

## Submitted Fields

- Submitted At
- Name
- Email
- Phone
- Business Type
- Biggest Growth Bottleneck
- Page URL

The form uses a simple browser POST to the Apps Script endpoint, which then appends the lead to the `Leads` tab in the spreadsheet.

## Troubleshooting

If the browser console shows a `401` error for `script.google.com/macros/.../exec`, the form is reaching Google but the Web App is not publicly available.

Check these settings in Apps Script:

- Deploy > Manage deployments > Edit.
- Execute as: Me.
- Who has access: Anyone.
- Save as a new deployment version if prompted.
- Copy the Web app URL, not the deployment ID.
- The URL in `.env` must look like:

```bash
PUBLIC_LEADS_ENDPOINT="https://script.google.com/macros/s/AKfy.../exec"
```

After changing `.env`, restart Astro.
