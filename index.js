const express = require("express");
const multer = require("multer");
const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

const upload = multer({ storage: multer.memoryStorage() });

const categoryRoutes = require("./routes/category");
const entryRoutes = require("./routes/entry");

app.use("/api/category", categoryRoutes);
app.use("/api/entry", entryRoutes);

app.listen(port, () => {
  console.log(`Server berjalan di http://localhost:${port}`);
});
