import os
import sys
sys.path.insert(0, 'scratch')
from integrate_calendar import build_integration

css, nav_tabs, cal_view, js = build_integration()

def update_html_file(file_path):
    print(f"Updating {file_path}...")
    with open(file_path, 'r', encoding='utf-8') as f:
        html = f.read()

    # 1. Inject CSS before </style>
    if '/* MAIN TOP VIEW TABS (CHECKLIST vs CALENDAR) */' not in html:
        style_close_idx = html.rfind('</style>')
        if style_close_idx != -1:
            html = html[:style_close_idx] + "\n" + css + "\n" + html[style_close_idx:]
            print("  - CSS injected")
        else:
            print("  ! Error: </style> not found")

    # 2. Inject nav tabs & wrap checklist in viewChecklist
    if 'id="mainTabsBar"' not in html:
        # We want to place nav_tabs right after </header> of the hero card, or right before <section class="weather-widget">
        weather_pos = html.find('<section class="weather-widget">')
        if weather_pos != -1:
            before_weather = html[:weather_pos]
            after_weather = html[weather_pos:]
            
            # Wrap checklist view from weather_pos to </main>
            main_close_pos = after_weather.find('</main>')
            if main_close_pos != -1:
                checklist_content = after_weather[:main_close_pos + len('</main>')]
                remaining_content = after_weather[main_close_pos + len('</main>'):]
                
                new_middle = (
                    "\n" + nav_tabs + "\n" +
                    '<div id="viewChecklist" class="view-panel active">\n' +
                    checklist_content + "\n" +
                    '</div>\n\n' +
                    cal_view + "\n"
                )
                html = before_weather + new_middle + remaining_content
                print("  - HTML views & Main Tabs injected")
            else:
                print("  ! Error: </main> not found")
        else:
            print("  ! Error: <section class=\"weather-widget\"> not found")

    # 3. Inject JS before </script>
    if 'const calendarData =' not in html:
        script_close_idx = html.rfind('</script>')
        if script_close_idx != -1:
            html = html[:script_close_idx] + "\n" + js + "\n" + html[script_close_idx:]
            print("  - JavaScript module injected")
        else:
            print("  ! Error: </script> not found")

    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(html)
    print(f"Successfully saved {file_path}!")

update_html_file('index.html')
update_html_file('google_apps_script/index.html')
print("All files updated successfully!")
