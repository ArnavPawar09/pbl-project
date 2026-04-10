from flask import Flask, request, jsonify
from flask_cors import CORS
from predictor import predict_disease
from groq import Groq
import os

app = Flask(__name__)
CORS(app)

# --- Groq LLM Client ---
groq_client = Groq(api_key=os.environ.get("GROQ_API_KEY", ""))

SYSTEM_PROMPT = """You are Cura AI, a helpful medical information assistant. You MUST follow these rules strictly:

1. ONLY answer questions related to diseases, health conditions, symptoms, and home remedies.
2. Provide clear explanations of what diseases are, their common symptoms, and safe home remedies.
3. NEVER prescribe or recommend specific medications, drugs, or pharmaceutical treatments. If asked, politely explain that you can only suggest home remedies and that they should consult a qualified doctor for medication.
4. NEVER answer questions unrelated to health and diseases. If the user asks about anything else (coding, math, politics, recipes, etc.), respond ONLY with: "I'm sorry, I can only help with health-related questions about diseases, symptoms, and home remedies. Please ask me something related to your health!"
5. Always include a disclaimer that your advice is for informational purposes only and is not a substitute for professional medical advice.
6. Keep responses concise, friendly, and easy to understand.
7. Focus on common, everyday ailments and general wellness advice."""


# Test route
@app.route("/")
def home():
    return "Cura AI Backend Running"


# Return available symptoms (feature columns) for the frontend
@app.route("/symptoms", methods=["GET"])
def get_symptoms():
    from predictor import feature_columns
    return jsonify({"symptoms": feature_columns})


# Prediction route
@app.route("/predict", methods=["POST"])
def predict():
    data = request.get_json()

    if not data or "symptoms" not in data:
        return jsonify({"error": "No symptoms provided"}), 400

    symptoms = data["symptoms"]

    if not isinstance(symptoms, list):
        return jsonify({"error": "Symptoms must be a list"}), 400

    result = predict_disease(symptoms)
    return jsonify(result)


# LLM Chat route
@app.route("/chat", methods=["POST"])
def chat():
    data = request.get_json()

    if not data or "message" not in data:
        return jsonify({"error": "No message provided"}), 400

    user_message = data["message"].strip()

    if not user_message:
        return jsonify({"error": "Empty message"}), 400

    # Build conversation history if provided
    messages = [{"role": "system", "content": SYSTEM_PROMPT}]

    # Include conversation history if the frontend sends it
    history = data.get("history", [])
    for msg in history[-10:]:  # Keep last 10 messages for context
        role = "user" if msg.get("sender") == "user" else "assistant"
        messages.append({"role": role, "content": msg.get("text", "")})

    messages.append({"role": "user", "content": user_message})

    try:
        completion = groq_client.chat.completions.create(
            model="llama-3.1-8b-instant",
            messages=messages,
            temperature=0.6,
            max_tokens=512,
        )

        reply = completion.choices[0].message.content
        return jsonify({"reply": reply})

    except Exception as e:
        print(f"Groq API error: {e}")
        return jsonify({"error": "Failed to get a response. Please try again."}), 500


if __name__ == "__main__":
    app.run(debug=True)
