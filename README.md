# Cura AI – Symptom Based Disease Prediction System

Cura AI is a full-stack machine learning web application that predicts possible diseases based on user-provided symptoms.  
It integrates a trained ML model with a Flask backend and a React frontend to provide an interactive medical assistant interface.

---

## Features

- Symptom-based disease prediction
- Disease severity tag
- Prediction confidence score
- Remedy suggestions
- Interactive chatbot UI
- Dropdown symptom selector
- Symptom logging system
- Report upload interface (UI prototype)
- Profile page (UI prototype)

---

## Tech Stack

### Frontend
- React.js
- React Router
- CSS (Custom UI Styling)
- Fetch API

### Backend & Database
- Flask (Python)
- Flask-CORS
- Supabase (Database & Authentication)

### Machine Learning & AI
- Scikit-learn
- Pandas
- Numpy
- Random Forest Classifier (currently)
- Groq API (LLaMA 3.1 for Medical Chatbot Assistant)

---

## How It Works

1. User enters symptoms in chatbot.
2. Symptoms are converted into a binary feature vector.
3. The trained ML model predicts:
   - Disease
4. The backend sends results to frontend.
5. The chatbot (powered by Groq/LLaMA API) displays:
   - Predicted Disease
   - Disease Severity Tag
   - Confidence Score
   - Suggested remedy

---



