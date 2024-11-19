const { Firestore } = require("@google-cloud/firestore");
const db = new Firestore();

const addentry = async (reg, res) => {
  const { aksara, tulisanlatin, deskripsi, category } = reg.body;
  const imageBuffer = req.file?.buffer;
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
};
const getallentry = async (reg, res) => {
  try {
    const snapshot = await db.collection("entries").get();
    const entries = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    res.status(200).json(entries);
  } catch (error) {
    console.error("Error mendapatkan entri:", error);
    res.status(500).json({ message: "Gagal mendapatkan entri", error });
  }
};
module.exports = { addentry, getallentry };
