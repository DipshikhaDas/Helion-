import React, { useState, useEffect, useRef } from "react";
import {
  Box,
  TextField,
  Button,
  Typography,
  Card,
  CardContent,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  SelectChangeEvent,
} from "@mui/material";
import Image from "next/image";
import axios from "axios";

const SignInForm = () => {
  const [selectedOption, setSelectedOption] = useState<string>("");
  const [sequenceLength, setSequenceLength] = useState<string>("");
  const [isSequenceLengthDisabled, setIsSequenceLengthDisabled] =
    useState<boolean>(false);
  const [sequenceFields, setSequenceFields] = useState<string[]>([]);
  const [cards, setCards] = useState<
    Array<{ title: string; description: string }>
  >([]);

  const scrollableRef = useRef<HTMLDivElement>(null);

  const handleOptionChange = (event: SelectChangeEvent<string>) => {
    const value = event.target.value;
    setSelectedOption(value);

    if (value === "rnn3" || value === "lstm3") {
      setSequenceLength("3");
      setIsSequenceLengthDisabled(true);
    } else {
      setSequenceLength("");
      setIsSequenceLengthDisabled(false);
    }
  };

  const handleSequenceLengthChange = (event: SelectChangeEvent<string>) => {
    setSequenceLength(event.target.value);
  };

  useEffect(() => {
    const length = parseInt(sequenceLength, 10);
    if (!isNaN(length)) {
      setSequenceFields(Array.from({ length }, () => ""));
    }
  }, [sequenceLength]);

  const handleFieldChange = (index: number, value: string) => {
    const updatedFields = [...sequenceFields];
    updatedFields[index] = value;
    setSequenceFields(updatedFields);
  };

  const apiEndpoints: Record<string, string> = {
    rnn3: "/predict/rnn/3",
    rnn4: "/predict/rnn/4",
    rnn5: "/predict/rnn/5",
    rnnN: "/predict/rnn/n",
    lstm3: "/predict/lstm/3",
    lstm4: "/predict/lstm/4",
    lstm5: "/predict/lstm/5",
    lstmN: "/predict/lstm/n",
    lstmAll5to15: "/predict/all/5-15",
    lstmAll5to15_2layers: "/predict/all/2layers/5-15",
    lstmAll3to20: "/predict/all/3-20",
  };

  const handlePredictNext = async () => {
    if (!selectedOption) {
      alert("Please select a model option.");
      return;
    }

    if (sequenceFields.some((field) => !field.trim())) {
      alert("All sequence fields must be filled!");
      return;
    }

    const endpoint = apiEndpoints[selectedOption];
    if (!endpoint) {
      alert("Invalid model selection.");
      return;
    }

    try {
      // Hit the API
      const response = await axios.post(
        `http://localhost:8000${endpoint}`, // Replace with your backend URL
        { input_sequence: sequenceFields }
      );

      const predictedEvent = response.data.predicted_event;

      // Add the prediction as a card
      const newCard = {
        title: `Prediction ${cards.length + 1}`,
        description: predictedEvent,
      };
      setCards((prevCards) => [...prevCards, newCard]);

      // Update the input sequence for the next prediction
      const updatedSequence = [...sequenceFields.slice(1), predictedEvent];
      setSequenceFields(updatedSequence);

      // Scroll to the bottom after adding a new card
      setTimeout(() => {
        if (scrollableRef.current) {
          scrollableRef.current.scrollTop = scrollableRef.current.scrollHeight;
        }
      }, 100);
    } catch (error) {
      console.error("Error during prediction:", error);
      alert("Prediction failed. Please check the backend or input data.");
    }
  };

  const handleReset = () => {
    setSelectedOption("");
    setSequenceLength("");
    setIsSequenceLengthDisabled(false);
    setSequenceFields([]);
    setCards([]);
  };

  return (
    <Box display="flex" height="100vh" bgcolor="#f9f9f9">
      <Box
        width="55%"
        padding="32px"
        display="flex"
        justifyContent="center"
        alignItems="center"
      >
        <Box
          width="480px"
          padding="32px"
          borderRadius="12px"
          boxShadow="0 4px 20px rgba(0, 0, 0, 0.1)"
          bgcolor="white"
          textAlign="center"
          overflow="hidden"
        >
          <Box
            display="flex"
            alignItems="center"
            justifyContent="center"
            mb={4}
          >
            <Image src="/logo2.png" alt="Logo" width={40} height={40} />
            <Typography
              variant="h6"
              fontWeight="bold"
              ml={1}
              color="primary.main"
            >
              Helion++
            </Typography>
          </Box>
          <Typography variant="h6" fontWeight="bold" mb={2} textAlign="left">
            Start Predicting Events
          </Typography>

          <Box maxHeight="60vh" overflow="auto">
            <form>
              <FormControl
                fullWidth
                margin="normal"
                variant="outlined"
                required
              >
                <InputLabel id="dropdown-label">Select an Option</InputLabel>
                <Select
                  labelId="dropdown-label"
                  value={selectedOption}
                  onChange={handleOptionChange}
                  label="Select an Option"
                >
                  <MenuItem value="rnn3">RNN 3 Sequence Model</MenuItem>
                  <MenuItem value="rnn4">RNN 4 Sequence Model</MenuItem>
                  <MenuItem value="rnn5">RNN 5 Sequence Model</MenuItem>
                  <MenuItem value="rnnN">RNN N Sequence Model</MenuItem>
                  <MenuItem value="lstm3">LSTM 3 Sequence Model</MenuItem>
                  <MenuItem value="lstm4">LSTM 4 Sequence Model</MenuItem>
                  <MenuItem value="lstm5">LSTM 5 Sequence Model</MenuItem>
                  <MenuItem value="lstmN">LSTM N Sequence Model</MenuItem>
                  <MenuItem value="lstmAll5to15">
                    LSTM All 5-15 Sequence Model
                  </MenuItem>
                  <MenuItem value="lstmAll5to15_2layers">
                    LSTM 5-15 Using 2 layers Sequence Model
                  </MenuItem>
                  <MenuItem value="lstmAll3to20">
                    LSTM 3-20 Sequence Model
                  </MenuItem>
                </Select>
              </FormControl>

              <FormControl
                fullWidth
                margin="normal"
                variant="outlined"
                required
              >
                <InputLabel id="sequence-length-label">
                  Input Sequence Length
                </InputLabel>
                <Select
                  labelId="sequence-length-label"
                  value={sequenceLength}
                  onChange={handleSequenceLengthChange}
                  label="Input Sequence Length"
                  disabled={isSequenceLengthDisabled}
                >
                  <MenuItem value="3">3</MenuItem>
                  <MenuItem value="4">4</MenuItem>
                  <MenuItem value="5">5</MenuItem>
                </Select>
              </FormControl>

              {sequenceFields.map((value, index) => (
                <TextField
                  key={index}
                  fullWidth
                  margin="normal"
                  label={`Input Sequence ${index + 1}`}
                  variant="outlined"
                  value={value}
                  onChange={(e) => handleFieldChange(index, e.target.value)}
                />
              ))}

              <Box
                display="flex"
                justifyContent="space-between"
                sx={{ marginTop: "16px" }}
              >
                <Button
                  type="button"
                  variant="contained"
                  color="primary"
                  sx={{ padding: "10px", fontWeight: "bold", width: "48%" }}
                  onClick={handlePredictNext}
                >
                  Predict Next
                </Button>
                <Button
                  type="button"
                  variant="outlined"
                  color="primary"
                  sx={{ padding: "10px", fontWeight: "bold", width: "48%" }}
                  onClick={handleReset}
                >
                  Reset
                </Button>
              </Box>
            </form>
          </Box>
        </Box>
      </Box>

      <Box
        width="45%"
        position="relative"
        display="flex"
        justifyContent="center"
        alignItems="center"
      >
        <Box
          position="absolute"
          top={0}
          left={0}
          width="100%"
          height="100%"
          zIndex={0}
        >
          <Image
            src="/f1.jpg"
            alt="Right Section Background"
            layout="fill"
            objectFit="cover"
          />
        </Box>
        <Box
          position="absolute"
          top={0}
          left={0}
          width="100%"
          height="100%"
          bgcolor="rgba(255, 255, 255, 0.6)"
          zIndex={1}
        />

        <Box
          display="flex"
          flexWrap="wrap"
          position="relative"
          zIndex={2}
          padding="16px"
          width="80%"
          height="80vh"
          overflow="auto"
          gap="16px"
          ref={scrollableRef}
        >
          {cards.map((card, index) => (
            <Card
              key={index}
              sx={{
                width: "100%",
                marginBottom: "16px",
                boxShadow: "0 4px 10px rgba(0, 0, 0, 0.2)",
                backgroundColor: "#fff",
                maxHeight: "30%",
                overflow: "visible",
              }}
            >
              <CardContent
                sx={{
                  maxHeight: "none",
                  overflowY: "visible",
                }}
              >
                <Typography variant="h6" fontWeight="bold" gutterBottom>
                  {card.title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {card.description}
                </Typography>
              </CardContent>
            </Card>
          ))}
        </Box>
      </Box>
    </Box>
  );
};

export default SignInForm;
