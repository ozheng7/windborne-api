import fs from "fs";
import fetch from "node-fetch"; // If Node <18, install with `npm i node-fetch`

// Folder to save files
const downloadFolder = "../public/balloons";

// Make sure folder exists
if (!fs.existsSync(downloadFolder)) {
  fs.mkdirSync(downloadFolder, { recursive: true });
}

// Hours 00–23
const hours = Array.from({ length: 24 }, (_, i) =>
  i.toString().padStart(2, "0")
);

async function downloadFile(hour) {
  const url = `https://a.windbornesystems.com/treasure/${hour}.json`;
  try {
    const res = await fetch(url);
    const data = await res.json();
    fs.writeFileSync(
      `${downloadFolder}/${hour}.json`,
      JSON.stringify(data, null, 2)
    );
    console.log(`Downloaded ${hour}.json`);
  } catch (err) {
    console.error(`Error downloading ${hour}.json:`, err);
  }
}

async function downloadAll() {
  for (const hour of hours) {
    await downloadFile(hour);
  }
  console.log("All balloon data downloaded!");
}

downloadAll();
