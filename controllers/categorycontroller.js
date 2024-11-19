const { Firestore } = require("@google-cloud/firestore");
const db = new Firestore();

const addCategory = async (req, res) => {
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
};

const getAllCategories = async (req, res) => {
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
};
const getspesifycategory = async (req, res) => {
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
};
module.exports = { addCategory, getAllCategories, getspesifycategory };
