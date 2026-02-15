import pickle
import pandas as pd
import numpy as np

with open("cura_model.pkl", "rb") as f:
    loaded_model = pickle.load(f)

with open("feature_columns.pkl", "rb") as f:
    feature_columns = pickle.load(f)

disease_info = {
    "common cold": {
        "remedy": "Drink plenty of fluids, take rest, and use steam inhalation if needed.",
        "severity": "mild"
    },
    "flu": {
        "remedy": "Rest, drink fluids, and monitor temperature. Consult a doctor if fever persists.",
        "severity": "moderate"
    },
    "migraine": {
        "remedy": "Rest in a dark quiet room, stay hydrated, and avoid triggers.",
        "severity": "moderate"
    },
    "tension headache": {
        "remedy": "Hydrate, improve posture, reduce stress, and get proper sleep.",
        "severity": "mild"
    },
    "iron deficiency anemia": {
        "remedy": "Increase iron-rich foods like spinach, lentils, and consult a doctor for supplements.",
        "severity": "moderate"
    },
    "tonsillitis": {
        "remedy": "Warm salt water gargles, rest, and stay hydrated. Seek medical care if severe.",
        "severity": "moderate"
    }
}


# creating a function so its easier to call for API
def predict_disease(selected_symptoms):
    input_data = dict.fromkeys(feature_columns, 0)

    for symptom in selected_symptoms:
        if symptom in input_data:
            input_data[symptom] = 1

    input_df = pd.DataFrame([input_data])

    prediction = loaded_model.predict(input_df)[0]
    probabilities = loaded_model.decision_function(input_df)

    confidence = float(np.max(probabilities))
    confidence_percent = round(abs(confidence) * 10, 2)  # scaled for demo


    # Get remedy and severity
    info = disease_info.get(prediction, {
        "remedy": "No remedy information available.",
        "severity": "unknown"
    })

    return {
    "predicted_disease": prediction,
    "remedy": info["remedy"],
    "severity": info["severity"],
    "confidence": confidence_percent
}




"""
# creating a symptom vector
input_data = dict.fromkeys(feature_columns, 0)
input_data["fever"] = 1
input_data["cough"] = 1
input_data["headache"] = 1

input_df = pd.DataFrame([input_data])

# output
prediction = loaded_model.predict(input_df)
print("Predicted Disease:", prediction[0])
"""

# to stop returning prediction automatically when its called from API
if __name__ == "__main__":
    result = predict_disease(["fever", "cough", "headache"])
    print("Predicted Disease:", result)






