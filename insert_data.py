import pandas as pd
from sqlalchemy import create_engine

# Load dataset
df = pd.read_csv("creditcard.csv")
print("Dataset loaded:", df.shape)

# Rename columns to match DB
df.columns = df.columns.str.lower()
df.rename(columns={"class": "actual_class"}, inplace=True)

# Add split column (train/test)
df["split_set"] = "test"   # you can change later

# Drop Time column (not in your table)
df = df.drop("time", axis=1)

# Reorder columns (IMPORTANT)
cols = [f"v{i}" for i in range(1, 29)] + ["amount", "actual_class", "split_set"]
df = df[cols]

# Connect DB
engine = create_engine("postgresql://postgres:Chai%402004@localhost:5432/fraud_detection")

# Insert into correct table
df.to_sql("transactions1", engine, if_exists="append", index=False)

print("✅ Data inserted into transactions table!")