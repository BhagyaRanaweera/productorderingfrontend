import React from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useNavigate } from "react-router-dom";
import ApiService from "../../service/ApiService";
import { TextField, Button, Container, Typography, Box, Alert } from "@mui/material";
import emailjs from "emailjs-com"; // Import EmailJS SDK
emailjs.init("nyCX8WqLZauvzgNH0");
const schema = yup.object().shape({
  email: yup.string().email("Invalid email").required("Email is required"),
  name: yup.string().min(3, "Name must be at least 3 characters").required("Name is required"),
  phoneNumber: yup
    .string()
    .matches(/^\d{10}$/, "Phone number must be 10 digits")
    .required("Phone number is required"),
  password: yup.string().min(6, "Password must be at least 6 characters").required("Password is required"),
});

const RegisterPage = () => {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: yupResolver(schema) });

  const [message, setMessage] = React.useState(null);

  // Function to send a confirmation email
  const sendConfirmationEmail = (email, name) => {
    const templateParams = {
      to_email: email, // User's email
      name: name,      // User's name
      subject: "Registration Successful",
      message: `Hello ${name},\n\nThank you for registering on our platform! We're excited to have you on board.\n\nBest regards,\nModishMart Team`,
    };

    emailjs
      .send(
        "service_19azhx8", // Replace with your EmailJS service ID
        "template_wz0eomn", // Replace with your EmailJS template ID
        templateParams,
        
      )
      .then(
        (response) => {
          console.log("Email sent successfully:", response);
        },
        (error) => {
          console.error("Failed to send email:", error);
        }
      );
  };

  const onSubmit = async (data) => {
    try {
      const response = await ApiService.registerUser(data);
      if (response.status === 200) {
        setMessage({ type: "success", text: "User Successfully Registered" });

        // Send the confirmation email after successful registration
        sendConfirmationEmail(data.email, data.name);

        setTimeout(() => navigate("/login"), 3000);
      }
    } catch (error) {
      setMessage({
        type: "error",
        text: error.response?.data.message || "Unable to register a user",
      });
    }
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 5, p: 3, boxShadow: 3, borderRadius: 2, bgcolor: "white" }}>
        <Typography variant="h4" align="center" gutterBottom>
          Create an Account
        </Typography>
        {message && <Alert severity={message.type}>{message.text}</Alert>}
        <form onSubmit={handleSubmit(onSubmit)}>
          <TextField
            label="Email"
            fullWidth
            margin="normal"
            {...register("email")}
            error={!!errors.email}
            helperText={errors.email?.message}
          />
          <TextField
            label="Name"
            fullWidth
            margin="normal"
            {...register("name")}
            error={!!errors.name}
            helperText={errors.name?.message}
          />
          <TextField
            label="Phone Number"
            fullWidth
            margin="normal"
            {...register("phoneNumber")}
            error={!!errors.phoneNumber}
            helperText={errors.phoneNumber?.message}
          />
          <TextField
            label="Password"
            type="password"
            fullWidth
            margin="normal"
            {...register("password")}
            error={!!errors.password}
            helperText={errors.password?.message}
          />
          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            sx={{ mt: 2 }}
          >
            Register
          </Button>
        </form>
        <Typography variant="body2" align="center" sx={{ mt: 2 }}>
          Already have an account? <a href="/login">Login</a>
        </Typography>
      </Box>
    </Container>
  );
};

export default RegisterPage;
