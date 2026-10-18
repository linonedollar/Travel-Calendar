import os
import re
import json

def parse_txt_day(filepath, day_num, date_str, weekday, day_type, default_title=""):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read().strip()

    lines = content.split('\n')
    
    # Extract title from line that starts with 📍 or contains Day
    title = default_title
    body_start_idx = 0
    
    for idx, l in enumerate(lines):
        trimmed = l.strip()
        if trimmed.startswith('📍') or (('Day ' in trimmed or 'Day' in trimmed) and '：' in trimmed):
            title = trimmed.replace('📍', '').strip()
            body_start_idx = idx + 1
            break
        elif trimmed and not title:
            # fallback candidate
            title = trimmed
            body_start_idx = idx + 1
            
    body_lines = lines[body_start_idx:]

    # Now parse timeline blocks
    # A timeline block starts with e.g. "05:00 - 08:00 ｜ ..." or "20:00 之後 ｜ ..." or "**16:00 ｜ ..."
    full_body = '\n'.join(body_lines)
    
    # Regex to split on time header lines
    # Patterns:
    # 05:00 - 08:00 ｜ ...
    # 12:30 之後 ｜ ...
    # **16:00 ｜ ...
    pattern = r'(?m)^(?:\*\*)?(\d{1,2}:\d{2}(?:\s*-\s*(?:\d{1,2}:)?\d{2})?(?:\s*之後)?)\s*｜\s*([^\n\r]+?)(?:\*\*)?$'
    
    matches = list(re.finditer(pattern, full_body))
    
    events = []
    if matches:
        for i, match in enumerate(matches):
            time_str = match.group(1).strip()
            event_title = match.group(2).strip().strip('*')
            
            start_pos = match.end()
            end_pos = matches[i+1].start() if i + 1 < len(matches) else len(full_body)
            event_desc = full_body[start_pos:end_pos].strip()
            
            # Categorize highlights
            highlights = []
            transit_tips = []
            dining_tips = []
            photo_tips = []
            alerts = []
            
            for line in event_desc.split('\n'):
                line = line.strip()
                if not line:
                    continue
                if '🎬' in line or '📸' in line or '【拍攝' in line:
                    photo_tips.append(line)
                elif '🚇' in line or '🚗' in line or '🚶' in line or '🚌' in line or '🛺' in line or '🚆' in line or '【捷運' in line or '【搭車' in line:
                    transit_tips.append(line)
                elif '☕️' in line or '🍴' in line or '🍜' in line or '🥣' in line or '🦀' in line or '🦆' in line or '🐔' in line or '🍢' in line or '【必點' in line or '【神級必吃' in line:
                    dining_tips.append(line)
                elif '🚨' in line or '💡' in line or '★' in line or '【管家' in line:
                    alerts.append(line)
                else:
                    highlights.append(line)

            events.append({
                "time": time_str,
                "title": event_title,
                "description": event_desc,
                "photo_tips": photo_tips,
                "transit_tips": transit_tips,
                "dining_tips": dining_tips,
                "alerts": alerts,
                "highlights": highlights
            })
    else:
        # Fallback if no time matches
        events.append({
            "time": "全日",
            "title": title,
            "description": full_body,
            "photo_tips": [],
            "transit_tips": [],
            "dining_tips": [],
            "alerts": [],
            "highlights": [full_body]
        })

    return {
        "day": day_num,
        "date": date_str,
        "weekday": weekday,
        "tag": day_type,
        "title": title,
        "raw_file": os.path.basename(filepath),
        "events": events
    }

print("Parser module ready")
