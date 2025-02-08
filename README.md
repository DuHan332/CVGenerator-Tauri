# 📄 Tauri + Python PDF Generator

This project is a **cross-platform desktop application** built with **Tauri** and **React**, using **Python and LaTeX** to dynamically generate PDFs.

## 🚀 Features
- 🖥️ **Cross-platform**: Works on **Windows, macOS, and Linux**
- ⚡ **Fast and lightweight**: Uses **Tauri**, which is smaller than Electron
- 🐍 **Python integration**: Rust calls a Python script to generate PDFs
- 📄 **LaTeX-powered PDF templates**: Uses **Jinja2** templating for PDF generation
- ✅ **Dynamic data input**: Users enter information via the UI, and a PDF is generated

---

## 📦 Installation

### **1️⃣ Prerequisites**
Ensure you have the following installed:
- [Node.js](https://nodejs.org/) (v16+)
- [Rust](https://www.rust-lang.org/tools/install) (via `rustup`)
- Python (v3.8+) with:
  ```bash
  pip install jinja2
  ```
- LaTeX distribution (e.g., [TeX Live](https://www.tug.org/texlive/) or [MiKTeX](https://miktex.org/))

### **2️⃣ Clone the Repository**
```bash
git clone https://github.com/yourusername/tauri-python-pdf.git
cd tauri-python-pdf
```

### **3️⃣ Install Dependencies**
```bash
npm install
```

### **4️⃣ Set Up Python Virtual Environment (Optional)**
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
```

### **5️⃣ Run the App**
```bash
npm run tauri dev
```

---

## 📜 Usage

### **📝 Input Data**
The frontend collects user details like **name, email, phone, and work experience**, and passes it as JSON to **Rust**, which then invokes a **Python script** to generate a LaTeX-based PDF.

### **📄 PDF Generation Process**
1. **React UI** collects user input
2. **Rust (Tauri)** sends the input to Python
3. **Python (Jinja2 + LaTeX)** generates a `.pdf`
---

## ⚙️ Configuration

### **Modify PDF Output Path**
By default, PDFs are saved in the `pdfs/` folder (outside `src-tauri/`). If you want to change it, modify this line in **`render_pdf.py`**:
```python
OUTPUT_DIR = os.path.abspath(os.path.join(BASE_DIR, "..", "pdfs"))
```

---

## 🛠️ Build the App
To build a production-ready **standalone desktop app**:
```bash
npm run tauri build
```
The built app will be in `src-tauri/target/release/bundle/`.

---


