#!/usr/bin/env python3
"""
generate_manifest.py - Auto-generates the GAME_MANIFEST for arcade.html

Scans the cline directory for .html game files (excluding arcade.html itself
and any non-game html files) and updates the manifest in arcade.html.

Usage:
    python generate_manifest.py

Run this script whenever you add a new game to the directory.
"""

import os
import re
import json

# Files that are NOT games
EXCLUDE_FILES = {
    'arcade.html',
    'index.html',
    'README.html',
    'cyber_dash_editor.html',
}

# Icon suggestions by keyword (simple ASCII symbols, no encoding issues)
ICON_MAP = {
    'cyber': '[!!]',
    'fly': '(>>)',
    'dash': '[!!]',
    'fall': '(vv)',
    'missile': '>>>!',
    'canyon': '<||>',
    'tetris': '[==]',
    'winamp': '<||>',
    'spiral': '<><><',
    'psychedelic': '*@*^*',
    'run': '/V/V',
    'shoot': '>>>!',
    'race': '/V/V',
    'puzzle': '[?]',
    'default': '[GAME]',
}

def get_icon(filename):
    """Auto-assign an icon based on filename keywords."""
    name_lower = filename.lower().replace('.html', '')
    for keyword, icon in ICON_MAP.items():
        if keyword in name_lower:
            return icon
    return ICON_MAP['default']

def format_name(filename):
    """Convert filename to display name."""
    name = filename.replace('.html', '').replace('_', ' ').title()
    return name

def scan_games(directory):
    """Scan directory for game HTML files."""
    games = []
    for f in sorted(os.listdir(directory)):
        if f.endswith('.html') and f not in EXCLUDE_FILES:
            games.append({
                'file': f,
                'name': format_name(f),
                'icon': get_icon(f),
                'description': f'Play {format_name(f)}'  # placeholder
            })
    return games

def update_manifest(arcade_path, games):
    """Update the GAME_MANIFEST array in arcade.html."""
    manifest_json = json.dumps(games, indent=2, ensure_ascii=False)
    
    with open(arcade_path, 'r', encoding='utf-8') as fp:
        content = fp.read()
    
    # Replace the GAME_MANIFEST array
    pattern = r'const GAME_MANIFEST = \[[\s\S]*?\];'
    replacement = 'const GAME_MANIFEST = [\n' + manifest_json[1:-1] + '\n];'  # remove outer [] from json
    
    if re.search(pattern, content):
        new_content = re.sub(pattern, replacement, content)
    else:
        print("ERROR: Could not find GAME_MANIFEST in arcade.html")
        return False
    
    with open(arcade_path, 'w', encoding='utf-8') as fp:
        fp.write(new_content)
    
    return True

def main():
    script_dir = os.path.dirname(os.path.abspath(__file__))
    arcade_path = os.path.join(script_dir, 'arcade.html')
    
    if not os.path.exists(arcade_path):
        print(f"ERROR: arcade.html not found at {arcade_path}")
        return
    
    games = scan_games(script_dir)
    print(f"Found {len(games)} games:")
    for g in games:
        print(f"  {g['name']} ({g['file']})")
    
    if update_manifest(arcade_path, games):
        print(f"\nManifest updated in arcade.html with {len(games)} games!")
    else:
        print("\nFailed to update manifest.")

if __name__ == '__main__':
    main()