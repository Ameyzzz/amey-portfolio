# Amey Chopde — Portfolio Starter

Responsive dark portfolio with a Google Drive certificate gallery integration.

## Run locally
Open `index.html` in a browser. The certificate section stays in demo mode until configured.

## Connect Google Drive certificates
1. Create a dedicated Drive folder for certificates that you are comfortable making public.
2. Copy its folder ID from the URL (`/folders/FOLDER_ID`).
3. Open https://script.google.com and create a project.
4. Paste `google-apps-script/Code.gs` into the editor.
5. Replace `PASTE_YOUR_DRIVE_FOLDER_ID_HERE` with your folder ID and save.
6. Choose **Deploy → New deployment → Web app**.
7. Set **Execute as: Me** and access to **Anyone** if your account permits it. Deploy and authorize Drive access.
8. Copy the deployed web app URL.
9. Paste that URL into `CERTIFICATES_API_URL` in `script.js`.
10. Reload the site. The gallery checks every five minutes while a page is open; use Refresh to check immediately.

## Privacy
The script attempts to make each image file in the selected folder viewable by anyone with the link. Use a dedicated folder containing only certificates intended for public display. Never use a private or mixed-purpose Drive folder. Google Workspace policies may prevent public sharing.

## Resume
Export the master dossier to PDF and place it at `assets/Amey_Chopde_Master_Portfolio_Dossier.pdf`.

## Before publishing
Replace `YOUR_EMAIL@example.com` and `YOUR_USERNAME`; verify all experience descriptions and metrics; add repository links and a real dossier PDF. Dates are omitted as requested.
