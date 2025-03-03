import React, { useState, useEffect } from "react";
import { Box, Typography, Paper } from "@mui/material";

const CountdownTimer = ({ saleEndTime }) => {
  const calculateTimeLeft = (saleEndTime) => {
    const endDate = new Date(saleEndTime);
    const currentDate = new Date();

    if (isNaN(endDate)) {
      console.error("Invalid saleEndTime date:", saleEndTime);
      return { days: 0, hours: 0, minutes: 0, seconds: 0 };
    }

    const difference = endDate - currentDate;

    if (difference > 0) {
      return {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / (1000 * 60)) % 60),
        seconds: Math.floor((difference / 1000) % 60),
      };
    }
    return { days: 3, hours: 12, minutes: 12, seconds: 9};
  };

  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft(saleEndTime));

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft(saleEndTime));
    }, 1000);

    // Cleanup the interval on component unmount
    return () => clearInterval(timer);
  }, [saleEndTime]);

  return (
    <Box className="flex flex-col items-center my-8 p-6 bg-gray-100 dark:bg-gray-900 rounded-lg shadow-lg">
      <Typography variant="h5" className="text-red-600 font-bold">
        Flash Sale Ends In:
      </Typography>
      <Box className="flex space-x-4 mt-4">
        {Object.entries(timeLeft).map(([unit, value]) => (
          <Paper
            key={unit}
            className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow-md text-center w-20"
            elevation={3}
          >
            <Typography variant="h6" className="font-bold text-blue-600">
              {value}
            </Typography>
            <Typography variant="body2" className="text-gray-500 uppercase">
              {unit}
            </Typography>
          </Paper>
        ))}
      </Box>
    </Box>
  );
};

export default CountdownTimer;
