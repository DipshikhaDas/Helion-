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

      const response = await axios.post(
        "http://127.0.0.1:8000/predict/lstm/3",
        requestPayload
      );

      console.log("Response from backend:", response.data);

      const predictedEvent = response.data.predicted_event;

      setOutput((prevOutput) => [...prevOutput, predictedEvent]);

      setInputSequences((prevSequences) => {
        const newInput = [...prevSequences.slice(1), predictedEvent];
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

  const styles = {
    container: {
      height: "100vh",
      display: "flex",
      flexDirection: "row" as const,
      justifyContent: "center",
      alignItems: "center",
      backgroundImage: "url('/h2.jpg')",
      backgroundSize: "cover",
      backgroundPosition: "center",
      padding: "30px",
      gap: "30px",
    },
    formContainer: {
      flex: 1,
      maxWidth: "600px",
      background: "#ffffff",
      padding: "40px",
      margin: "20px",
      borderRadius: "20px",
      boxShadow: "0 12px 24px rgba(0, 0, 0, 0.1)",
    },
    formTitle: {
      marginBottom: "20px",
      color: "#1a202c",
      textAlign: "center" as const,
      fontSize: "2rem",
      fontWeight: "bold",
    },
    label: {
      fontSize: "0.9rem",
      fontWeight: 600,
      color: "#4a5568",
    },
    input: {
      padding: "12px",
      fontSize: "1rem",
      borderRadius: "10px",
      border: "1px solid #e2e8f0",
      backgroundColor: "#f7fafc",
      width: "100%",
      outline: "none",
      marginBottom: "10px",
    },
    buttonContainer: {
      display: "flex",
      justifyContent: "space-between",
      gap: "20%",
      marginTop: "20px",
    },
    button: {
      padding: "10px 16px",
      fontSize: "0.9rem",
      borderRadius: "8px",
      border: "none",
      cursor: "pointer",
      color: "white",
      fontWeight: 600,
      flex: 1,
      textAlign: "center" as const,
      transition: "transform 0.3s, background 0.3s",
      boxShadow: "0 3px 8px rgba(0, 0, 0, 0.2)",
    },
    predictButton: {
      background: "linear-gradient(90deg, #6b46c1, #3182ce)",
    },
    resetButton: {
      background: "linear-gradient(90deg, #e53e3e, #d53f8c)",
    },
    outputContainer: {
      flex: 1,
      maxWidth: "600px",
      background: "#ffffff",
      padding: "40px",
      borderRadius: "20px",
      boxShadow: "0 12px 24px rgba(0, 0, 0, 0.1)",
      display: "flex",
      flexDirection: "column" as const,
      justifyContent: "flex-start",
      alignItems: "center",
      textAlign: "center" as const,
    },
    outputTitle: {
      fontSize: "1.5rem",
      fontWeight: "bold",
      color: "#2d3748",
      marginBottom: "10px",
    },
    outputText: {
      fontSize: "1rem",
      color: "#4a5568",
      whiteSpace: "pre-wrap" as const,
      wordWrap: "break-word" as const,
      textAlign: "left" as const,
      width: "100%",
    },
    outputItem: {
      marginBottom: "8px",
    },
  };

  return (
    <div style={styles.container}>
      <div style={styles.formContainer}>
        <h1 style={styles.formTitle}>Prediction Form</h1>
        <form
          style={{ display: "flex", flexDirection: "column", gap: "16px" }}
          onSubmit={(e) => e.preventDefault()}
        >
          <label style={styles.label}>Select Model:</label>
          <select
            value={model}
            onChange={(e) => setModel(e.target.value)}
            style={styles.input}
          >
            <option value="" disabled>
              Choose a model
            </option>
            <option value="rnn">RNN</option>
            <option value="lstm">LSTM</option>
          </select>

          <label style={styles.label}>Input Sequence Length:</label>
          <select
            value={sequenceLength}
            onChange={(e) => handleLengthChange(Number(e.target.value))}
            style={styles.input}
          >
            <option value={1}>1</option>
            <option value={2}>2</option>
            <option value={3}>3</option>
          </select>

          <label style={styles.label}>Input Sequence:</label>
          {Array.from({ length: sequenceLength }, (_, i) => (
            <textarea
              key={i}
              value={inputSequences[i] || ""}
              onChange={(e) => handleSequenceChange(i, e.target.value)}
              placeholder={`Enter input sequence ${i + 1}`}
              style={{ ...styles.input, height: "80px", resize: "none" }}
            />
          ))}

          <div style={styles.buttonContainer}>
            <button
              type="button"
              onClick={handlePredict}
              style={{ ...styles.button, ...styles.predictButton }}
            >
              {buttonText}
            </button>
            <button
              type="button"
              onClick={handleReset}
              style={{ ...styles.button, ...styles.resetButton }}
            >
              Reset
            </button>
          </div>
        </form>
      </div>

      {output.length > 0 && (
        <div style={styles.outputContainer}>
          <h2 style={styles.outputTitle}>Predicted Events:</h2>
          <div style={styles.outputText}>
            {output.map((event, index) => (
              <div key={index} style={styles.outputItem}>
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
