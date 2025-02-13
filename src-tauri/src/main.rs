use std::io::Write;

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
        stdin.write_all(json_input.as_bytes()).expect("Failed to write to stdin");
    }

    let output = child.wait_with_output().expect("Failed to read stdout");

    let output_str = String::from_utf8_lossy(&output.stdout);
    println!("📩 Python Output: {}", output_str); // Debug print

    output_str.to_string()
}

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![run_python_script])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}