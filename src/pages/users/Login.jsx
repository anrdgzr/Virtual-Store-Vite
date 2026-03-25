import { useState } from "react";
import { TextField, Button, Box, Typography, Paper, Divider, Stack } from "@mui/material";
import { api } from "../../network/api";
import { Link, useNavigate } from "react-router-dom";
import { notify } from "../../utils/notify";
import { GoogleLogin } from "@react-oauth/google";
import.meta.env.VITE_API_URL;

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);    
    const navigate = useNavigate();

    console.log("params: ", { email, password });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const res = await api.post("/api/auth/login", { email, password });
            console.log("RES LOGIN: ", res);
            localStorage.setItem("token", res.data.token);
            localStorage.setItem("role", JSON.stringify(res.data.role));
            notify.success("¡Bienvenido de vuelta!");

            if (res.data.role === "admin") {
                window.location.href = "/admin/dashboard";
            } else {
                window.location.href = "/cat";
            }
        } catch (err) {
            console.error(err);
            notify.error("Credenciales Inválidas")
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleSuccess = async (credentialResponse) => {
        try {
            const res = await api.post("/api/auth/google", { 
                token: credentialResponse.credential 
            });

            localStorage.setItem("token", res.data.token);
            localStorage.setItem("role", JSON.stringify(res.data.role));

            notify.success("¡Sesión iniciada con Google!");
            window.location.href = "/cat";
        } catch (error) {
            console.error(error);
            notify.error("Error al iniciar con Google");
        }
    };

    const brutalistInput = {
        "& .MuiOutlinedInput-root": {
            borderRadius: "8px",
            border: "2px solid #000",
            backgroundColor: "#fff",
            "& fieldset": { border: "none" },
            "&.Mui-focused": { boxShadow: "4px 4px 0px #000", transform: "translate(-2px, -2px)" },
            transition: "all 0.2s"
        }
    };

    return (
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh" p={2}>
            <Box 
                sx={{ 
                    p: { xs: 3, sm: 5 }, 
                    width: "100%", 
                    maxWidth: 420, 
                    bgcolor: "#f4f5f7",
                    border: "4px solid #000",
                    borderRadius: "16px",
                    boxShadow: "10px 10px 0px #000"
                }}
            >
                <Typography variant="h3" fontFamily="Caprasimo" textAlign="center" mb={1} sx={{ textTransform: "uppercase" }}>
                    Entrar
                </Typography>
                <Typography variant="body1" textAlign="center" color="text.secondary" fontWeight="bold" mb={2}>
                    Ingresa para guardar tu carrito y ver tus pedidos.
                </Typography>

                <Box sx={{ display: "flex", justifyContent: "center" }}>
                    <GoogleLogin
                        onSuccess={handleGoogleSuccess}
                        onError={() => notify.error("El inicio de sesión de Google falló")}
                        theme="outline"
                        size="large"
                        shape="pill"
                        text="continue_with"
                        width="100%"
                    />
                </Box>

                <Divider sx={{ my: 1.5, "&::before, &::after": { borderTop: "2px solid #000" } }}>
                    <Typography fontWeight="900" color="text.secondary">O CON CORREO</Typography>
                </Divider>

                <form onSubmit={handleSubmit}>
                    <Stack spacing={2}>
                        <TextField
                            fullWidth
                            label="Correo electrónico"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            sx={brutalistInput}
                            required
                        />
                        <TextField
                            fullWidth
                            label="Contraseña"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            sx={brutalistInput}
                            required
                        />
                        
                        <Button
                            type="submit"
                            fullWidth
                            disabled={loading}
                            sx={{
                                bgcolor: "#D6FF00",
                                color: "#000",
                                fontSize: "1.1rem",
                                fontWeight: "900",
                                border: "3px solid #000",
                                borderRadius: "8px",
                                boxShadow: "4px 4px 0px #000",
                                "&:hover": {
                                    bgcolor: "#c2e600",
                                    transform: "translate(-2px, -2px)",
                                    boxShadow: "6px 6px 0px #000"
                                }
                            }}
                        >
                            {loading ? "CARGANDO..." : "INICIAR SESIÓN"}
                        </Button>
                    </Stack>
                </form>

                <Typography textAlign="center" mt={3} fontWeight="bold">
                    ¿No tienes cuenta? 
                    <Box 
                        component="span" 
                        onClick={() => navigate("/register")}
                        sx={{ 
                            color: "#FF3366", 
                            cursor: "pointer", 
                            "&:hover": {
                                textDecoration: "underline"
                            } 
                        }}
                    >
                        {" Regístrate aquí"}
                    </Box>
                </Typography>

            </Box>
        </Box>
    );
}

export default Login;