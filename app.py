from flask import Flask, request, jsonify
from flask_cors import CORS
from predictor import predict_disease

app = Flask(__name__)
CORS(app)

# Test route
@app.route("/")
def home():
    return "Cura AI Backend Running"


# Prediction route
@app.route("/predict", methods=["POST"])
def predict():
    data = request.get_json()

    # Basic validation
    if not data or "symptoms" not in data:
        return jsonify({"error": "No symptoms provided"}), 400

    symptoms = data["symptoms"]

    if not isinstance(symptoms, list):
        return jsonify({"error": "Symptoms must be a list"}), 400

    # Call ML function
    result = predict_disease(symptoms)
    return jsonify(result)



if __name__ == "__main__":
    app.run(debug=True)





