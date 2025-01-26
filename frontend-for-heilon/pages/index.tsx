import { useRouter } from "next/router";
import React from "react";

const Home = () => {
  const router = useRouter();

  return (
    <div
      style={{
        height: "100vh",
        position: "relative",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
        backgroundImage: "url('/h2.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* White translucent overlay */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: "rgba(255, 255, 255, 0.5)", // Adjust transparency here
          zIndex: 1,
        }}
      ></div>
      {/* Content */}
      <div
        style={{
          position: "relative",
          zIndex: 2,
          textAlign: "center",
        }}
      >
        {/* Title */}
        <h1
          style={{
            color: "#333",
            fontSize: "4rem",
            fontWeight: "bold",
            textShadow: "2px 2px 5px rgba(0, 0, 0, 0.3)", // Subtle shadow
            marginBottom: "20px",
          }}
        >
          Welcome to Helion
        </h1>

        {/* Cool Button */}
        <button
          style={{
            padding: "15px 30px",
            fontSize: "1.5rem",
            borderRadius: "50px",
            border: "none",
            cursor: "pointer",
            background: "linear-gradient(90deg, #0070f3, #00d8ff)", // Gradient background
            color: "white",
            fontWeight: "600",
            boxShadow: "0 4px 10px rgba(0, 0, 0, 0.2)", // Button shadow
            transition: "transform 0.2s, box-shadow 0.2s", // Hover effects
          }}
          onMouseOver={(e) => {
            e.target.style.transform = "scale(1.1)";
            e.target.style.boxShadow = "0 6px 15px rgba(0, 0, 0, 0.3)";
          }}
          onMouseOut={(e) => {
            e.target.style.transform = "scale(1)";
            e.target.style.boxShadow = "0 4px 10px rgba(0, 0, 0, 0.2)";
          }}
          onClick={() => router.push('/predict')}
        >
          Start Predicting Events
        </button>
      </div>
    </div>
  );
};

export default Home;
