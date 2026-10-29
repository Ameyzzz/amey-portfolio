const FOLDER_ID = "1jnNi21Fsp2haCl5szdlItF_afRzlGBGF";

/**
 * Returns certificate images from the configured Google Drive folder.
 *
 * Expected JSON:
 * {
 *   "files": [
 *     {
 *       "name": "Certificate name",
 *       "imageUrl": "https://...",
 *       "webViewLink": "https://..."
 *     }
 *   ]
 * }
 */
function doGet() {
  try {
    const folder = DriveApp.getFolderById(FOLDER_ID);
    const iterator = folder.getFiles();
    const files = [];

    while (iterator.hasNext()) {
      const file = iterator.next();

      if (file.isTrashed()) continue;

      const mimeType = file.getMimeType();

      // This gallery displays image files only.
      if (!mimeType.startsWith("image/")) continue;

      const id = file.getId();

      files.push({
        id: id,
        name: file.getName(),
        mimeType: mimeType,
        imageUrl:
          "https://drive.google.com/thumbnail?id=" +
          encodeURIComponent(id) +
          "&sz=w1600",
        webViewLink: file.getWebViewLink()
      });
    }

    files.sort((a, b) =>
      a.name.localeCompare(b.name, undefined, {
        numeric: true,
        sensitivity: "base"
      })
    );

    return jsonResponse({
      success: true,
      count: files.length,
      files: files
    });
  } catch (error) {
    return jsonResponse({
      success: false,
      error: String(error.message || error),
      files: []
    });
  }
}

function jsonResponse(data) {
  return ContentService
    .createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}