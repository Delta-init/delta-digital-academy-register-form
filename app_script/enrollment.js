/**
 * Delta Digital Academy — Student Enrollment Form
 * Google Apps Script (Web App)
 *
 * Sheet columns:
 *   A  Full Name                  B  Email ID
 *   C  Contact Number             D  Home Country Contact Number
 *   E  Nationality                F  Gender
 *   G  Date of Birth              H  Occupation
 *   I  Lead Source                J  Ads Platform
 *   K  Residence Address          L  Home Address / Native Address
 *   M  Preferred Language         N  Mode of Study
 *   O  Country of Attendance      P  Terms Agreed
 *   Q  Submitted At
 *   R  ID Proof File              S  Photo File
 *
 * Deploy as Web App:
 *   Execute as: Me
 *   Who has access: Anyone
 */

function doPost(e) {
  try {
    // ── 1. Open sheet ────────────────────────────────────────────────────────
    const sheet = SpreadsheetApp
      .openByUrl("https://docs.google.com/spreadsheets/d/YOUR_SPREADSHEET_ID/edit")
      .getSheetByName("Sheet1");

    // ── 2. Parse payload ─────────────────────────────────────────────────────
    const params = JSON.parse(e.postData.contents);

    // ── 3. Get / create Drive folder ─────────────────────────────────────────
    const folders = DriveApp.getFoldersByName("DELTA_ENROLLMENTS");
    const folder = folders.hasNext()
      ? folders.next()
      : DriveApp.createFolder("DELTA_ENROLLMENTS");

    // ── 4. Upload files ───────────────────────────────────────────────────────
    const fileUrls = { idProof: "", photo: "" };

    const uploadFile = (fileData, label) => {
      if (!fileData || !fileData.data || !fileData.name) return "";
      try {
        const safeName = `${params.fullName || "student"}_${label}_${Date.now()}_${fileData.name}`;
        const blob = Utilities.newBlob(
          Utilities.base64Decode(fileData.data),
          fileData.mimeType || "application/octet-stream",
          safeName
        );
        const file = folder.createFile(blob);
        file.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
        return file.getUrl();
      } catch (err) {
        Logger.log(`Upload error (${label}): ${err}`);
        return "";
      }
    };

    fileUrls.idProof = uploadFile(params.idProofFile, "id_proof");
    fileUrls.photo   = uploadFile(params.photoFile,   "photo");

    // ── 5. Append row ─────────────────────────────────────────────────────────
    const lastRow = sheet.getLastRow() + 1;

    sheet.appendRow([
      params.fullName          || "",   // A  Full Name
      params.email             || "",   // B  Email ID
      params.phone             || "",   // C  Contact Number
      params.homeCountryPhone  || "",   // D  Home Country Contact Number
      params.nationality       || "",   // E  Nationality
      params.gender            || "",   // F  Gender
      params.dob               || "",   // G  Date of Birth
      params.occupation        || "",   // H  Occupation
      params.leadSource        || "",   // I  Lead Source
      params.adsPlatform       || "",   // J  Ads Platform
      params.residenceAddress  || "",   // K  Residence Address
      params.homeAddress       || "",   // L  Home Address / Native Address
      params.preferredLanguage || "",   // M  Preferred Language
      params.modeOfStudy       || "",   // N  Mode of Study
      params.countryAttendance || "",   // O  Country of Attendance
      params.termsAgreed       || "No", // P  Terms Agreed
      new Date(),                       // Q  Submitted At
      "",                               // R  ID Proof File (link set below)
      "",                               // S  Photo File    (link set below)
    ]);

    // ── 6. Write hyperlinks for files ─────────────────────────────────────────
    const setLink = (col, url, label) => {
      if (!url) return;
      sheet.getRange(lastRow, col).setFormula(`=HYPERLINK("${url}","${label}")`);
      sheet.getRange(lastRow, col)
        .setFontColor("#1155cc")
        .setFontWeight("bold")
        .setHorizontalAlignment("center");
    };

    setLink(18, fileUrls.idProof, "ID Proof"); // column R
    setLink(19, fileUrls.photo,   "Photo");    // column S

    // ── 7. Return success ─────────────────────────────────────────────────────
    return ContentService
      .createTextOutput(JSON.stringify({
        status: "success",
        message: "Enrollment submitted successfully",
        idProofUrl: fileUrls.idProof,
        photoUrl:   fileUrls.photo,
      }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    Logger.log("Enrollment error: " + error);
    return ContentService
      .createTextOutput(JSON.stringify({
        status: "error",
        message: error.toString(),
      }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

/** Optional: handle GET for health check */
function doGet() {
  return ContentService
    .createTextOutput(JSON.stringify({ status: "ok", form: "Delta Digital Academy Enrollment" }))
    .setMimeType(ContentService.MimeType.JSON);
}
