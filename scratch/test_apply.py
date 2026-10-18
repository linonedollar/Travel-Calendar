import sys
sys.path.insert(0, 'scratch')
from integrate_calendar import build_integration

css, nav_tabs, cal_view, js = build_integration()

with open('index.html', 'r', encoding='utf-8') as f:
    html = f.read()

# 1. Check style tag
assert '</style>' in html, "Cannot find </style>"

# 2. Check hero-card
assert '<section class="weather-widget">' in html, "Cannot find weather-widget"
assert '</main>' in html, "Cannot find </main>"

# 3. Check script tag
assert '</script>' in html, "Cannot find </script>"

print("All assertion anchors found in index.html!")
