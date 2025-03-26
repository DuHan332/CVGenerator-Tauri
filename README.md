# CV Generator Ver 1.1

## 📌 Overview
This is a **Tauri + React** application that allows users to create and export CVs in **PDF format**. The frontend is built with **React**, and the backend, written in **Rust**, generates PDFs using **LaTeX** and the `Tera` templating engine.

## 🚀 Features
- **Dynamic Form**: Users can input personal details, work experience, projects, education, and skills.
- **PDF Export**: Generates a **LaTeX-based PDF** using Rust.
- **JSON Save & Load**: Export and import CV data in JSON format.
- **Tauri Integration**: Uses Rust for backend logic and file handling.

---

## 🛠️ Tech Stack
### **Frontend:**
- **React** (Dynamic UI & Form Handling)
- **Tauri** (`@tauri-apps/api` for communication with Rust backend)

### **Backend (Rust):**
- **Tauri Commands** (File I/O, PDF Generation)
- **Tera** (Jinja2-like template engine for LaTeX)
- **pdflatex** (Compiles `.tex` files into PDFs)

---

## 📦 Installation
### **1️⃣ Install Dependencies**
Ensure you have **Tauri, Node.js, Cargo, and LaTeX** installed.

#### **Install LaTeX (Required for PDF Generation)**
##### Windows (MiKTeX):
```powershell
choco install miktex
```
##### macOS:
```bash
brew install mactex
```
##### Linux (TeX Live):
```bash
sudo apt install texlive-latex-base texlive-latex-extra texlive-fonts-recommended
```

#### **Clone the Repository**
```bash
git clone https://github.com/your-repo/cv-generator-tauri.git
cd cv-generator-tauri
```

#### **Install Node.js Packages**
```bash
npm install
```

#### **Install Rust Dependencies**
```bash
cargo tauri dev
```

---

## 🔥 Usage
### **1️⃣ Run the App (Development Mode)**
```bash
npm run tauri dev
```

### **2️⃣ Build the App**
```bash
npm run tauri build
```

## 📝 JSON Import/Export
### **Export CV Data as JSON**
Click the **Export** button to download your CV data.

### **Import JSON to Autofill Form**
Click **Import**, select a `.json` file, and the form will be autofilled.

---

## 📜 License
This project is licensed under the MIT License.

