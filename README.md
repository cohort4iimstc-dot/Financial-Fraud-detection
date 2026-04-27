# UPI Fraud Detection

## Project Overview

This project aims to develop a machine learning model for detecting fraudulent UPI transactions. The dataset consists of transaction details, user behaviors, and associated metadata. The pipeline follows a structured approach including data preprocessing, feature engineering, model training, evaluation, and prediction.

## Directory Structure

```
project-root/
│── data/
│   ├── raw/                      # Raw dataset before processing
│   ├── processed/                 # Preprocessed dataset
│── models/                        # Trained models and saved weights
│── notebooks/                     # Jupyter Notebooks for each step
│── reports/                       # Generated reports and predictions
│── src/                           # Python scripts for preprocessing and training
│── README.md                      # Documentation
```

## Files and Workflow

### 1. Data Preprocessing (`02_data_preprocessing.ipynb`)
- Loads the raw dataset and checks for missing values and duplicates
- Converts categorical variables using label encoding
- Extracts time-based features from the timestamp
- Handles outliers and scales numerical features using standardization and min-max scaling
- Addresses class imbalance using SMOTE
- Selects important features based on feature importance scores
- Saves the cleaned dataset

### 2. Feature Engineering (`03_feature_engineering.ipynb`)
- Uses feature selection techniques like `SelectKBest`, `mutual_info_classif`, and `RandomForestClassifier`
- Applies dimensionality reduction using PCA
- Identifies the most relevant features contributing to fraud detection

### 3. Model Training (`04_model_training.ipynb`)
- Trains multiple classification models including Logistic Regression, Decision Trees, Random Forest, Gradient Boosting, XGBoost, and Neural Networks
- Compares performance using cross-validation
- Saves all trained models using pickle for further evaluation

### 4. Model Evaluation (`05_model_evaluation.ipynb`)
- Loads all trained models from the previous step
- Computes performance metrics including accuracy, precision, recall, F1-score, and AUC-ROC
- Identifies the best-performing model based on evaluation metrics
- Saves the best model for future use

### 5. Prediction (`06_predictions.ipynb`)
- Loads the best model from storage
- Reads new transaction data for prediction
- Applies the same preprocessing steps as training data
- Generates predictions and saves results to a report

## Setup Instructions

### Prerequisites
Ensure the following dependencies are installed:
- Python 3.x
- Jupyter Notebook
- Pandas, NumPy, Scikit-learn, Imbalanced-learn, Matplotlib, Seaborn
- XGBoost, LightGBM, TensorFlow/Keras (if applicable)

### Installation
1. Clone the repository
```
git clone git@github.com:yeswaraditya/UPI-Fraud-Prediction.git
cd UPI-Fraud-Prediction
```
2. Install required dependencies
```
pip install -r requirements.txt
```
3. Run Jupyter Notebook
```
jupyter notebook
```

## Usage
1. Open `notebooks/` and execute each file in sequence.
2. Ensure preprocessed data is saved before training models.
3. Run `04_model_training.ipynb` to train and save models.
4. Evaluate models using `05_model_evaluation.ipynb` and select the best-performing one.
5. Use `06_predictions.ipynb` to predict fraud on new transactions.