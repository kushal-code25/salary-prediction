import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import LabelEncoder
from xgboost import XGBRegressor
from sklearn.metrics import r2_score, mean_absolute_error
import joblib
import os

def train():
    print("Loading dataset...")
    dataset_path = 'job_salary_prediction_dataset.csv'
    if not os.path.exists(dataset_path):
        print(f"Error: {dataset_path} not found.")
        return

    df = pd.read_csv(dataset_path)
    
    print("Preprocessing data...")
    categorical_cols = ['job_title', 'education_level', 'industry', 'company_size', 'location', 'remote_work']
    encoders = {}

    for col in categorical_cols:
        le = LabelEncoder()
        df[col] = le.fit_transform(df[col])
        encoders[col] = le

    X = df.drop('salary', axis=1)
    y = df['salary']

    # Split
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

    print("Training XGBoost model...")
    model = XGBRegressor(
        n_estimators=1000, 
        learning_rate=0.05, 
        max_depth=7, 
        n_jobs=-1,
        random_state=42,
        verbosity=1
    )
    model.fit(X_train, y_train)

    # Predict and Evaluate
    print("Evaluating model...")
    y_pred = model.predict(X_test)
    r2 = r2_score(y_test, y_pred)
    mae = mean_absolute_error(y_test, y_pred)

    accuracy_pct = r2 * 100
    print(f"R-squared (Accuracy): {accuracy_pct:.2f}%")
    print(f"Mean Absolute Error: ${mae:.2f}")

    # Save
    print("Saving model and artifacts...")
    joblib.dump(model, 'salary_model.pkl')
    joblib.dump(encoders, 'encoders.pkl')
    joblib.dump(X.columns.tolist(), 'features.pkl')
    print("Done!")

if __name__ == "__main__":
    train()
