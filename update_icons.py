import os
import fnmatch
import xml.etree.ElementTree as ET

ASSETS_DIR = os.path.join('src', 'assets')
SVG_TAGS = ["path", "rect", "circle", "ellipse", "polygon", "polyline"]

# Recursively find all SVG files ending with 'Icon.svg'
def find_icon_svgs(directory):
    icon_svgs = []
    for root, _, files in os.walk(directory):
        for filename in fnmatch.filter(files, '*Icon.svg'):
            icon_svgs.append(os.path.join(root, filename))
    return icon_svgs

def update_svg_fill(svg_path):
    try:
        tree = ET.parse(svg_path)
        root = tree.getroot()
        # SVGs may have namespaces
        ns = ''
        if root.tag.startswith('{'):
            ns = root.tag.split('}')[0] + '}'
        for tag in SVG_TAGS:
            for elem in root.iter(f'{ns}{tag}'):
                if 'fill' in elem.attrib:
                    print(f"Updating {svg_path} {tag} {elem.attrib['fill']}")
                    elem.set('fill', 'currentColor')
        # tree.write(svg_path, encoding='utf-8', xml_declaration=True)
        print(f"Updated: {svg_path}")
    except Exception as e:
        print(f"Failed to update {svg_path}: {e}")

def main():
    icon_svgs = find_icon_svgs(ASSETS_DIR)
    for svg_path in icon_svgs:
        update_svg_fill(svg_path)

if __name__ == "__main__":
    main()
