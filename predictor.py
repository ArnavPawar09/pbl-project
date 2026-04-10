import pickle
import pandas as pd
import numpy as np

with open("cura_model.pkl", "rb") as f:
    loaded_model = pickle.load(f)

with open("feature_columns.pkl", "rb") as f:
    feature_columns = pickle.load(f)

disease_info = {
    # --- Original 6 ---
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
    },
    # --- Respiratory ---
    "bronchitis": {
        "remedy": "Rest, drink warm fluids, use a humidifier, and avoid irritants. See a doctor if cough persists.",
        "severity": "moderate"
    },
    "pneumonia": {
        "remedy": "Seek medical attention immediately. Rest, hydrate, and complete prescribed antibiotics.",
        "severity": "severe"
    },
    "laryngitis": {
        "remedy": "Rest your voice, stay hydrated, use throat lozenges, and avoid whispering.",
        "severity": "mild"
    },
    "sinusitis": {
        "remedy": "Use saline nasal spray, stay hydrated, apply warm compresses, and use steam inhalation.",
        "severity": "mild"
    },
    # --- Infectious ---
    "strep throat": {
        "remedy": "Consult a doctor for antibiotics. Gargle with warm salt water and rest.",
        "severity": "moderate"
    },
    "urinary tract infection": {
        "remedy": "Drink plenty of water, avoid irritants, and consult a doctor for antibiotics.",
        "severity": "moderate"
    },
    "ear infection (otitis media)": {
        "remedy": "Apply a warm compress. See a doctor if pain persists; antibiotics may be needed.",
        "severity": "moderate"
    },
    "viral pharyngitis": {
        "remedy": "Rest, drink warm fluids, gargle with salt water. Usually resolves on its own.",
        "severity": "mild"
    },
    # --- Digestive ---
    "gastroenteritis": {
        "remedy": "Stay hydrated with oral rehydration salts, eat bland foods, and rest.",
        "severity": "moderate"
    },
    "indigestion": {
        "remedy": "Eat smaller meals, avoid spicy/fatty foods, and try antacids if needed.",
        "severity": "mild"
    },
    "gastritis": {
        "remedy": "Avoid alcohol, spicy food, and NSAIDs. Eat small frequent meals. Consult a doctor.",
        "severity": "moderate"
    },
    # --- Allergic ---
    "seasonal allergies (hay fever)": {
        "remedy": "Avoid allergens, use antihistamines, and try saline nasal rinse.",
        "severity": "mild"
    },
    # --- Deficiency / Systemic ---
    "vitamin b12 deficiency": {
        "remedy": "Eat B12-rich foods (meat, eggs, dairy) or take supplements. Consult a doctor.",
        "severity": "moderate"
    },
    "hypothyroidism": {
        "remedy": "Consult an endocrinologist. Medication (levothyroxine) is usually required.",
        "severity": "moderate"
    },
    # --- Pain ---
    "sciatica": {
        "remedy": "Apply hot/cold packs, gentle stretching, and OTC pain relief. See a doctor if persistent.",
        "severity": "moderate"
    },
}


# creating a function so its easier to call for API
def predict_disease(selected_symptoms):
    input_data = dict.fromkeys(feature_columns, 0)

    for symptom in selected_symptoms:
        if symptom in input_data:
            input_data[symptom] = 1

    input_df = pd.DataFrame([input_data])

    prediction = loaded_model.predict(input_df)[0]

    # Use predict_proba for a proper confidence percentage
    try:
        probabilities = loaded_model.predict_proba(input_df)[0]
        confidence_percent = round(float(np.max(probabilities)) * 100, 2)
    except AttributeError:
        # Fallback for models without predict_proba
        confidence_percent = 0.0

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






