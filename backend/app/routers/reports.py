from fastapi import APIRouter, UploadFile, File
import pandas as pd
import io

router = APIRouter()

# List of Hyderabad pincodes
hyderabad_pincodes = [
    500001, 500002, 500003, 500004, 500005, 500006, 500007, 500008,
    500009, 500010, 500011, 500012, 500013, 500014, 500015, 500016,
    500017, 500018, 500020, 500022, 500023, 500024, 500025, 500026,
    500027, 500028, 500029, 500031, 500032, 500033, 500034, 500035,
    500036, 500037, 500038, 500040, 500041, 500044, 500045, 500047,
    500048, 500049, 500051, 500052, 500053, 500054, 500055, 500056,
    500057, 500058, 500059, 500061, 500063, 500064, 500065, 500066,
    500067, 500068, 500070, 500073, 500074, 500076, 500077, 500079,
    500080, 500081, 500082, 500083, 500084, 500086, 500087, 500088,
    500089, 500090, 500091, 500092, 500093, 500094, 500095, 500096,
    500097, 500098, 500100, 500101, 501101, 501102, 501301, 501401
]

@router.post("/upload-excel/")
async def upload_excel(file: UploadFile = File(...)):
    # Read the uploaded Excel file
    contents = await file.read()
    df = pd.read_excel(io.BytesIO(contents))

    # Function to check if the address contains a Hyderabad pincode
    def is_hyderabad_address(address):
        return any(str(pincode) in str(address) for pincode in hyderabad_pincodes)

    # Filter Hyderabad locations
    hyderabad_df = df[df["actual_add"].apply(is_hyderabad_address)]
    hyderabad_count = len(hyderabad_df)  # Count of Hyderabad addresses

    # Filter rows where feedback contains "wrong" (case insensitive)
    wrong_feedback_df = hyderabad_df[hyderabad_df['feedback'].str.contains('wrong', case=False, na=False)]
    wrong_feedback_count = len(wrong_feedback_df)  # Count of wrong addresses

    # Save filtered data to a new Excel file
    output_filename = "filtered_hyderabad_wrong.xlsx"
    wrong_feedback_df.to_excel(output_filename, index=False)

    return {
        "message": "Filtered data saved!",
        "file_name": output_filename,
        "hyderabad_count": hyderabad_count,
        "wrong_feedback_count": wrong_feedback_count
    }
