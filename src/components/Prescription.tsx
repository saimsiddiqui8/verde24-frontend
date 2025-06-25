import { PDFDocument, rgb } from "pdf-lib";

export type PrescriptionData = {
  patient_name: string;
  patient_id: string;
  gender: string;
  age: string;
  date: string;
  diagnosis: string;
  doctor_name: string;
  qualification: string;
  medicines: string[];
  complaints: string[];
  observation: string[];
  history: string[]; // optional, if you plan to separate this
};

export const generateImageBasedPDF = async (
  data: PrescriptionData,
  imageUrl: string,
): Promise<Blob> => {
  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage([595, 842]); // A4 size

  const imageBytes = await fetch(imageUrl).then((res) => res.arrayBuffer());
  const jpgImage = await pdfDoc.embedJpg(imageBytes);

  page.drawImage(jpgImage, {
    x: 0,
    y: 0,
    width: 595,
    height: 842,
  });

  const drawText = (text: string, x: number, y: number, size = 10) => {
    page.drawText(text, {
      x,
      y,
      size,
      color: rgb(0, 0, 0),
    });
  };

  // 🩺 Doctor Info (Top left)
  drawText(data.doctor_name, 20, 818 - 5, 14); // Dr Raza
  drawText(data.qualification, 20, 818 - 30, 10); // MBBS

  drawText(data.patient_name, 340, 782 - 123); // right-[100px]
  drawText(data.patient_id, 120, 782 - 123); // left-[120px]
  drawText(data.gender, 110, 776 - 144); // left-[100px]
  drawText(data.age, 80, 769 - 163);
  drawText(data.date, 310, 769 - 163);

  drawText(data.diagnosis, 130, 766 - 185);

  // 📝 History (if separated)
  if (data.history?.length) {
    drawText("History:", 30, 752 - 218);
    data.history.forEach((item, i) => {
      drawText(`• ${item}`, 25, 752 - (232 + i * 14));
    });
  }

  // 💊 Medicines
  if (data.medicines.length > 0) {
    drawText("Medicine:", 175, 732 - 280);
    data.medicines.forEach((med, i) => {
      drawText(`• ${med}`, 170, 732 - (294 + i * 14));
    });
  }

  // 😷 Complaints
  if (data.complaints.length > 0) {
    drawText("Complaints:", 30, 722 - 330);
    data.complaints.forEach((comp, i) => {
      drawText(`• ${comp}`, 25, 722 - (344 + i * 14));
    });
  }

  // 🔬 Observation
  if (data.observation.length > 0) {
    drawText("Observation:", 30, 702 - 440);
    data.observation.forEach((obs, i) => {
      drawText(`• ${obs}`, 25, 702 - (454 + i * 14));
    });
  }

  const pdfBytes = await pdfDoc.save();
  return new Blob([pdfBytes], { type: "application/pdf" });
};
