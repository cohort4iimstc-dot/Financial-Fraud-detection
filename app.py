# =========================
# 1. Import Libraries
# =========================
import psycopg2
import pandas as pd
import pickle
from sklearn.metrics import accuracy_score, classification_report, confusion_matrix

# =========================
# 2. Load Model
# =========================
model = pickle.load(open("fraud_model.pkl", "rb"))

# =========================
# 3. Connect Database
# =========================
conn = psycopg2.connect(
    database="fraud_detection",
    user="postgres",
    password="Chai@2004",
    host="localhost",
    port="5432"
)

cursor = conn.cursor()
print("✅ Connected to Database")

# =========================
# 4. Fetch REAL TEST DATA (Better than 10 rows)
# =========================
query = """
SELECT * FROM transactions1
WHERE split_set = 'test'
LIMIT 1000
"""

df = pd.read_sql(query, conn)

print("\nData fetched:", df.shape)

# =========================
# 5. Fix Column Names
# =========================
df.columns = df.columns.str.capitalize()
df.rename(columns={"Actual_class": "Class"}, inplace=True)

# =========================
# 6. Add Missing Feature
# =========================
df["Time"] = 0

# =========================
# 7. Prepare Features
# =========================
feature_cols = ["Time"] + [f"V{i}" for i in range(1, 29)] + ["Amount"]

X = df[feature_cols]
y_true = df["Class"]

# =========================
# 8. Predict
# =========================
predictions = model.predict(X)

# =========================
# 9. Show Sample Results
# =========================
print("\n🔍 Sample Prediction Results:\n")

for i in range(10):   # show first 10 only
    actual = "⚠️ Fraud" if y_true.iloc[i] == 1 else "✅ Legitimate"
    predicted = "⚠️ Fraud" if predictions[i] == 1 else "✅ Legitimate"

    print(f"Transaction {i+1}: Actual = {actual} | Predicted = {predicted}")

# =========================
# 10. Evaluation Metrics
# =========================
accuracy = accuracy_score(y_true, predictions)

print("\n📊 Accuracy:", accuracy)
print("\n📉 Confusion Matrix:\n", confusion_matrix(y_true, predictions))
print("\n📋 Classification Report:\n", classification_report(y_true, predictions))

print("Total Fraud (Actual):", sum(y_true))
print("Total Fraud (Predicted):", sum(predictions))

# =========================
# 11. Store Predictions
# =========================
for i in range(len(predictions)):
    cursor.execute("""
        INSERT INTO model_predictions (transaction_id, model_name, predicted_class)
        VALUES (%s, %s, %s)
    """, (
        int(df.iloc[i]["Transaction_id"]),
        "random_forest",
        int(predictions[i])
    ))

conn.commit()
print("\n✅ Predictions stored")

# =========================
# 12. Store Accuracy
# =========================
cursor.execute("""
    INSERT INTO model_metrics (model_name, accuracy)
    VALUES (%s, %s)
""", ("random_forest", float(accuracy)))

conn.commit()

# =========================
# 13. Close Connection
# =========================
conn.close()