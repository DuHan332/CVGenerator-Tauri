use serde_json::Value;
use std::fs;
use std::fs::File;
use std::io::Write;
use std::path::PathBuf;
mod render_pdf;

#[tauri::command]
fn run_python_script(data: serde_json::Value) -> String {
    println!("🔍 Received data from frontend: {:?}", data); // Debug output

    let mut child = std::process::Command::new("python")
        .arg("python/render_pdf.py")
        .stdin(std::process::Stdio::piped())
        .stdout(std::process::Stdio::piped())
        .spawn()
        .expect("Failed to start Python process");

    let json_input = data.to_string();
    println!("📤 Sending JSON to Python: {}", json_input);

    if let Some(mut stdin) = child.stdin.take() {
        stdin
            .write_all(json_input.as_bytes())
            .expect("Failed to write to stdin");
    }

    let output = child.wait_with_output().expect("Failed to read stdout");

    let output_str = String::from_utf8_lossy(&output.stdout);
    println!("📩 Python Output: {}", output_str); // Debug print

    output_str.to_string()
}

#[tauri::command]
fn run_rust_pdf_generator(json_data: String, output_path: String) -> String {
    let response = render_pdf::process_pdf_request(&json_data, &output_path);
    println!("📜 PDF Generator Response: {}", response);
    response
}

#[tauri::command]
fn save_json(json_data: String) -> Result<(), String> {
    let output_dir = std::env::current_dir()
        .expect("Failed to get current directory")
        .parent()
        .expect("Failed to get parent directory")
        .join("output");

    if !output_dir.exists() {
        std::fs::create_dir_all(&output_dir)
            .map_err(|e| format!("Failed to create output directory: {}", e))?;
    }
    let data: Value = serde_json::from_str(&json_data).expect("Failed to parse JSON");
    let name = data["name"].as_str().unwrap_or("new");
    let filename = format!("{}_cv_data.json", name);
    let json_file_path = output_dir.join(filename);

    let mut file =
        File::create(&json_file_path).map_err(|e| format!("Failed to create JSON file: {}", e))?;
    file.write_all(json_data.as_bytes())
        .map_err(|e| format!("Failed to write JSON data: {}", e))?;

    println!("✅ JSON saved at {:?}", json_file_path);
    Ok(())
}

#[tauri::command]
fn import_json(file_path: String) -> Result<String, String> {
    let path = PathBuf::from(file_path);

    if !path.exists() {
        return Err("File does not exist".to_string());
    }

    let json_content =
        fs::read_to_string(&path).map_err(|e| format!("Failed to read file: {}", e))?;

    // Ensure it's valid JSON
    let _: Value =
        serde_json::from_str(&json_content).map_err(|e| format!("Invalid JSON format: {}", e))?;

    Ok(json_content)
}

fn main() {
    tauri::Builder::default()
        .plugin(tauri_plugin_dialog::init())
        .invoke_handler(tauri::generate_handler![
            run_rust_pdf_generator,
            save_json,
            import_json,
            run_python_script
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
