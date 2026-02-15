# dataset and training
import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.svm import SVC
# metrics and visualization
from sklearn.metrics import classification_report
from sklearn.metrics import confusion_matrix
import seaborn as sns
import matplotlib.pyplot as plt
# saving trained model
import pickle 

df = pd.read_csv("cleaned_dataset.csv")

# separate features and targets
X = df.drop("diseases", axis=1)
y = df["diseases"]

# train/test splitting
X_train, X_test, y_train, y_test = train_test_split(
    X, y,
    test_size=0.2,
    random_state=42,
    stratify=y  # ensures equal distribution in train and test datasets
)

# train SVM model
model = SVC(kernel="linear", class_weight="balanced") # linear works well for binary data
model.fit(X_train, y_train)

# accuracy/precision/f1-score/recall
accuracy = model.score(X_test, y_test)
print("Accuracy:", accuracy)

y_pred = model.predict(X_test)
print(classification_report(y_test, y_pred))


# confusion matrix
cm = confusion_matrix(y_test, y_pred)

sns.heatmap(cm, annot=True, fmt="d",
            xticklabels=model.classes_,
            yticklabels=model.classes_)
plt.xlabel("Predicted")
plt.ylabel("Actual")
plt.title("Confusion Matrix")
plt.show()

# saving trained model  
with open("cura_model.pkl", "wb") as f:
    pickle.dump(model, f)
print("Model saved successfully.")

feature_columns = X.columns.tolist()

# saving the order of feature columns so it can be used with flask
with open("feature_columns.pkl", "wb") as f:
    pickle.dump(feature_columns, f)
print("Feature columns saved successfully.")







