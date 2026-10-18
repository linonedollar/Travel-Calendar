with open('index.html', 'r', encoding='utf-8') as f:
    text = f.read()

elements = [
    'id="tabBtnChecklist"',
    'id="tabBtnCalendar"',
    'id="viewChecklist"',
    'id="viewCalendar"',
    'id="calDayPills"',
    'id="calDaysContainer"',
    'id="calSearchInput"',
    'id="calExpandAllBtn"',
    'id="calCollapseAllBtn"',
    'id="calPrintBtn"'
]

for el in elements:
    assert el in text, f"Missing element {el}"

print("All 10 required calendar DOM elements exist in index.html!")

with open('google_apps_script/index.html', 'r', encoding='utf-8') as f:
    text_gas = f.read()

for el in elements:
    assert el in text_gas, f"Missing element {el} in google_apps_script/index.html"

print("All 10 required calendar DOM elements exist in google_apps_script/index.html!")
