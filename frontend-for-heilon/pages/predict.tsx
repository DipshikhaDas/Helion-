import React, { useState } from "react";
import axios from "axios";

const Predict: React.FC = () => {
  const [model, setModel] = useState<string>("");
  const [sequenceLength, setSequenceLength] = useState<number>(1);
  const [inputSequences, setInputSequences] = useState<string[]>([""]);
  const [output, setOutput] = useState<string[]>([]);
  const [buttonText, setButtonText] = useState<string>("Predict");

  const handlePredict = async () => {
    try {
      const requestPayload = {
        input_sequence: inputSequences,
      };

      console.log("Request payload:", requestPayload);

      // Send POST request to the backend
      const response = await axios.post(
        "http://127.0.0.1:8000/predict/lstm",
        requestPayload
      );

      console.log("Response from backend:", response.data);

      // Get the predicted event
      const predictedEvent = response.data.predicted_event;

      // Append the new prediction to the output array
      setOutput((prevOutput) => [...prevOutput, predictedEvent]);

      // Update inputSequences for the next prediction
      setInputSequences((prevSequences) => {
        const newInput = [...prevSequences.slice(1), predictedEvent]; // Remove the first sequence and add the new predicted event
        return newInput;
      });

      setButtonText("Next");
    } catch (error) {
      console.error("Error during prediction:", error);
      setOutput((prevOutput) => [
        ...prevOutput,
        "An error occurred. Please check the console for details.",
      ]);
    }
  };

  const handleReset = () => {
    setModel("");
    setSequenceLength(1);
    setInputSequences([""]);
    setOutput([]);
    setButtonText("Predict");
  };

  const handleSequenceChange = (index: number, value: string) => {
    const newSequences = [...inputSequences];
    newSequences[index] = value;
    setInputSequences(newSequences);
  };

  const handleLengthChange = (value: number) => {
    setSequenceLength(value);
    const newSequences = Array(value).fill("");
    setInputSequences(newSequences);
  };

  return (
    <div
      style={{
        height: "100vh",
        display: "flex",
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        backgroundImage: "url('/h2.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        padding: "30px",
        gap: "30px",
      }}
    >
      <div
        style={{
          flex: 1,
          maxWidth: "600px",
          background: "#ffffff",
          padding: "40px",
          margin: "20px",
          borderRadius: "20px",
          boxShadow: "0 12px 24px rgba(0, 0, 0, 0.1)",
        }}
      >
        <h1
          style={{
            marginBottom: "20px",
            color: "#1a202c",
            textAlign: "center",
            fontSize: "2rem",
            fontWeight: "bold",
          }}
        >
          Prediction Form
        </h1>
        <form
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "16px",
          }}
          onSubmit={(e) => e.preventDefault()}
        >
          <label
            style={{
              fontSize: "0.9rem",
              fontWeight: "600",
              color: "#4a5568",
            }}
          >
            Select Model:
          </label>
          <select
            value={model}
            onChange={(e) => setModel(e.target.value)}
            style={{
              padding: "12px",
              fontSize: "1rem",
              borderRadius: "10px",
              border: "1px solid #e2e8f0",
              backgroundColor: "#f7fafc",
              width: "100%",
              outline: "none",
            }}
          >
            <option value="" disabled>
              Choose a model
            </option>
            <option value="rnn">RNN</option>
            <option value="lstm">LSTM</option>
          </select>

          <label
            style={{
              fontSize: "0.9rem",
              fontWeight: "600",
              color: "#4a5568",
            }}
          >
            Input Sequence Length:
          </label>
          <select
            value={sequenceLength}
            onChange={(e) => handleLengthChange(Number(e.target.value))}
            style={{
              padding: "12px",
              fontSize: "1rem",
              borderRadius: "10px",
              border: "1px solid #e2e8f0",
              backgroundColor: "#f7fafc",
              width: "100%",
              outline: "none",
            }}
          >
            <option value={1}>1</option>
            <option value={2}>2</option>
            <option value={3}>3</option>
          </select>

          <label
            style={{
              fontSize: "0.9rem",
              fontWeight: "600",
              color: "#4a5568",
            }}
          >
            Input Sequence:
          </label>
          {Array.from({ length: sequenceLength }, (_, i) => (
            <textarea
              key={i}
              value={inputSequences[i] || ""}
              onChange={(e) => handleSequenceChange(i, e.target.value)}
              placeholder={`Enter input sequence ${i + 1}`}
              style={{
                padding: "12px",
                fontSize: "1rem",
                borderRadius: "10px",
                border: "1px solid #e2e8f0",
                backgroundColor: "#f7fafc",
                height: "80px",
                resize: "none",
                outline: "none",
                marginBottom: "10px",
              }}
            />
          ))}

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              gap: "20%",
              marginTop: "20px",
            }}
          >
            <button
              type="button"
              onClick={handlePredict}
              style={{
                padding: "10px 16px",
                fontSize: "0.9rem",
                borderRadius: "8px",
                border: "none",
                cursor: "pointer",
                background: "linear-gradient(90deg, #6b46c1, #3182ce)",
                color: "white",
                fontWeight: "600",
                flex: 1,
                textAlign: "center",
                transition: "transform 0.3s, background 0.3s",
                boxShadow: "0 3px 8px rgba(0, 0, 0, 0.2)",
              }}
            >
              {buttonText}
            </button>
            <button
              type="button"
              onClick={handleReset}
              style={{
                padding: "10px 16px",
                fontSize: "0.9rem",
                borderRadius: "8px",
                border: "none",
                cursor: "pointer",
                background: "linear-gradient(90deg, #e53e3e, #d53f8c)",
                color: "white",
                fontWeight: "600",
                flex: 1,
                textAlign: "center",
                transition: "transform 0.3s, background 0.3s",
                boxShadow: "0 3px 8px rgba(0, 0, 0, 0.2)",
              }}
            >
              Reset
            </button>
          </div>
        </form>
      </div>

      {/* {output.length > 0 && (
        <div
          style={{
            flex: 1,
            maxWidth: "600px",
            background: "#ffffff",
            padding: "40px",
            borderRadius: "20px",
            boxShadow: "0 12px 24px rgba(0, 0, 0, 0.1)",
            display: "flex",
            flexDirection: "column",
            justifyContent: "flex-start",
            alignItems: "center",
            textAlign: "center",
          }}
        >
          <h2
            style={{
              fontSize: "1.5rem",
              fontWeight: "bold",
              color: "#2d3748",
              marginBottom: "10px",
            }}
          >
            Predicted Events:
          </h2>
          <div
            style={{
              fontSize: "1rem",
              color: "#4a5568",
              whiteSpace: "pre-wrap",
              wordWrap: "break-word",
              textAlign: "left",
              width: "100%",
            }}
          >
            {output.map((event, index) => (
              <p key={index}>{event}</p>
            ))}
          </div>
        </div>
      )} */}

      {output.length > 0 && (
        <div
          style={{
            flex: 1,
            maxWidth: "600px",
            background: "#ffffff",
            padding: "40px",
            borderRadius: "20px",
            boxShadow: "0 12px 24px rgba(0, 0, 0, 0.1)",
            display: "flex",
            flexDirection: "column",
            justifyContent: "flex-start",
            alignItems: "center",
            textAlign: "center",
          }}
        >
          <h2
            style={{
              fontSize: "1.5rem",
              fontWeight: "bold",
              color: "#2d3748",
              marginBottom: "10px",
            }}
          >
            Predicted Events:
          </h2>
          <div
            style={{
              fontSize: "1rem",
              color: "#4a5568",
              whiteSpace: "pre-wrap",
              wordWrap: "break-word",
              textAlign: "left",
              width: "100%",
            }}
          >
            {output.map((event, index) => (
              <div
                key={index}
                style={{
                  marginBottom: "8px", // Add spacing between items
                }}
              >
                <strong>{index + 1}.</strong> {event}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Predict;
