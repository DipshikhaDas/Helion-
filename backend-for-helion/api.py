from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import List
import numpy as np
from tensorflow.keras.models import load_model
from tensorflow.keras.preprocessing.sequence import pad_sequences
import json
import logging
from fastapi.middleware.cors import CORSMiddleware
import os

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def load_json_file(filepath):
    try:
        with open(filepath, "r") as f:
            return json.load(f)
    except Exception as e:
        logger.error(f"Error loading JSON file {filepath}: {e}")
        return None

def load_model_safe(filepath):
    if not os.path.exists(filepath):
        logger.error(f"Model file {filepath} does not exist.")
        return None
    try:
        model = load_model(filepath)
        logger.info(f"Model loaded: {filepath}")
        return model
    except Exception as e:
        logger.error(f"Error loading model {filepath}: {e}")
        return None

lstm_model_3 = load_model_safe("lstm_model_3.h5")
lstm_model_4 = load_model_safe("lstm_model_4.h5")
lstm_model_5 = load_model_safe("lstm_model_5.h5")
lstm_model_n = load_model_safe("lstm_model_n.h5")

rnn_model_3 = load_model_safe("rnn_model_3.h5")
rnn_model_4 = load_model_safe("rnn_model_4.h5")
rnn_model_5 = load_model_safe("rnn_model_5.h5")
rnn_model_n = load_model_safe("rnn_model_n.h5")

lstm_all_3_20 = load_model_safe("lstm_all_3_20.h5")
lstm_all_5_15_2layers = load_model_safe("lstm_all_5_15_2layers.h5")
lstm_all_5_15 = load_model_safe("lstm_all_5_15.h5")


event_to_idx_lstm = load_json_file("event_to_idx_lstm.json")
idx_to_event_lstm = load_json_file("idx_to_event_lstm.json")

event_to_idx_rnn = load_json_file("event_to_idx_rnn.json")
idx_to_event_rnn = load_json_file("idx_to_event_rnn.json")

event_to_idx_all = load_json_file("event_to_idx_all.json")
idx_to_event_all = load_json_file("idx_to_event_all.json")

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  
    allow_credentials=True,
    allow_methods=["*"], 
    allow_headers=["*"],  
)

class PredictionRequest(BaseModel):
    input_sequence: List[str]

class PredictionResponse(BaseModel):
    predicted_event: str

def predict_event(input_sequence, model, event_to_idx, idx_to_event, maxlen=3):
    try:
        encoded_sequence = [event_to_idx[event] for event in input_sequence]
        padded_sequence = pad_sequences([encoded_sequence], maxlen=maxlen, padding="post")
        probabilities = model.predict(padded_sequence)
        predicted_index = np.argmax(probabilities)
        predicted_event = idx_to_event[str(predicted_index)]
        return predicted_event
    except KeyError as e:
        raise HTTPException(status_code=400, detail=f"Invalid event: {e}")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Prediction failed: {e}")

@app.post("/predict/lstm/3", response_model=PredictionResponse)
def predict_lstm_3(request: PredictionRequest):
    if not lstm_model_3:
        raise HTTPException(status_code=500, detail="LSTM model 3 is unavailable.")
    predicted_event = predict_event(
        request.input_sequence, lstm_model_3, event_to_idx_lstm, idx_to_event_lstm
    )
    return {"predicted_event": predicted_event}


@app.post("/predict/lstm/4", response_model=PredictionResponse)
def predict_lstm_4(request: PredictionRequest):
    if not lstm_model_4:
        raise HTTPException(status_code=500, detail="LSTM model 4 is unavailable.")
    predicted_event = predict_event(
        request.input_sequence, lstm_model_4, event_to_idx_lstm, idx_to_event_lstm
    )
    return {"predicted_event": predicted_event}


@app.post("/predict/lstm/5", response_model=PredictionResponse)
def predict_lstm_5(request: PredictionRequest):
    if not lstm_model_5:
        raise HTTPException(status_code=500, detail="LSTM model 5 is unavailable.")
    predicted_event = predict_event(
        request.input_sequence, lstm_model_5, event_to_idx_lstm, idx_to_event_lstm
    )
    return {"predicted_event": predicted_event}


@app.post("/predict/lstm/n", response_model=PredictionResponse)
def predict_lstm_n(request: PredictionRequest):
    if not lstm_model_n:
        raise HTTPException(status_code=500, detail="LSTM model n is unavailable.")
    predicted_event = predict_event(
        request.input_sequence, lstm_model_n, event_to_idx_lstm, idx_to_event_lstm
    )
    return {"predicted_event": predicted_event}



@app.post("/predict/rnn/3", response_model=PredictionResponse)
def predict_rnn_3(request: PredictionRequest):
    if not rnn_model_3:
        raise HTTPException(status_code=500, detail="RNN model 3 is unavailable.")
    predicted_event = predict_event(
        request.input_sequence, rnn_model_3, event_to_idx_rnn, idx_to_event_rnn
    )
    return {"predicted_event": predicted_event}

@app.post("/predict/rnn/4", response_model=PredictionResponse)
def predict_rnn_4(request: PredictionRequest):
    if not rnn_model_4:
        raise HTTPException(status_code=500, detail="RNN model 4 is unavailable.")
    predicted_event = predict_event(
        request.input_sequence, rnn_model_4, event_to_idx_rnn, idx_to_event_rnn
    )
    return {"predicted_event": predicted_event}

@app.post("/predict/rnn/5", response_model=PredictionResponse)
def predict_rnn_5(request: PredictionRequest):
    if not rnn_model_5:
        raise HTTPException(status_code=500, detail="RNN model 5 is unavailable.")
    predicted_event = predict_event(
        request.input_sequence, rnn_model_5, event_to_idx_rnn, idx_to_event_rnn
    )
    return {"predicted_event": predicted_event}

@app.post("/predict/rnn/n", response_model=PredictionResponse)
def predict_rnn_n(request: PredictionRequest):
    if not rnn_model_n:
        raise HTTPException(status_code=500, detail="RNN model n is unavailable.")
    predicted_event = predict_event(
        request.input_sequence, rnn_model_n, event_to_idx_rnn, idx_to_event_rnn
    )
    return {"predicted_event": predicted_event}


@app.post("/predict/all/5-15", response_model=PredictionResponse)
def predict_all_5_15(request: PredictionRequest):
    if not lstm_all_5_15:
        raise HTTPException(status_code=500, detail="LSTM 5_15 model is unavailable.")
    predicted_event = predict_event(
        request.input_sequence, lstm_all_5_15, event_to_idx_all, idx_to_event_all
    )
    return {"predicted_event": predicted_event}

@app.post("/predict/all/2layers/5-15", response_model=PredictionResponse)
def predict_all_5_15(request: PredictionRequest):
    if not lstm_all_5_15_2layers:
        raise HTTPException(status_code=500, detail="lstm_all_5_15_2layers model is unavailable.")
    predicted_event = predict_event(
        request.input_sequence, lstm_all_5_15_2layers, event_to_idx_all, idx_to_event_all
    )
    return {"predicted_event": predicted_event}

@app.post("/predict/all/5-15", response_model=PredictionResponse)
def predict_all_5_15(request: PredictionRequest):
    if not lstm_all_5_15:
        raise HTTPException(status_code=500, detail="lstm_all_5_15 model is unavailable.")
    predicted_event = predict_event(
        request.input_sequence, lstm_all_5_15_2layers, event_to_idx_all, idx_to_event_all
    )
    return {"predicted_event": predicted_event}

@app.post("/predict/all/3-20", response_model=PredictionResponse)
def predict_all_3_20(request: PredictionRequest):
    if not lstm_all_3_20:
        raise HTTPException(status_code=500, detail="lstm_all_3_20 model is unavailable.")
    predicted_event = predict_event(
        request.input_sequence, lstm_all_3_20, event_to_idx_all, idx_to_event_all
    )
    return {"predicted_event": predicted_event}