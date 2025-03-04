"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { IconX } from "@tabler/icons-react";
import Tesseract from "tesseract.js"; // Import OCR library

const pdfjsLibPromise = import("pdfjs-dist/webpack").then((pdfjs) => {
  pdfjs.GlobalWorkerOptions.workerSrc =
    "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js";
  return pdfjs;
});

export default function UploadResume() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [fileName, setFileName] = useState("");
  const [resumeData, setResumeData] = useState(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    console.log("✅ File Selected: ", file.name);
    setSelectedFile(file);
    setFileName(file.name);
  };

  const extractTextFromPDF = async (file) => {
    console.log("📄 Extracting text from PDF...");
    const reader = new FileReader();
    reader.readAsArrayBuffer(file);

    return new Promise((resolve, reject) => {
      reader.onload = async function () {
        try {
          console.log("✅ FileReader Loaded Data Successfully");
          const pdfjsLib = await pdfjsLibPromise;
          const pdf = await pdfjsLib.getDocument({ data: reader.result }).promise;

          let extractedText = "";
          for (let i = 1; i <= pdf.numPages; i++) {
            const page = await pdf.getPage(i);
            const textContent = await page.getTextContent();
            extractedText += textContent.items.map((item) => item.str).join("\n") + "\n";
          }

          if (!extractedText.trim()) {
            console.warn("⚠️ No text found. Trying OCR...");
            const ocrText = await extractTextUsingOCR(file);
            resolve(ocrText);
          } else {
            resolve(extractedText);
          }
        } catch (error) {
          console.error("❌ PDF Parsing Error:", error);
          reject(error);
        }
      };
    });
  };

  const extractTextUsingOCR = async (file) => {
    return new Promise((resolve, reject) => {
      console.log("🔍 Running OCR on PDF...");
      Tesseract.recognize(
        file,
        "eng",
        {
          logger: (m) => console.log(`OCR Progress: ${Math.round(m.progress * 100)}%`),
        }
      )
        .then(({ data: { text } }) => {
          console.log("✅ OCR Extraction Done!");
          resolve(text);
        })
        .catch((error) => {
          console.error("❌ OCR Extraction Failed:", error);
          reject(error);
        });
    });
  };

  const extractDetails = (text) => {
    const nameMatch = text.match(/(?<=Name[:\s])[A-Z][a-z]+\s[A-Z][a-z]+/);
    const emailMatch = text.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/);
    const phoneMatch = text.match(/\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/);
    const skillsMatch = text.match(/Skills[:\s]([A-Za-z,\s]+)/i);
    const experienceMatch = text.match(/Experience[:\s]([A-Za-z0-9,\s]+)/i);

    return {
      Name: nameMatch ? nameMatch[0] : "Not Found",
      Email: emailMatch ? emailMatch[0] : "Not Found",
      Phone: phoneMatch ? phoneMatch[0] : "Not Found",
      Skills: skillsMatch ? skillsMatch[1].trim() : "Not Found",
      Experience: experienceMatch ? experienceMatch[1].trim() : "Not Found",
    };
  };

  const calculateScore = (skills) => {
    const importantSkills = ["JavaScript", "React", "Node.js", "Python", "SQL"];
    let score = 0;
    importantSkills.forEach((skill) => {
      if (skills.toLowerCase().includes(skill.toLowerCase())) {
        score += 20;
      }
    });
    return score;
  };

  const handleAnalyzeClick = async () => {
    if (!selectedFile) {
      alert("❗ Please upload a file first.");
      return;
    }

    console.log("🛠 Processing File:", selectedFile.name);
    try {
      const extractedText = await extractTextFromPDF(selectedFile);
      console.log("📜 Extracted Text:", extractedText);
      const structuredData = extractDetails(extractedText);
      structuredData.Score = calculateScore(structuredData.Skills);
      setResumeData(structuredData);
    } catch (error) {
      console.error("❌ Error parsing the file:", error);
      alert("Failed to parse the file. Please try again.");
    }
  };

  const removeFile = () => {
    setSelectedFile(null);
    setFileName("");
    setResumeData(null);
    console.log("🗑 File Removed");
  };

  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900 p-6">
      <Card className="max-w-lg w-full p-6 shadow-lg border border-blue-500/30 bg-gray-950/70 rounded-2xl text-white text-center">
        <Label className="text-lg font-semibold text-blue-400">Upload Your Resume</Label>
        <Input type="file" accept=".pdf" className="mt-4" onChange={handleFileChange} />

        {fileName && (
          <div className="mt-4 p-4 border border-gray-700 rounded-lg flex items-center justify-between">
            <span className="text-gray-300">{fileName}</span>
            <button onClick={removeFile} className="text-red-400 hover:text-red-600">
              <IconX size={18} />
            </button>
          </div>
        )}

        <Button className="mt-6 bg-blue-600 hover:bg-blue-700" onClick={handleAnalyzeClick}>
          Analyze Resume
        </Button>

        {resumeData && (
          <div className="mt-4 p-4 bg-gray-800 text-gray-300 border border-gray-600 rounded-lg text-left">
            <h3 className="text-lg font-semibold text-blue-300">Extracted Details</h3>
            {Object.entries(resumeData).map(([key, value]) => (
              <p key={key} className="text-sm">
                <strong>{key}:</strong> {value}
              </p>
            ))}
          </div>
        )}
      </Card>
    </main>
  );
}
