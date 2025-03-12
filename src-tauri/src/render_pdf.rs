use serde_json::json;
use serde_json::Value;
use std::env;
use std::fs::{self, File};
use std::io::Write;
use std::path::{Path, PathBuf};
use std::process::Command;
use tera::{Context, Tera};

/// Generate a PDF from a LaTeX template
pub fn generate_pdf(
    data: Value,
    template_file: &str,
    output_path: &str,
    replace: bool,
) -> String {

    let base_dir = env::current_dir().expect("Failed to get current directory");
    println!("📁 Current directory: {:?}", base_dir);
    let template_dir = base_dir.join("templates");
    match fs::read_dir(&template_dir) {
        Ok(entries) => {
            println!("📂 Folder contents:");
            for entry in entries {
                if let Ok(entry) = entry {
                    println!("  - {:?}", entry.file_name());
                }
            }
        }
        Err(_) => println!("❌ Could not read directory: {:?}", template_dir),
    }

    // Load and render the LaTeX template using Tera (Jinja2-like)
    let template_path = format!("{}/{}", template_dir.display(), "*.jinja");
    let tera = match Tera::new(&template_path) {
        Ok(t) => t,
        Err(e) => panic!("Template parsing error: {}", e),
    };

    println!(
        "📜 Loaded templates: {:?}",
        tera.get_template_names().collect::<Vec<_>>()
    );

    let mut context = Context::new();
    for (key, value) in data.as_object().unwrap() {
        context.insert(key, value);
    }

    let rendered_tex = tera
        .render(template_file, &context)
        .expect("Failed to render template");

    // Save the rendered LaTeX content to a .tex file

    let temp_tex_path = template_dir.join("temp_output.tex");

    let mut tex_file = File::create(&temp_tex_path).expect("Failed to create .tex file");
    tex_file
        .write_all(rendered_tex.as_bytes())
        .expect("Failed to write .tex file");

    if !temp_tex_path.exists() {
        panic!(
            "❌ Error: LaTeX source file {:?} does not exist!",
            temp_tex_path
        );
    }

    // Run pdflatex to generate the PDF
    let pdflatex_status = Command::new("pdflatex")
        .arg("-interaction=batchmode")
        .arg("temp_output.tex")
        .current_dir(&template_dir)
        .status()
        .expect("Failed to execute pdflatex");

    if !pdflatex_status.success() {
        panic!("pdflatex failed to compile the document.");
    }

    // Rename the generated PDF
    let temp_pdf_path = template_dir.join("temp_output.pdf");
    let destination_pdf_path = output_path;
    if temp_pdf_path.exists() {
        fs::rename(&temp_pdf_path, &destination_pdf_path).expect("Failed to rename PDF file");
    }

    for ext in [".aux", ".log", ".out", ".tex"] {
        let aux_file = template_dir
            .join("temp_output")
            .with_extension(ext.trim_start_matches('.'));

        if aux_file.exists() {
            match fs::remove_file(&aux_file) {
                Ok(_) => println!("🗑️ Deleted {:?}", aux_file),
                Err(e) => println!("⚠️ Failed to delete {:?}: {}", aux_file, e),
            }
        }
    }

    return destination_pdf_path.to_string();
}

// /// Generate a new filename if a file already exists
// fn create_new_file_name(original_pdf: &str) -> String {
//     let output_dir = std::env::current_dir()
//         .expect("Failed to get current directory")
//         .parent()
//         .expect("Failed to get parent directory")
//         .join("output");
//     let base_name = original_pdf.trim_end_matches(".pdf");

//     let mut file_name = original_pdf.to_string();
//     let mut candidate = output_dir.join(&file_name);
//     let mut counter = 1;

//     while candidate.exists() {
//         file_name = format!("{}({}).pdf", base_name, counter);
//         candidate = output_dir.join(&file_name);
//         counter += 1;
//     }
//     file_name
// }

/// Entry point to process JSON input
pub fn process_pdf_request(json_data: &str, output_path: &str) -> String {
    let data: Value = serde_json::from_str(json_data).expect("Failed to parse JSON");
    println!("📥 Received Path: {}", output_path);
    let template = data["template"].as_str().unwrap_or("template1");
    let template_name = format!("{}.jinja", template);
    println!("{}", data);
    let pdf_file = generate_pdf(data, &template_name, &output_path, false);

    let response = json!({
        "status": "success",
        "data": format!("Generated PDF: {}", pdf_file)
    });

    serde_json::to_string(&response).expect("Failed to serialize response")
}
