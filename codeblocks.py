import re

def convert_code_blocks(html_content):
    """
    Find all <code></code> blocks and convert < and > to < and > within them.
    """
    def replace_angle_brackets(match):
        code_content = match.group(1)
        # Replace < with < and > with >
        code_content = code_content.replace('<', '<').replace('>', '>')
        return f"<code>{code_content}</code>"
    
    # Use regex to find all <code>...</code> blocks
    pattern = r'<code>(.*?)</code>'
    # re.DOTALL allows . to match newlines as well
    result = re.sub(pattern, replace_angle_brackets, html_content, flags=re.DOTALL)
    
    return result

def process_html_file(input_file, output_file):
    """
    Process an HTML file, converting code blocks, and save to output file.
    """
    try:
        # Read the input file
        with open(input_file, 'r', encoding='utf-8') as f:
            html_content = f.read()
        
        # Convert code blocks
        processed_content = convert_code_blocks(html_content)
        
        # Write to output file
        with open(output_file, 'w', encoding='utf-8') as f:
            f.write(processed_content)
        
        print(f"Successfully processed {input_file} and saved to {output_file}")
        
    except Exception as e:
        print(f"Error processing file: {e}")

if __name__ == "__main__":
    import sys
    
    if len(sys.argv) < 3:
        print("Usage: python script.py input_file.html output_file.html")
        sys.exit(1)
    
    input_file = sys.argv[1]
    output_file = sys.argv[2]
    
    process_html_file(input_file, output_file)
