import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

const PredictionForm = () => {
  const [model, setModel] = useState("");
  const [sequenceLength, setSequenceLength] = useState("1");
  const [inputSequences, setInputSequences] = useState([""]);
  const [output, setOutput] = useState([]);
  const [buttonText, setButtonText] = useState("Predict");
  const [error, setError] = useState("");

  const handlePredict = async () => {
    try {
      setError("");
      const requestPayload = {
        input_sequence: inputSequences,
      };

      const response = await fetch("http://127.0.0.1:8000/predict/lstm", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestPayload),
      });

      if (!response.ok) {
        throw new Error("Prediction request failed");
      }

      const data = await response.json();
      const predictedEvent = data.predicted_event;

      setOutput((prevOutput) => [...prevOutput, predictedEvent]);
      setInputSequences((prevSequences) => [...prevSequences.slice(1), predictedEvent]);
      setButtonText("Next");
    } catch (error) {
      setError("An error occurred during prediction. Please try again.");
      console.error("Error:", error);
    }
  };

  const handleReset = () => {
    setModel("");
    setSequenceLength("1");
    setInputSequences([""]);
    setOutput([]);
    setButtonText("Predict");
    setError("");
  };

  const handleSequenceChange = (index, value) => {
    const newSequences = [...inputSequences];
    newSequences[index] = value;
    setInputSequences(newSequences);
  };

  const handleLengthChange = (value) => {
    setSequenceLength(value);
    setInputSequences(Array(parseInt(value)).fill(""));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 p-8 flex flex-col md:flex-row items-start justify-center gap-8">
      <Card className="w-full md:w-[600px]">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">Prediction Form</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label>Select Model</Label>
            <Select value={model} onValueChange={setModel}>
              <SelectTrigger>
                <SelectValue placeholder="Choose a model" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="rnn">RNN</SelectItem>
                <SelectItem value="lstm">LSTM</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Input Sequence Length</Label>
            <Select value={sequenceLength} onValueChange={handleLengthChange}>
              <SelectTrigger>
                <SelectValue placeholder="Select length" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">1</SelectItem>
                <SelectItem value="2">2</SelectItem>
                <SelectItem value="3">3</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Input Sequence</Label>
            {Array.from({ length: parseInt(sequenceLength) }, (_, i) => (
              <Textarea
                key={i}
                value={inputSequences[i] || ""}
                onChange={(e) => handleSequenceChange(i, e.target.value)}
                placeholder={`Enter input sequence ${i + 1}`}
                className="min-h-[100px] resize-none"
              />
            ))}
          </div>

          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="flex gap-4">
            <Button
              className="flex-1 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 transition-all duration-300"
              onClick={handlePredict}
            >
              {buttonText}
            </Button>
            <Button
              variant="destructive"
              className="flex-1 bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700"
              onClick={handleReset}
            >
              Reset
            </Button>
          </div>
        </CardContent>
      </Card>

      {output.length > 0 && (
        <Card className="w-full md:w-[600px]">
          <CardHeader>
            <CardTitle className="text-2xl font-bold">Predicted Events</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {output.map((event, index) => (
                <div
                  key={index}
                  className="p-4 rounded-lg bg-gradient-to-r from-purple-50 to-blue-50 border border-gray-200"
                >
                  <span className="font-semibold text-purple-700">#{index + 1}:</span>{" "}
                  <span className="text-gray-700">{event}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default PredictionForm;