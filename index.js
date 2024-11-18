const express = require("express");
const multer = require("multer");
const path = require("path");

const app = express();
const port = 3000;

// Middleware untuk parsing JSON
app.use(express.json());
app.use(express.static("uploads")); // Untuk akses gambar di folder 'uploads'
// Konfigurasi Multer untuk upload file
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // Folder tempat file disimpan
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ storage });
// In-memory storage untuk kategori
let categories = [];

// Endpoint untuk menambahkan kategori baru
app.post("/api/category", (req, res) => {
  const { name } = req.body;

  if (!name) {
    return res.status(400).json({ message: "Nama kategori harus disertakan" });
  }

  // Periksa apakah kategori sudah ada
  const existingCategory = categories.find(
    (category) => category.name === name
  );
  if (existingCategory) {
    return res.status(400).json({ message: "Kategori sudah ada" });
  }

  const newCategory = {
    id: categories.length + 1,
    name,
  };

  categories.push(newCategory);
  res.status(201).json(newCategory);
});

// Endpoint untuk mendapatkan semua kategori
app.get("/api/categories", (req, res) => {
  res.json(categories);
});

// In-memory storage untuk data dictionary
let dictionary = [];

// Endpoint untuk menambahkan entry baru ke dictionary
app.post("/api/entry", upload.single("image"), (req, res) => {
  const { aksara, tulisanlatin, deskripsi, category } = req.body;
  const imagePath = req.file ? req.file.path : null;

  if (!aksara || !deskripsi || !tulisanlatin || !category) {
    return res
      .status(400)
      .json({ message: "Kata dan definisi harus disertakan" });
  }

  const categoryExists = categories.some((cat) => cat.name === category);
  if (category && !categoryExists) {
    return res.status(400).json({ message: "Kategori tidak valid" });
  }

  const newEntry = {
    id: dictionary.length + 1,
    aksara,
    tulisanlatin,
    deskripsi,
    category,
    imageUrl: imagePath
      ? `http://localhost:${port}/${path.basename(imagePath)}`
      : null,
  };

  dictionary.push(newEntry);
  res.status(201).json(newEntry);
});

// Endpoint untuk mendapatkan semua entry dictionary
app.get("/api/entries", (req, res) => {
  res.json(dictionary);
});

// Endpoint untuk mendapatkan entry berdasarkan ID
app.get("/api/entry/:id", (req, res) => {
  const entryId = parseInt(req.params.id, 10);
  const entry = dictionary.find((item) => item.id === entryId);

  if (!entry) {
    return res.status(404).json({ message: "Entry tidak ditemukan" });
  }
  res.json(entry);
});
app.get("/api/entries/category/:categoryName", (req, res) => {
  const { categoryName } = req.params;
  const filteredEntries = dictionary.filter(
    (entry) => entry.category === categoryName
  );

  if (filteredEntries.length === 0) {
    return res
      .status(404)
      .json({ message: "Tidak ada entri untuk kategori ini" });
  }

  res.json(filteredEntries);
});

// Menjalankan server
app.listen(port, () => {
  console.log(`Server berjalan di http://localhost:${port}`);
});
