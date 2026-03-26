import { useState } from "react";
import { TextField, Button, Box, Typography, Paper } from "@mui/material";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

const LogInForm = ({ onLogin }) => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        try {
            const res = await api.post(`${API_URL}/api/auth/login`, { email, password });

            localStorage.setItem("token", res.data.token);
            onLogin(res.data.user);

        } catch (err) {
            console.error(err);
            setError("Credenciales inválidas");
        }
    };

    return (
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
            <Paper elevation={6} sx={{ p: 4, width: "100%", maxWidth: 400 }}>
                <Typography variant="h5" textAlign="center" gutterBottom>
                    Iniciar sesión
                </Typography>
                <form onSubmit={handleSubmit}>
                    <TextField
                        fullWidth
                        margin="normal"
                        label="Correo"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <TextField
                        fullWidth
                        margin="normal"
                        label="Contraseña"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    {error && (
                        <Typography color="error" variant="body2" textAlign="center">
                        {error}
                        </Typography>
                    )}
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        color="primary"
                        sx={{ mt: 2 }}
                    >
                        Entrar
                    </Button>
                </form>
            </Paper>
        </Box>
    );
}
export default LogInForm;