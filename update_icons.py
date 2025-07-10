import os
import fnmatch
import xml.etree.ElementTree as ET

IGNORE_ICONS = ["createAiIcon.svg"]
ASSETS_DIR = os.path.join('src', 'assets')
SVG_TAGS = ["path", "rect", "circle", "ellipse", "polygon", "polyline"]
PREVIEW_HTML = "preview.html"

# Recursively find all SVG files ending with 'Icon.svg'
def find_icon_svgs(directory):
    icon_svgs = []
    for root, _, files in os.walk(directory):
        for filename in fnmatch.filter(files, '*Icon.svg'):
            if filename not in IGNORE_ICONS:
                icon_svgs.append(os.path.join(root, filename))
    return icon_svgs

def update_svg_fill_and_stroke(svg_path):
    try:
        tree = ET.parse(svg_path)
        root = tree.getroot()
        # SVGs may have namespaces
        ns = ''
        if root.tag.startswith('{'):
            ns = root.tag.split('}')[0] + '}'
        for tag in SVG_TAGS:
            for elem in root.iter(f'{ns}{tag}'):
                if "fill" in elem.attrib and elem.attrib['fill'] not in ["currentColor", "none"]:
                    print(f"Updating {svg_path} {tag} fill {elem.attrib['fill']}")
                    elem.set('fill', 'currentColor')
                if 'stroke' in elem.attrib and elem.attrib['stroke'] not in ["currentColor", "none"]:
                    print(f"Updating {svg_path} {tag} stroke {elem.attrib['stroke']}")
                    elem.set('stroke', 'currentColor')
        tree.write(svg_path, encoding='utf-8', xml_declaration=True)
        # print(f"Updated: {svg_path}")
    except Exception as e:
        print(f"Failed to update {svg_path}: {e}")

def write_preview_html(svg_paths):
    html = [
        '<!DOCTYPE html>',
        '<html lang="en">',
        '<head>',
        '  <meta charset="UTF-8">',
        '  <title>SVG Icon Preview</title>',
        '  <style>',
        '    body { font-family: sans-serif; background: #faf9ff; color: #222; }',
        '    .icon-grid { display: flex; flex-wrap: wrap; gap: 24px; }',
        '    .icon-item { width: 180px; padding: 16px; background: #fff; border-radius: 8px; box-shadow: 0 2px 8px #0001; display: flex; flex-direction: column; align-items: center; }',
        '    .icon-item img { width: 56px; height: 56px; margin-bottom: 8px; }',
        '    .icon-filename { font-size: 13px; word-break: break-all; text-align: center; }',
        '  </style>',
        '</head>',
        '<body>',
        '  <h1>SVG Icon Preview</h1>',
        '  <div class="icon-grid">'
    ]
    for svg_path in svg_paths:
        rel_path = os.path.relpath(svg_path)
        html.append(f'    <div class="icon-item">')
        html.append(f'      <img src="{rel_path}" alt="{os.path.basename(svg_path)}" />')
        html.append(f'      <div class="icon-filename">{os.path.basename(svg_path)}</div>')
        html.append(f'    </div>')
    html.extend([
        '  </div>',
        '</body>',
        '</html>'
    ])
    with open(PREVIEW_HTML, 'w', encoding='utf-8') as f:
        f.write('\n'.join(html))
    print(f"Wrote preview to {PREVIEW_HTML}")

def main():
    icon_svgs = find_icon_svgs(ASSETS_DIR)
    for svg_path in icon_svgs:
        update_svg_fill_and_stroke(svg_path)
    write_preview_html(icon_svgs)

if __name__ == "__main__":
    main()
