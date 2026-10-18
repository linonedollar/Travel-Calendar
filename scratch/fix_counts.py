import sys

for fpath in ['index.html', 'google_apps_script/index.html']:
    with open(fpath, 'r', encoding='utf-8') as f:
        c = f.read()
    
    # Target replacement
    old_fragment = "globalProgressFill.style.width = `${pct}%`;"
    new_fragment = """globalProgressFill.style.width = `${pct}%`;
      globalCountText.textContent = `已完成 ${completedCount} / ${totalCount} 項`;
      const tabBadge = document.getElementById("tabChecklistCount");
      if (tabBadge) tabBadge.textContent = `${totalCount} 項`;"""
      
    if old_fragment in c:
        # replace the broken line following it
        parts = c.split(old_fragment)
        # in parts[1], replace up to the next newline with our new_fragment
        first_line_end = parts[1].find('}\n\n    // Search')
        if first_line_end != -1:
            parts[1] = "\n      " + new_fragment + "\n    " + parts[1][first_line_end:]
            c = old_fragment.join([parts[0], parts[1]])
            with open(fpath, 'w', encoding='utf-8') as f:
                f.write(c)
            print(f"Successfully updated count logic in {fpath}")
        else:
            print(f"Could not find first_line_end in {fpath}")
    else:
        print(f"Could not find old_fragment in {fpath}")
