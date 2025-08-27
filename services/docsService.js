import fs from "fs";
import PizZip from "pizzip";
import Docxtemplater from "docxtemplater";
import path from "path";
import { fileURLToPath } from "url";
import archiver from "archiver";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const formatDate = (date) => {
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();
  return `${day}.${month}.${year}`;
};

export const generateDoc = async (req, res) => {
  try {
    const { artists, tracks } = req.body;

    if (!artists?.length || !tracks?.length) {
      return res.status(400).json({ message: "Артисты и треки обязательны" });
    }

    const generatedFiles = [];

    for (const artist of artists) {
      const templatePath = path.join(__dirname, "./template-half.docx");
      const content = fs.readFileSync(templatePath, "binary");

      const zip = new PizZip(content);
      const doc = new Docxtemplater(zip, { paragraphLoop: true, linebreaks: true });

      const today = new Date();
      const rightsStart = formatDate(today);

      const endDate = new Date(today);
      endDate.setFullYear(endDate.getFullYear() + 5);
      const rightsEnd = formatDate(endDate);

      const tracksData = tracks.map(track => ({
        title: track.title,
        durationMinutes: track.durationMinutes,
        durationSeconds: track.durationSecond,
        licensorShare: track.licensorShare,
        year: track.year,
        rightsStart,
        rightsEnd,
      }));

      const formattedDate = today.toLocaleDateString("ru-RU");

      doc.setData({
        FIO: `${artist.lastname} ${artist.firstname} ${artist.surname || ""}`,
        rsnumber: artist.rsnumber,
        phone: artist.phone,
        nickname: artist.nickname,
        adress: artist.adress,
        dateNow: formattedDate,
        username: artist.username,
        FIOSLICED: `${String(artist.firstname).substring(0,1)}.${String(artist.lastname).substring(0,1)}. ${artist.surname || ""}`,
        postadress: artist.postadress,
        email: artist.email,
        bankname: artist.bankname,
        bik: artist.bik,
        ksnumber: artist.ksnumber,
        firstname: artist.firstname || "",
        lastname: artist.lastname || "",
        surname: artist.surname || "",
        nickname: artist.nickname || "",
        INN: artist.INN || "",
        tracks: tracksData,
      });

      doc.render();

      const buffer = doc.getZip().generate({ type: "nodebuffer" });

      const fileName = `contract_${artist.username}.docx`;
      const filePath = path.join(process.cwd(), "uploads", fileName);

      fs.writeFileSync(filePath, buffer);
      generatedFiles.push({ fileName, filePath });
    }

    // 🔹 Создаем zip и стримим его в ответ
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
