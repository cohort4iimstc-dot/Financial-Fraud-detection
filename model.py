import pandas as pd
import pickle
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier

print("Loading dataset...")

# Load dataset
df = pd.read_csv("creditcard.csv")

# Features & target
X = df.drop("Class", axis=1)
y = df["Class"]

print("Splitting data...")

# Train-test split
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42
)

print("Training model...")

# Train model
model = RandomForestClassifier(n_estimators=50)
model.fit(X_train, y_train)

print("Saving model...")

# Save model
with open("fraud_model.pkl", "wb") as f:
    pickle.dump(model, f)

print("✅ Model saved successfully!")