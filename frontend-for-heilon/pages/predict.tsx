import React, { useState } from "react";

const Predict: React.FC = () => {
  const [model, setModel] = useState<string>("");
  const [inputSequence, setInputSequence] = useState<string>("");
  const [output, setOutput] = useState<string | null>(null);
  const [buttonText, setButtonText] = useState<string>("Predict"); // Button text state

  const handlePredict = () => {
    const randomValue = `Predicted Value: ${Math.random()
      .toString(36)
      .substring(7)}`; // Generate a random string

    if (buttonText === "Predict") {
      // First click logic
      setOutput(randomValue);
      setButtonText("Next");
    } else {
      // Subsequent clicks append to the output
      setOutput((prevOutput) => `${prevOutput}\n${randomValue}`);
    }
  };

  const handleReset = () => {
    setModel("");
    setInputSequence("");
    setOutput(null); // Clear the output field
    setButtonText("Predict"); // Reset the button text
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
        gap: "30px", // Space between the left and right boxes
      }}
    >
      {/* Left Box: Form */}
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
          {/* Model Selection */}
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

          {/* Input Sequence */}
          <label
            style={{
              fontSize: "0.9rem",
              fontWeight: "600",
              color: "#4a5568",
            }}
          >
            Input Sequence:
          </label>
          <textarea
            value={inputSequence}
            onChange={(e) => setInputSequence(e.target.value)}
            placeholder="Enter your input sequence"
            style={{
              padding: "12px",
              fontSize: "1rem",
              borderRadius: "10px",
              border: "1px solid #e2e8f0",
              backgroundColor: "#f7fafc",
              height: "120px",
              resize: "none",
              outline: "none",
            }}
          />

          {/* Buttons */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              gap: "20%",
              marginTop: "20px",
              margin: "10%",
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
              onMouseOver={(e) => {
                e.currentTarget.style.background =
                  "linear-gradient(90deg, #553c9a, #2b6cb0)";
                e.currentTarget.style.transform = "scale(1.03)";
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.background =
                  "linear-gradient(90deg, #6b46c1, #3182ce)";
                e.currentTarget.style.transform = "scale(1)";
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
              onMouseOver={(e) => {
                e.currentTarget.style.background =
                  "linear-gradient(90deg, #c53030, #b83280)";
                e.currentTarget.style.transform = "scale(1.03)";
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.background =
                  "linear-gradient(90deg, #e53e3e, #d53f8c)";
                e.currentTarget.style.transform = "scale(1)";
              }}
            >
              Reset
            </button>
          </div>
        </form>
      </div>

      {/* Right Box: Output (conditionally rendered) */}
      {output && (
        <div
          style={{
            flex: 1,
            maxWidth: "600px",
            background: "#ffffff",
            padding: "40px",
            borderRadius: "20px",
            boxShadow: "0 12px 24px rgba(0, 0, 0, 0.1)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            textAlign: "center",
          }}
        >
          <div>
            <h2
              style={{
                fontSize: "1.5rem",
                fontWeight: "bold",
                color: "#2d3748",
                marginBottom: "10px",
              }}
            >
              Output:
            </h2>
            <pre
              style={{
                fontSize: "1rem",
                color: "#4a5568",
                whiteSpace: "pre-wrap",
                wordWrap: "break-word",
              }}
            >
              {output}
            </pre>
          </div>
        </div>
      )}
    </div>
  );
};

export default Predict;
