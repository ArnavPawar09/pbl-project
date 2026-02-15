# Cura AI – Symptom Based Disease Prediction System

Cura AI is a full-stack machine learning web application that predicts possible diseases based on user-provided symptoms.  
It integrates a trained ML model with a Flask backend and a React frontend to provide an interactive medical assistant interface.

---

## Features

- Symptom-based disease prediction
- Severity classification (Mild / Moderate / Severe)
- Remedy suggestions
- Confidence score display
- Interactive chatbot UI
- Dropdown symptom selector
- Auto suggestions while typing
- Symptom logging system
- Report upload interface (UI prototype)
- Profile page (UI prototype)

---

## Tech Stack

### Frontend
- React.js
- CSS (Custom UI Styling)
- Fetch API

### Backend
- Flask (Python)
- Flask-CORS

### Machine Learning
- Scikit-learn
- Pandas
- Numpy
- RandomForest / SVM (based on training)

---

## How It Works

1. User enters symptoms in chatbot.
2. Symptoms are converted into a binary feature vector.
3. The trained ML model predicts:
   - Disease
   - Severity
   - Confidence score
4. The backend sends results to frontend.
5. The chatbot displays:
   - Predicted Disease
   - Severity badge
   - Confidence percentage
   - Suggested remedy

---



