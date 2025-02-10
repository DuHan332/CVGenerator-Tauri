import os
import subprocess
from jinja2 import Environment, FileSystemLoader
import sys
import json

OUTPUT_DIR = os.path.join(os.path.dirname(os.getcwd()), "output")

def generate_pdf(data, template_file='template1.jinja', output_pdf_name='output.pdf', replace = False):
    """
    Renders a LaTeX Jinja template from the 'templates' folder and compiles it to PDF.
    """
    
    # Ensure the output directory exists
    if not os.path.exists(OUTPUT_DIR):
        os.makedirs(OUTPUT_DIR)

    # 1. Create a Jinja2 environment, pointing to the 'templates' directory
    #    and set custom delimiters to avoid LaTeX curly-brace conflicts.
    env = Environment(
        loader=FileSystemLoader('python/templates'),
        block_start_string='((%',
        block_end_string='%))',
        variable_start_string='(((',
        variable_end_string=')))',
        comment_start_string='((#',
        comment_end_string='#))',
        trim_blocks=True,      # Automatically remove newline after a block
        lstrip_blocks=True 
    )

    # 2. Load the specified template
    template = env.get_template(template_file)

    # 3. Render the template with the provided data
    rendered_tex = template.render(**data)

    # 4. Write the rendered content to a temporary .tex file
    temp_tex = 'python/templates/temp_output.tex'
    with open(temp_tex, 'w', encoding='utf-8') as f:
        f.write(rendered_tex)

    # 5. Run pdflatex to compile .tex -> .pdf
    subprocess.run(['pdflatex', '-interaction=batchmode', 'temp_output.tex'], cwd="python/templates")

    # 6. Rename the generated PDF to your desired output name
    if os.path.exists('python/templates/temp_output.pdf'):
        destination_path = os.path.join(OUTPUT_DIR, output_pdf_name)
        if replace:
            os.replace('python/templates/temp_output.pdf', destination_path)
        else:
            new_file_name = create_new_file_name(output_pdf_name)
            destination_path = os.path.join(OUTPUT_DIR, new_file_name)
            os.rename('python/templates/temp_output.pdf', destination_path)

    # 7. Clean up auxiliary files if desired
    for ext in ['.aux', '.log', '.out', '.tex']:
        aux_file = 'python/templates/temp_output' + ext
        if os.path.exists(aux_file):
            os.remove(aux_file)

    return output_pdf_name


def create_new_file_name(new_pdf):
    """
    If `new_pdf` already exists, append (1), (2), etc. until we find a free filename.
    Then rename `original_pdf` to that new filename.
    """
    base, ext = os.path.splitext(new_pdf)
    candidate = new_pdf
    counter = 1

    while os.path.exists(candidate):
        candidate = f"{base}({counter}){ext}"
        counter += 1
    return candidate

if __name__ == '__main__':
    # Example data dictionary
    input_data = sys.stdin.read()
    print(OUTPUT_DIR)
    try:
        data_dict = json.loads(input_data)
        filename = f"{data_dict['name']}_cv.pdf" if data_dict['name'] else "new_cv.pdf"
        pdf_file = generate_pdf(data_dict, template_file='template1.jinja', output_pdf_name=filename, replace=True)
        response = {
            "status": "success",
            "data": f"Python received: {data_dict}, and generated PDF: {pdf_file}"
        }
        print(json.dumps(response))
        sys.stdout.flush()
    except Exception as e:
        print(json.dumps({"status": "error", "message": str(e)}))
        sys.stdout.flush()