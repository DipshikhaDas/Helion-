from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import List
import numpy as np
from tensorflow.keras.models import load_model
from tensorflow.keras.preprocessing.sequence import pad_sequences
import json
from fastapi.middleware.cors import CORSMiddleware


try:
    model = load_model("model.h5")
    print("Model loaded")
except Exception as e:
    print("Error loading model", e)

with open("event_to_idx.json", "r") as f:
    event_to_idx = json.load(f)

with open("idx_to_event.json", "r") as f:
    idx_to_event = json.load(f)

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Allow your frontend URL
    allow_credentials=True,
    allow_methods=["*"],  # Allow all HTTP methods (GET, POST, etc.)
    allow_headers=["*"],  # Allow all headers
)

class PredictionRequest(BaseModel):
    input_sequence: List[str] 

class PredictionResponse(BaseModel):
    predicted_event: str

@app.post("/predict/lstm", response_model=PredictionResponse)
def predict(request: PredictionRequest):
    try:
        print("Input sequence received:", request.input_sequence)

        input_sequence = [
            event_to_idx[event] for event in request.input_sequence
        ]
        print("Encoded input sequence:", input_sequence)

        input_sequence = pad_sequences([input_sequence], maxlen=3, padding="post")
        print("Padded input sequence:", input_sequence)

        predicted_probability = model.predict(input_sequence)
        print("Predicted probabilities:", predicted_probability)

        predicted_index = np.argmax(predicted_probability)
        print("Predicted index:", predicted_index)

        predicted_event = idx_to_event[str(predicted_index)]
        print("Predicted event:", predicted_event)

        return {"predicted_event": predicted_event}
    except KeyError as e:
        print("KeyError:", e)
        raise HTTPException(status_code=400, detail=f"Invalid event: {e}")
    except Exception as e:
        print("Unexpected error:", e)
        raise HTTPException(status_code=500, detail=f"An unexpected error occurred: {e}")

    return {"predicted_event": predicted_event}
