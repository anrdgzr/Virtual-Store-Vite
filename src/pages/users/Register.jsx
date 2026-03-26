import { useState } from "react";
import { TextField, Button, Box, Typography, Stack, Divider } from "@mui/material";
import { GoogleLogin } from '@react-oauth/google';
import { api } from "../../network/api";
import { useNavigate, Link } from "react-router-dom";
import { notify } from "../../utils/notify";
import TextFieldCustom from "../../components/TextFieldCustom";

const Register = () => {
    const [nombre, setNombre] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            notify.warning("Las contraseñas no coinciden");
            return;
        }

        if (password.length < 6) {
            notify.warning("La contraseña debe tener al menos 6 caracteres");
            return;
        }

        setLoading(true);

        try {
            const res = await api.post("/api/auth/register", { 
                nombre, 
                email, 
                password 
            });
            
            localStorage.setItem("token", res.data.token);
            localStorage.setItem("role", JSON.stringify(res.data.role));

            notify.success("¡Cuenta creada con éxito! Bienvenido a Gault Vapes.");
            window.location.href = "/cat";
            
        } catch (err) {
            console.error(err);
            const errorMsg = err.response?.data?.message || "Error al crear la cuenta";
            notify.error(errorMsg);
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

            notify.success("¡Cuenta vinculada con Google exitosamente!");
            window.location.href = "/cat"; 
        } catch (error) {
            console.error(error);
            notify.error("Error al registrar con Google");
        }
    };

    return (
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh" p={2}>            
            <Box 
                sx={{ 
                    p: { xs: 3, sm: 5 }, 
                    width: "100%", 
                    maxWidth: 450, 
                    bgcolor: "#f4f5f7",
                    border: "4px solid #000",
                    borderRadius: "16px",
                    boxShadow: "10px 10px 0px #000"
                }}
            >
                <Typography variant="h3" fontFamily="Caprasimo" textAlign="center" mb={1} sx={{ textTransform: "uppercase", color: "#20de07", fontWeight: "bold" }}>
                    ÚNETE
                </Typography>
                <Typography variant="body1" textAlign="center" color="text.secondary" fontWeight="bold" mb={2}>
                    ¡Crea tu cuenta para una mejor experiencia!
                </Typography>

                <Box sx={{ display: "flex", justifyContent: "center" }}>
                    <GoogleLogin
                        onSuccess={handleGoogleSuccess}
                        onError={() => notify.error("El registro con Google falló")}
                        theme="outline"
                        size="large"
                        shape="pill"
                        text="signup_with"
                        width="100%"
                    />
                </Box>

                <Divider sx={{ my: 1.5, "&::before, &::after": { borderTop: "2px solid #000" } }}>
                    <Typography fontWeight="900" color="text.secondary">O CON CORREO</Typography>
                </Divider>

                <form onSubmit={handleSubmit}>
                    <Stack spacing={2}>

                        <TextFieldCustom
                            label="Nombre Completo"
                            type="text"
                            value={nombre}
                            onChange={(e) => setNombre(e.target.value)}
                            required
                        />
                        <TextFieldCustom
                            label="Correo electrónico"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />

                        <TextFieldCustom
                            label="Contraseña"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />

                        <TextFieldCustom
                            label="Confirmar Contraseña"
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                        />

                        <Button
                            type="submit"
                            fullWidth
                            disabled={loading}
                            sx={{
                                py: 1.5,
                                bgcolor: "#00E5FF",
                                color: "#000",
                                fontSize: "1.1rem",
                                fontWeight: "900",
                                border: "3px solid #000",
                                borderRadius: "8px",
                                boxShadow: "4px 4px 0px #000",
                                "&:hover": {
                                    bgcolor: "#00cce6",
                                    transform: "translate(-2px, -2px)",
                                    boxShadow: "6px 6px 0px #000"
                                }
                            }}
                        >
                            {loading ? "CREANDO CUENTA..." : "CREAR CUENTA"}
                        </Button>
                    </Stack>
                </form>

                <Typography textAlign="center" mt={3} fontWeight="bold" color="text.secondary">
                    ¿Ya tienes cuenta?{' '}
                    <Box 
                        component="span" 
                        onClick={() => navigate("/login")}
                        sx={{ 
                            color: "#FF3366", 
                            cursor: "pointer", 
                            "&:hover": {
                                textDecoration: "underline"
                            } 
                        }}
                    >
                    {" Inicia sesión aquí"}
                </Box>
                </Typography>

            </Box>
        </Box>
    );
};

export default Register;