
# Dictionary API

Sebuah API Backend Service yang menyediakan kumpulan aksara-aksara bali.API ini sudah berjalan dalam server cloud dengan base url https://kaliatra.et.r.appspot.com/

## Endpoint route 

#### Ambil semua Kategory

```http
  GET /api/category
```



#### Ambil semua Data Dictionary

```http
  GET /api/entry
```

#### Ambil Data Dictionary Berdasarkan Kategory

```http
  GET /api/entry/cateogories/:category
```

untuk :category bisa disesuaikan dari list dibawah ini
# List Kategori Aksara Bali

1. **gantungan_swalalita**
2. **Angka Aksara Bali**
3. **gantungan_wresastra**
4. **Aksara Swara Pendek Hreswa**
5. **Pangangge Ardhaswara**
6. **Pangangge Tengenan**
7. **Aksara Wyanjana Deret Modern Swalalita**
8. **Aksara Wyanjana Deret Modern Wresastra**
9. **tanda_baca**


## Run Locally
Bersifat Optional jika terjadi internal server error pada host service dapat menjalankan perintah-perintah ini secara berurutan

Clone the project

```bash
  git clone https://github.com/Alcadeius/Kaliatra.git
```

Go to the project directory

```bash
  cd Kaliatra
```

Install dependencies

```bash
  npm install
```

Start the server

```bash
  npm run start
```


## Demo

Setelah semua tahap telah dijalankan secara terurut maka server akan menampilkan pesan sejenis seperti ini "server bejalan pada port localhost:5000" silahkan di salin url yang diberikan dan gunakan sebagai pengganti dari base url host service sebelumnya.


## FAQ

#### 1.Kok pas dicoba get kategori atau entry nya nampilin error cannot get %0A

Ini dapat diakibatkan dari url yang menyisakan spasi di akhir url contohnya "/api/entry " hal ini dianggap invalid oleh sistem dan akan menampilkan pesan error tersebut sehingga tolong pastikan agar tidak menambahkan atau mengurangi endpoint yang sudah diberikan.



## Bug/Error

Untuk Bug dan Error baru yang ditemukan dapat menghubungi contributor yang bersangkutan

