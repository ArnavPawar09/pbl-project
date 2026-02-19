# Dataset and Training
import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
# Metrics and visualization
from sklearn.metrics import classification_report, confusion_matrix
import seaborn as sns
import matplotlib.pyplot as plt
# Saving trained model
import pickle

# Load Dataset
df = pd.read_csv("cleaned_dataset.csv")
X = df.drop("diseases", axis=1)
y = df["diseases"]

# Train/Test Split
X_train, X_test, y_train, y_test = train_test_split(
    X,
    y,
    test_size=0.2,
    random_state=42,
    stratify=y  # keeps class balance
)

# Train Random Forest Model
model = RandomForestClassifier(
    n_estimators=200,      # number of trees
    random_state=42,
    class_weight="balanced"  # handles slight imbalance
)
model.fit(X_train, y_train)

# Evaluation
accuracy = model.score(X_test, y_test)
print("Accuracy:", accuracy)

y_pred = model.predict(X_test)
print("\nClassification Report:\n")
print(classification_report(y_test, y_pred))

# Confusion Matrix
cm = confusion_matrix(y_test, y_pred)
plt.figure(figsize=(8, 6))
sns.heatmap(
    cm,
    annot=True,
    fmt="d",
    xticklabels=model.classes_,
    yticklabels=model.classes_
)
plt.xlabel("Predicted")
plt.ylabel("Actual")
plt.title("Confusion Matrix")
plt.show()

# Feature Importance (Bonus)
importances = pd.Series(
    model.feature_importances_,
    index=X.columns
).sort_values(ascending=False)

print("\nTop 10 Important Symptoms:\n")
print(importances.head(10))

# Save Trained Model
with open("cura_model.pkl", "wb") as f:
    pickle.dump(model, f)
print("\nModel saved successfully.")

# Save Feature Columns
feature_columns = X.columns.tolist()
with open("feature_columns.pkl", "wb") as f:
    pickle.dump(feature_columns, f)
print("Feature columns saved successfully.")
