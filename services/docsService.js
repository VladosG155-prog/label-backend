import fs from "fs";
import path, { dirname } from "path";
import PizZip from "pizzip";
import Docxtemplater from "docxtemplater";
import archiver from "archiver";
import { fileURLToPath } from "url";

// хелпер для форматирования дат
function formatDate(date) {
  return date.toLocaleDateString("ru-RU");
}
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export const generateDoc = async (req, res) => {
  try {
    const { artists, tracks, contractId } = req.body;

    if (!artists?.length || !tracks?.length) {
      return res.status(400).json({ message: "Артисты и треки обязательны" });
    }

    const generatedFiles = [];

    // общий шаблон
    const templatePath = path.join(__dirname, "template-half.docx");
    const content = fs.readFileSync(templatePath, "binary");

    for (const artist of artists) {
      const zip = new PizZip(content);
      const doc = new Docxtemplater(zip, { paragraphLoop: true, linebreaks: true });

      const today = new Date();
      const rightsStart = formatDate(today);

      const endDate = new Date(today);
      endDate.setFullYear(endDate.getFullYear() + 5);
      const rightsEnd = formatDate(endDate);

      const formattedDate = today.toLocaleDateString("ru-RU");

      // 🔹 Декартово произведение: каждый артист × каждый трек
      console.log(artists);

     const tracksData = [];
tracks.forEach((track, trackIndex) => {
  artists.forEach((artist) => {
    tracksData.push({
      id: trackIndex + 1, // можно нумеровать по треку или сделать уникальный счетчик
      title: track.title,
      durationMinutes: track.durationMinutes,
      durationSeconds: track.durationSeconds,
      year: track.year,
      rightsStart,
      rightsEnd,
      FIO: `${artist.lastname} ${artist.firstname} ${artist.surname || ""}`,
      nickname: artist.nickname,
      licensorShare: track.shares[artist.id] || "", // доля конкретного артиста
    });
  });
});

      doc.setData({
        // 🔹 данные текущего артиста (для шапки документа)
        id: contractId,
        FIO: `${artist.lastname} ${artist.firstname} ${artist.surname || ""}`,
        FIOSLICED: `${String(artist.firstname).substring(0, 1)}.${String(
          artist.surname
        ).substring(0, 1)}. ${artist.lastname || ""}`,
        firstname: artist.firstname || "",
        lastname: artist.lastname || "",
        surname: artist.surname || "",
        nickname: artist.nickname || "",
        username: artist.username,
        adress: artist.adress,
        postadress: artist.postadress,
        phone: artist.phone,
        email: artist.email,
        bankname: artist.bankname,
        bik: artist.bik,
        rsnumber: artist.rsnumber,
        ksnumber: artist.ksnumber,

        // 🔹 ИНН или паспорт
        documentInfo: artist.INN
          ? `ИНН: ${artist.INN}`
          : artist.documentInfo,

        // 🔹 общие данные
        dateNow: formattedDate,
        rightsStart,
        rightsEnd,

        // 🔹 треки = все артисты × все треки
        tracks: tracksData,
      });

      doc.render();

      const buffer = doc.getZip().generate({ type: "nodebuffer" });

      const fileName = `contract_${artist.username}.docx`;
      const filePath = path.join(process.cwd(), "uploads", fileName);

      fs.writeFileSync(filePath, buffer);
      generatedFiles.push({ fileName, filePath });
    }

    // архивируем все файлы
    res.setHeader("Content-Type", "application/zip");
    res.setHeader("Content-Disposition", `attachment; filename=contracts.zip`);

    const archive = archiver("zip", { zlib: { level: 9 } });
    archive.pipe(res);

    generatedFiles.forEach(file => {
      archive.file(file.filePath, { name: file.fileName });
    });

    await archive.finalize();
  } catch (error) {
    console.error("Ошибка генерации документа:", error);
    res.status(500).json({ message: "Ошибка сервера" });
  }
};

