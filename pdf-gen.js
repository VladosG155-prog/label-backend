import fs from 'fs'
import PDFDocument from 'pdfkit'

// Sample input data (replace with actual request data)
const requestData = {
  licensor: 'Иванов Иван Иванович',
  tableData: [
    {
      title: 'Произведение 1',
      musicAuthor: 'Петров П.П.',
      licensorShare: '50%',
      performer: 'Сидоров А.А.',
      creationYear: '2023',
      copyrightVolume: 'Полное использование',
      relatedRightsVolume: 'Полное использование'
    },
    {
      title: 'Произведение 2',
      musicAuthor: 'Смирнов В.В.',
      licensorShare: '75%',
      performer: 'Козлов Б.Б.',
      creationYear: '2024',
      copyrightVolume: 'Частичное использование',
      relatedRightsVolume: 'Частичное использование'
    }
  ]
};

// Create a new PDF document
const doc = new PDFDocument({ size: 'A4', margin: 50 });
doc.pipe(fs.createWriteStream('license_agreement.pdf'));

// Register a font that supports Cyrillic characters
doc.font('./times.ttf'); // Using Times-Roman, available in texlive-fonts-extra
doc.fontSize(12);

// Helper function to add text with wrapping
function addWrappedText(text, x, y, maxWidth) {
  doc.text(text, x, y, { width: maxWidth, align: 'justify' });
}

// Helper function to add a new page
function addNewPage() {
  doc.addPage();
  doc.fontSize(12);
}

// Page 1: Header and Subject
doc.text('ЛИЦЕНЗИОННЫЙ ДОГОВОР № 886', 50, 50, { align: 'center' });
doc.text('г. Москва', 50, 70, { align: 'center' });
doc.text('12.05.2024 г.', 50, 90, { align: 'center' });

const licensorText = `${requestData.licensor}, далее - Лицензиар, с одной стороны, и Егор Тимофеевич Сабодин, далее - Лицензиат, с другой стороны, совместно именуемые Стороны, заключили настоящий Договор о нижеследующем:`;
addWrappedText(licensorText, 50, 110, 500);

doc.moveDown(2);
doc.text('1. ПРЕДМЕТ ДОГОВОРА', 50, doc.y);
addWrappedText('1.1. Лицензиар предоставляет Лицензиату право использования объектов авторских и смежных прав, указанных в Приложении №1 к настоящему Договору, в пределах, установленных настоящим Договором.', 50, doc.y, 500);
addWrappedText('[Дополнительные пункты предмета договора отсутствуют из-за усечения текста в OCR]', 50, doc.y, 500); // Placeholder for truncated content

// Page 2: Rights and Obligations (handling garbled text)
addNewPage();
doc.text('Дог. № 886', 50, 50, { align: 'center' });
doc.text('2. ПРАВА И ОБЯЗАННОСТИ СТОРОН', 50, 70);
addWrappedText('2.1. Лицензиат обязуется использовать объекты без взимания платы с пользователей в целях, указанных в настоящем Договоре.', 50, doc.y, 500);
addWrappedText('[Дополнительные пункты прав и обязанностей отсутствуют из-за поврежденной кодировки в OCR]', 50, doc.y, 500); // Placeholder for garbled text

// Page 3: Usage Rights
addNewPage();
doc.text('Дог. № 886', 50, 50, { align: 'center' });
doc.text('3. ИСПОЛЬЗОВАНИЕ ОБЪЕКТОВ', 50, 70);
addWrappedText('3.1. Лицензиат имеет право использовать объекты без взимания платы с пользователей в целях, указанных в настоящем Договоре.', 50, doc.y, 500);
addWrappedText('[Дополнительные пункты использования объектов отсутствуют из-за поврежденной кодировки в OCR]', 50, doc.y, 500); // Placeholder for garbled text

// Page 4: Appendix 1 (Table)
addNewPage();
doc.text('Дог. № 886', 50, 50, { align: 'center' });
doc.text('Приложение №1 к Лицензионному Договору № 886', 50, 70, { align: 'center' });
doc.moveDown(1);

// Table headers
const tableTop = doc.y;
const tableLeft = 50;
const colWidths = [120, 100, 80, 80, 60, 100, 100];
const headers = [
  'Название Произведения/Исполнения/Фонограммы',
  'Автор музыки',
  'Доля Лицензиара',
  'Исполнитель',
  'Год создания',
  'Объем передаваемых авторских прав',
  'Объем передаваемых смежных прав'
];

// Draw table headers
headers.forEach((header, i) => {
  doc.text(header, tableLeft + colWidths.slice(0, i).reduce((a, b) => a + b, 0), tableTop, {
    width: colWidths[i],
    align: 'center'
  });
});

// Draw table rows
let currentY = tableTop + 30;
requestData.tableData.forEach(row => {
  doc.text(row.title, tableLeft, currentY, { width: colWidths[0], align: 'center' });
  doc.text(row.musicAuthor, tableLeft + colWidths[0], currentY, { width: colWidths[1], align: 'center' });
  doc.text(row.licensorShare, tableLeft + colWidths[0] + colWidths[1], currentY, { width: colWidths[2], align: 'center' });
  doc.text(row.performer, tableLeft + colWidths[0] + colWidths[1] + colWidths[2], currentY, { width: colWidths[3], align: 'center' });
  doc.text(row.creationYear, tableLeft + colWidths[0] + colWidths[1] + colWidths[2] + colWidths[3], currentY, { width: colWidths[4], align: 'center' });
  doc.text(row.copyrightVolume, tableLeft + colWidths[0] + colWidths[1] + colWidths[2] + colWidths[3] + colWidths[4], currentY, { width: colWidths[5], align: 'center' });
  doc.text(row.relatedRightsVolume, tableLeft + colWidths[0] + colWidths[1] + colWidths[2] + colWidths[3] + colWidths[4] + colWidths[5], currentY, { width: colWidths[6], align: 'center' });
  currentY += 30;
});

// Page 5: Reporting
addNewPage();
doc.text('Дог. № 886', 50, 50, { align: 'center' });
doc.text('6. ОТЧЕТНОСТЬ', 50, 70);
addWrappedText('6.1. Лицензиат ежеквартально, в течение 90 (девяноста) календарных дней с момента окончания квартала (Отчетного периода), представляет Лицензиару отчетную ведомость об использовании Объектов по письменному запросу Лицензиара. Отчетная ведомость представляется Лицензиару в авторизованной форме.', 50, doc.y, 500);
addWrappedText('6.1.1. Срок представления оригинала отчетной ведомости Лицензиару составляет 10 (десять) календарных дней с момента окончания квартала.', 50, doc.y, 500);
addWrappedText('[Дополнительные пункты отчетности отсутствуют из-за усечения текста в OCR]', 50, doc.y, 500); // Placeholder for truncated content

// Page 6: Final Provisions
addNewPage();
doc.text('Дог. № 886', 50, 50, { align: 'center' });
doc.text('9. ЗАКЛЮЧИТЕЛЬНЫЕ ПОЛОЖЕНИЯ', 50, 70);
addWrappedText('9.1. Настоящий Договор вступает в силу с момента подписания его Сторонами и действует до окончания Срока в отношении соответствующих Объектов.', 50, doc.y, 500);
addWrappedText('9.2. В случае, если ни одна из Сторон не уведомит другую о своем намерении расторгнуть Договор по окончании Срока не позднее, чем за 4 (четыре) месяца до даты окончания Срока в отношении соответствующих Объектов, то Договор автоматически продлевается на 1 (один) год.', 50, doc.y, 500);
addWrappedText('[Дополнительные пункты заключительных положений отсутствуют из-за усечения текста в OCR]', 50, doc.y, 500); // Placeholder for truncated content

// Page 7: Details and Signatures
addNewPage();
doc.text('10. РЕКВИЗИТЫ И ПОДПИСИ СТОРОН', 50, 50);
addWrappedText('Лицензиар: [Реквизиты Лицензиара]', 50, doc.y, 500);
addWrappedText('Лицензиат: Егор Тимофеевич Сабодин, [Реквизиты Лицензиата]', 50, doc.y, 500);

// Page 8: Appendix Header
addNewPage();
doc.text('Дог. № 886', 50, 50, { align: 'center' });
doc.text('Приложение №1 к Лицензионному Договору № 886', 50, 70, { align: 'center' });
doc.text('г. Москва', 50, 90, { align: 'center' });
doc.text('12.05.2024 г.', 50, 110, { align: 'center' });
addWrappedText(`${requestData.licensor}, далее - Лицензиар, с одной стороны.`, 50, 130, 500);
addWrappedText('[Дополнительный текст приложения отсутствует из-за усечения текста и поврежденной кодировки в OCR]', 50, doc.y, 500); // Placeholder for truncated content

// Page 9: Minimal Content
addNewPage();
doc.text('$9$', 50, 50); // Likely an OCR error, included as-is

// Page 10: Repeated Header
addNewPage();
doc.text('г. Москва', 50, 50, { align: 'center' });
doc.text('12.06.2024 г.', 50, 70, { align: 'center' });
addWrappedText(`${requestData.licensor}, далее - Лицензиар, с одной стороны.`, 50, 90, 500);
addWrappedText('[Дополнительный текст отсутствует из-за усечения текста и поврежденной кодировки в OCR]', 50, doc.y, 500); // Placeholder for truncated content

// Page 11: Minimal Content
addNewPage();
doc.text('11 11', 50, 50); // Likely an OCR error, included as-is

// Finalize the PDF
doc.end();