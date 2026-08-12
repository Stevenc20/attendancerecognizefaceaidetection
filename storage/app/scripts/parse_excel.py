import sys
sys.path.append(r"C:\Users\StevC\AppData\Roaming\Python\Python314\site-packages")
import pandas as pd
import json
import re

def parse_excel(file_path):
    # Read all sheets
    try:
        xl = pd.ExcelFile(file_path)
    except Exception as e:
        print(json.dumps({"error": str(e)}))
        sys.exit(1)
        
    result = []

    for sheet_name in xl.sheet_names:
        df = pd.read_excel(xl, sheet_name=sheet_name, header=None)
        
        # Convert to list of lists, treating NaN as empty string
        data = df.fillna("").values.tolist()
        
        current_class = None
        
        for i, row in enumerate(data):
            col0 = str(row[0]).strip()
            
            # Detect Class Header
            if col0.startswith("KELAS "):
                # Save previous class if exists
                if current_class:
                    result.append(current_class)
                    
                class_full_str = col0.replace("KELAS ", "").strip()
                
                # Extract grade, major, group
                # Examples: "X REKAYASA PERANGKAT LUNAK", "XI AKUNTANSI 1"
                parts = class_full_str.split(" ")
                grade = parts[0]
                
                # Check if the last part is a number
                group = 1
                major_parts = parts[1:]
                
                if len(parts) > 1 and parts[-1].isdigit():
                    group = int(parts[-1])
                    major_parts = parts[1:-1]
                    
                major = " ".join(major_parts)
                
                current_class = {
                    "grade": grade,
                    "major": major,
                    "group": group,
                    "teacher": None,
                    "students": []
                }
                continue
                
            # If no active class, keep searching
            if not current_class:
                continue
                
            # Detect Student Row (if col0 is a digit)
            # Sometimes it's float e.g., '1.0'
            col0_clean = col0.replace(".0", "")
            if col0_clean.isdigit():
                nis = str(row[1]).replace(".0", "").strip()
                name = str(row[2]).strip()
                gender = str(row[3]).strip()
                
                if nis and name:
                    current_class["students"].append({
                        "nis": nis,
                        "name": name,
                        "gender": gender
                    })
            
            # Detect Teacher Info
            # Teacher block usually in the rightmost column (index 4 or later)
            col_teacher = str(row[-1]).strip()
            if not col_teacher:
                if len(row) > 4:
                    col_teacher = str(row[4]).strip()
                    
            if "Guru Wali Kelas" in col_teacher:
                # Look ahead next 1-5 rows to find the name and NIP
                teacher_name = ""
                teacher_nip = ""
                
                for j in range(1, 6):
                    if i + j < len(data):
                        lookahead_col = str(data[i+j][-1]).strip()
                        if not lookahead_col and len(data[i+j]) > 4:
                            lookahead_col = str(data[i+j][4]).strip()
                            
                        if lookahead_col.startswith("NIP."):
                            teacher_nip = lookahead_col.replace("NIP.", "").strip()
                            # The row directly before NIP is usually the teacher's name
                            name_row_idx = i + j - 1
                            teacher_name = str(data[name_row_idx][-1]).strip()
                            if not teacher_name and len(data[name_row_idx]) > 4:
                                teacher_name = str(data[name_row_idx][4]).strip()
                            break
                            
                if teacher_name and teacher_nip:
                    current_class["teacher"] = {
                        "name": teacher_name,
                        "nip": teacher_nip
                    }
                    
        # Append the very last class found in the sheet
        if current_class:
            result.append(current_class)
            
    # Write to a file instead of stdout to avoid encoding/buffer issues
    output_path = file_path + ".json"
    with open(output_path, 'w', encoding='utf-8') as f:
        json.dump(result, f)
    
    print(output_path)

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print(json.dumps({"error": "No file path provided"}))
        sys.exit(1)
        
    parse_excel(sys.argv[1])
