# SalaryX | AI-Powered Salary Predictor

SalaryX is a full-stack machine learning application that predicts annual salaries based on job titles, experience, education, location, and other professional factors. It features a high-performance XGBoost model and a modern, glassmorphic vanilla web interface.

## 🚀 Features

- **AI Predictions**: Uses an XGBoost regressor trained on thousands of data points.
- **Modern UI**: A premium, responsive dashboard built with vanilla HTML, CSS, and JS (no frameworks required).
- **Multi-Currency Support**: Automatically converts and formats predictions based on the selected country (Rupees for India, Pounds for UK, etc.).
- **Dynamic Options**: Form dropdowns are dynamically populated from the model's training categories.
- **Glassmorphic Design**: Sleek, transparent UI elements with smooth micro-animations.

## 📂 Project Structure

```text
salary prediction/
├── app.py                # Flask Backend API
├── train_model.py        # ML Training Script
├── web-ui/               # Vanilla Frontend
│   ├── index.html        # UI Structure
│   ├── style.css         # Glassmorphic Styling
│   └── script.js         # Frontend Logic & API calls
├── salary_model.pkl      # Trained XGBoost Model
├── encoders.pkl          # Categorical Feature Encoders
├── features.pkl          # List of model features
└── job_salary_prediction_dataset.csv  # Training Data
```

## 🛠️ Installation & Setup

### 1. Prerequisites
- Python 3.8+
- Recommended: `pip install pandas scikit-learn xgboost joblib flask flask-cors`

### 2. Training the Model
If you need to retrain the model with fresh data:
```bash
python train_model.py
```

### 3. Running the Application
Start the Flask backend server:
```bash
python app.py
```
The server will start at `http://127.0.0.1:5000`.

### 4. Accessing the UI
Simply open your browser and navigate to:
[`http://127.0.0.1:5000`](http://127.0.0.1:5000)

## 📊 Model Information

- **Algorithm**: XGBoost Regressor
- **Target Accuracy**: ~95% R-squared
- **Features**:
  - Job Title
  - Experience (Years)
  - Education Level
  - Industry
  - Company Size
  - Location
  - Skills Count
  - Certifications
  - Remote/On-site preference

## 🌐 Currency Support

The app currently supports local formatting and conversion for:
- 🇮🇳 **India** (INR / ₹)
- 🇺🇸 **USA** (USD / $)
- 🇬🇧 **UK** (GBP / £)
- 🇪🇺 **Germany/Netherlands** (EUR / €)
- 🇦🇺 **Australia** (AUD)
- 🇨🇦 **Canada** (CAD)
- 🇸🇬 **Singapore** (SGD)
- 🇸🇪 **Sweden** (SEK)

## 📝 License
This project is for educational and demonstration purposes.
