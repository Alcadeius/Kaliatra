const { Firestore } = require("@google-cloud/firestore");
const { Storage } = require("@google-cloud/storage");
const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const app = express();
const port = process.env.PORT || 3000;
app.use(express.json());

// Inisialisasi Firestore dan Storage
const db = new Firestore();
const storage = new Storage();
const bucketName = "kaliatra";
const bucket = storage.bucket(bucketName);

// Menggunakan penyimpanan memori
const upload = multer({
  storage: multer.memoryStorage(),
});

// Endpoint untuk menambahkan kategori baru
app.post("/api/category", async (req, res) => {
  const { name } = req.body;
  if (!name) {
    return res.status(400).json({ message: "Nama kategori harus disertakan" });
  }

  try {
    const newCategory = { name, createdAt: new Date().toISOString() };
    const docRef = await db.collection("categories").add(newCategory);
    res.status(201).json({ id: docRef.id, ...newCategory });
  } catch (error) {
    console.error("Error menambahkan kategori:", error);
    res.status(500).json({ message: "Gagal menambahkan kategori", error });
  }
});

// Endpoint untuk mendapatkan semua kategori
app.get("/api/category", async (req, res) => {
  try {
    const snapshot = await db.collection("categories").get();
    const categories = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    res.status(200).json(categories);
  } catch (error) {
    console.error("Error mendapatkan kategori:", error);
    res.status(500).json({ message: "Gagal mendapatkan kategori", error });
  }
});

// Endpoint untuk menambahkan entri baru dengan gambar
app.post("/api/entry", upload.single("image"), async (req, res) => {
  const { aksara, tulisanlatin, deskripsi, category } = req.body;
  const imageBuffer = req.file?.buffer; // Gunakan optional chaining untuk menghindari error jika `req.file` tidak ada

  if (!aksara || !deskripsi || !tulisanlatin || !category || !imageBuffer) {
    return res
      .status(400)
      .json({ message: "Semua data dan gambar harus disertakan" });
  }

  try {
    // Nama file unik berdasarkan timestamp
    const fileName = `${Date.now()}-${req.file.originalname}`;
    const file = storage.bucket(bucketName).file(fileName);

    // Simpan file ke Google Cloud Storage menggunakan metode `file.save()`
    await file.save(imageBuffer, {
      contentType: req.file.mimetype,
      resumable: false,
    });

    const publicUrl = `https://storage.googleapis.com/${bucketName}/${fileName}`;

    const newEntry = {
      aksara,
      tulisanlatin,
      deskripsi,
      category,
      imageUrl: publicUrl,
      createdAt: new Date().toISOString(),
    };

    const docRef = await db.collection("entries").add(newEntry);

    res.status(201).json({ id: docRef.id, ...newEntry });
  } catch (error) {
    console.error("Terjadi kesalahan:", error);
    res
      .status(500)
      .json({ message: "Terjadi kesalahan saat menyimpan data", error });
  }
});

// Endpoint untuk mendapatkan semua entri
app.get("/api/entry", async (req, res) => {
  try {
    const snapshot = await db.collection("entries").get();
    const entries = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    res.status(200).json(entries);
  } catch (error) {
    console.error("Error mendapatkan entri:", error);
    res.status(500).json({ message: "Gagal mendapatkan entri", error });
  }
});
// Endpoint untuk mendapatkan entri berdasarkan kategori tertentu
app.get("/api/entry/categories/:category", async (req, res) => {
  const { category } = req.params;
  try {
    const snapshot = await db
      .collection("entries")
      .where("category", "==", category)
      .get();
    if (snapshot.empty) {
      return res
        .status(404)
        .json({ message: "Tidak ada entri yang ditemukan untuk kategori ini" });
    }

    const entries = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    res.status(200).json(entries);
  } catch (error) {
    console.error("Error mendapatkan entri berdasarkan kategori:", error);
    res
      .status(500)
      .json({ message: "Gagal mendapatkan entri berdasarkan kategori", error });
  }
});

app.listen(port, () => {
  console.log(`Server berjalan di http://localhost:${port}`);
});
