// Create a custom Menu to export the current sheet to XML
// Developed by @danperrout

function onOpen() {
  var ui = SpreadsheetApp.getUi();
  // Or DocumentApp or FormApp.
  ui.createMenu('Custom Export')
      .addItem('To XML...', 'dlFile')
      .addSeparator()
      .addSubMenu(ui.createMenu('Sub-menu')
          .addItem('Second item', 'menuItem2'))
      .addToUi();
}

function toXml() {
  const [headers, ...rows] = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet().getDataRange().getValues();
  let xmlString = ''
  rows.forEach((r, i) => {
    xmlString += `<${headers[0]}="${r[0]}">\n`
    r.forEach((c, j) => {
      if (j != 0) { xmlString += `\t<${headers[j]}>${c}</${headers[j]}>\n` }
      if (j == (headers.length-1)) { xmlString += `</${headers[0]}>\n` }
    })
  })
  console.log (xmlString)
  return xmlString
}

// Run when you click "Download a file!"
function dlFile() {
  let file = DriveApp.getRootFolder().createFile('Output.xml', toXml());

  // Create little HTML popup with the URL of the download
  let htmlTemplate = HtmlService.createTemplateFromFile('Download.html');
  htmlTemplate.dataFromServerTemplate = { url: file.getDownloadUrl() };

  let html = htmlTemplate
    .evaluate()
    .setWidth(400)
    .setHeight(300);

  SpreadsheetApp.getUi()
    .showModalDialog(html, 'Download');
};