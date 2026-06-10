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

## Email Notifications

The Apps Script also sends each new lead to:

```text
simon@marmot.com.au
```

If you change `scripts/google-sheets-leads.gs`, redeploy the Apps Script Web App:

1. Deploy > Manage deployments.
2. Edit the existing Web App deployment.
3. Select New version.
4. Deploy.
5. Approve permissions if Google prompts for email-sending access.

Keep these deployment settings:

- Execute as: Me.
- Who has access: Anyone.

If a test submission writes to Sheets but no email arrives, authorise the mail permission manually:

1. In Apps Script, select `authorizeMailApp` from the function dropdown.
2. Click Run.
3. Approve the requested email permission.
4. Confirm Simon receives the authorisation email.
5. Redeploy the Web App as a new version.

## Submitted Fields

- Submitted At
- Name
- Email
- Phone
- Business Type
- Biggest Growth Bottleneck
- Page URL

The form uses a simple browser POST to the Apps Script endpoint, which then appends the lead to the `Leads` tab in the spreadsheet and emails Simon.

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
