from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
import joblib
import pandas as pd
import numpy as np
import os

app = Flask(__name__)
# Allow CORS for local development
CORS(app, resources={r"/*": {"origins": "*"}})

# Load model and artifacts
MODELS_DIR = os.path.dirname(os.path.abspath(__file__))
UI_DIR = os.path.join(MODELS_DIR, 'web-ui')
try:
    model = joblib.load(os.path.join(MODELS_DIR, 'salary_model.pkl'))
    encoders = joblib.load(os.path.join(MODELS_DIR, 'encoders.pkl'))
    features = joblib.load(os.path.join(MODELS_DIR, 'features.pkl'))
    print("Model and artifacts loaded successfully.")
except Exception as e:
    model = None
    encoders = None
    features = None
    print(f"Error loading model: {e}")

@app.route('/', methods=['GET'])
def index():
    return send_from_directory(UI_DIR, 'index.html')

@app.route('/<path:path>')
def serve_static(path):
    return send_from_directory(UI_DIR, path)

@app.route('/predict', methods=['POST'])
def predict():
    if model is None:
        return jsonify({'error': 'Model not trained yet'}), 400
    
    data = request.json
    try:
        # Create DataFrame from input
        input_df = pd.DataFrame([data])
        
        # Preprocess categorical features
        categorical_cols = ['job_title', 'education_level', 'industry', 'company_size', 'location', 'remote_work']
        for col in categorical_cols:
            if col in input_df.columns:
                le = encoders[col]
                val = str(input_df[col].iloc[0])
                if val in le.classes_:
                    input_df[col] = le.transform([val])[0]
                else:
                    # Default to first class if unknown
                    input_df[col] = le.transform([le.classes_[0]])[0]
        
        # Ensure numerical columns are numeric
        numerical_cols = ['experience_years', 'skills_count', 'certifications']
        for col in numerical_cols:
            if col in input_df.columns:
                input_df[col] = pd.to_numeric(input_df[col])

        # Ensure correct column order
        input_df = input_df[features]
        
        # Predict
        prediction = model.predict(input_df)
        
        return jsonify({
            'salary': round(float(prediction[0]), 2)
        })
    except Exception as e:
        import traceback
        traceback.print_exc()
        return jsonify({'error': str(e)}), 500

@app.route('/options', methods=['GET'])
def get_options():
    if encoders is None:
        return jsonify({'error': 'Encoders not loaded'}), 400
    
    options = {}
    for col, le in encoders.items():
        options[col] = sorted(le.classes_.tolist())
    
    return jsonify(options)

if __name__ == '__main__':
    app.run(debug=True, port=5000)
