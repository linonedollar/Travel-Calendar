with open('index.html', 'r', encoding='utf-8') as f:
    text = f.read()

print('index.html char count:', len(text))
print('Has tabBtnCalendar:', 'tabBtnCalendar' in text)
print('Has viewCalendar:', 'viewCalendar' in text)
print('Has calendarData:', 'const calendarData =' in text)
print('Has calDayPills:', 'id="calDayPills"' in text)
print('Has calDaysContainer:', 'id="calDaysContainer"' in text)
print('Has viewChecklist:', 'id="viewChecklist"' in text)

with open('google_apps_script/index.html', 'r', encoding='utf-8') as f:
    text_gas = f.read()

print('gas index.html char count:', len(text_gas))
print('gas Has tabBtnCalendar:', 'tabBtnCalendar' in text_gas)
print('gas Has viewCalendar:', 'viewCalendar' in text_gas)
