import os
import re

directories_to_search = ['server', 'client', 'shared', 'seo-landing']
extensions = ['.js', '.jsx', '.ts', '.tsx']

# We'll use a more flexible regex that catches variations of the Envato/Bisht copyright header
old_header_pattern = re.compile(
    r'/\*\*\s*\n'
    r'(?:\s*\* ============================================================\s*\n)?'
    r'\s*\* © 2025 Diploy — a brand of Bisht Technologies Private Limited\s*\n'
    r'(?:.|\n)*?'
    r'\s*\* Respect the author\'s rights and Envato licensing terms\.\s*\n'
    r'(?:\s*\* ============================================================\s*\n)?'
    r'\s*\*/\n*',
    re.MULTILINE
)

new_header = """/**
 * ============================================================
 * © 2026 Aiclex Technologies
 * Original Author: Aiclex Engineering Team
 * Website: https://aiclex.in
 * Contact: info@aiclex.in
 *
 * All rights reserved.
 * ============================================================
 */\n"""

count = 0

for directory in directories_to_search:
    if not os.path.exists(directory):
        continue
    for root, dirs, files in os.walk(directory):
        if 'node_modules' in root or '.git' in root or 'dist' in root or '.next' in root:
            continue
        for file in files:
            if any(file.endswith(ext) for ext in extensions):
                filepath = os.path.join(root, file)
                try:
                    with open(filepath, 'r', encoding='utf-8') as f:
                        content = f.read()
                    
                    if "© 2025 Diploy" in content:
                        new_content = old_header_pattern.sub(new_header, content)
                        # Fallback simple replace if regex fails
                        if new_content == content:
                             start_idx = content.find("/**")
                             end_idx = content.find("Respect the author's rights and Envato licensing terms.")
                             if start_idx != -1 and end_idx != -1:
                                  end_idx = content.find("*/", end_idx) + 3
                                  if end_idx > 3:
                                      new_content = content[:start_idx] + new_header + content[end_idx:]
                        
                        if new_content != content:
                            with open(filepath, 'w', encoding='utf-8') as f:
                                f.write(new_content)
                            count += 1
                except Exception as e:
                    pass

print(f"Replaced headers in {count} files.")
