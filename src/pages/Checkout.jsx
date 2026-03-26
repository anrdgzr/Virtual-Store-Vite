import { useEffect, useState } from "react";
import { Box, Button, Card, CardContent, TextField, Typography, RadioGroup, FormControlLabel, Radio, Divider, FormControl, FormLabel, Stack } from "@mui/material";
import axios from "axios";
import { 
    useCartStoreData, 
    useCartStoreClearCart,
    useCartStoreSetGenValue,
    useCartStoreGetTotal,
} from "../stores/useCartStore";
import { api } from "../network/api";
import MapDelivery from "../components/MapDelivery";
import { useNavigate } from "react-router-dom";
import { notify } from "../utils/notify";
import CustomTextField from "../components/CustomTextField";
import TextFieldCustom from "../components/TextFieldCustom";

const ADMIN_PHONE = import.meta.env.VITE_ADMIN_PHONE

const Checkout = () => {
    const cartData = useCartStoreData();
    const clearCart = useCartStoreClearCart();
    const setGenValue = useCartStoreSetGenValue();
    const [cliente, setCliente] = useState({
        nombre: "",
        telefono: "",
        direccion: "",
        email: "",
    });
    const [metodoPago, setMetodoPago] = useState("transferencia");
    const [tipoEnvio, setTipoEnvio] = useState('app');
    const [ubicacionCliente, setUbicacionCliente] = useState(null);
    const [loading, setLoading] = useState(false);
    const [ordenExitosa, setOrdenExitosa] = useState(null);

    const total = useCartStoreGetTotal();
    
    const navigate = useNavigate();

    const isFormIncomplete = !cliente.nombre || !cliente.telefono || !cliente.direccion || !cliente.email;
    const isLocationInvalid = (tipoEnvio === "personal" || tipoEnvio === "encuentro") && (!ubicacionCliente || !ubicacionCliente.dentroDelRango);
    const isInvalidPaymentForApp = tipoEnvio === "app" && metodoPago !== "transferencia";

    const isSubmitDisabled = loading || isFormIncomplete || isLocationInvalid || isInvalidPaymentForApp;

    useEffect(() => {
        const token = localStorage.getItem("token");
        
        if (token) {
            api.get("/api/user/profile")
                .then((res) => {
                    const { nombre, email } = res.data;                    

                    setCliente((prev) => ({
                        ...prev,
                        nombre: nombre || prev.nombre,
                        email: email || prev.email,
                    }));
                })
                .catch((err) => {
                    console.error("Error cargando datos del usuario para el checkout:", err);
                });
        }
    }, []);

    const handleChange = (e) => {
        setCliente({ ...cliente, [e.target.name]: e.target.value });
    };

    const handleSubmit = async () => {
        if (cartData.length === 0) {
            notify.error("Tu carrito está vacío")
            return;
        }
        try {
            setLoading(true);
            const response = await api.post("/api/orders/checkout", {
                cart: cartData.map((item) => ({
                    ...item
                })),
                metodoPago,
                datosCliente: cliente,
                tipoEnvio,
            });

            clearCart();
            notify.success("Compra realizada con éxito");

            const orderId = response.data.orden._id.slice(-6).toUpperCase();
            const adminPhone = ADMIN_PHONE;
            
            let wpText = `*¡Hola! Acabo de realizar el pedido #${orderId}*\n\n`;
            wpText += `*A nombre de:* ${cliente.nombre}\n`;
            wpText += `*Envío:* ${tipoEnvio} | *Pago:* ${metodoPago}\n\n`;
            wpText += `*Mis Productos:*\n`;
            
            cartData.forEach(item => {
                wpText += ` - ${item.nombre}\n`;
                item.sabores.forEach(s => {
                    wpText += `   -> ${s.cantidad}x ${s.nombre}\n`;
                });
            });

            wpText += `\n*Total:* $${response.data.orden.total.toFixed(2)} MXN\n`;
            wpText += `\n¿Me podrían confirmar la recepción?`;

            
            const encodedText = encodeURIComponent(wpText);
            const waLink = `https://wa.me/${adminPhone}?text=${encodedText}`;
            
            setOrdenExitosa({
                id: orderId,
                link: waLink
            });
            
        } catch (err) {
            console.error(err);
            notify.error("Error al procesar la compra");
        } finally {
            setLoading(false);
        }
    };

    if (ordenExitosa) {
        return (
            <Box sx={{ minHeight: "80vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", p: 3, textAlign: "center" }}>
                <Typography variant="h2" fontFamily="Caprasimo" color="#D6FF00" sx={{ textShadow: "2px 2px 0px #000", mb: 2 }}>
                    ¡PEDIDO CONFIRMADO!
                </Typography>
                
                <Typography variant="h6" fontWeight="bold" mb={4}>
                    Tu número de orden es: #{ordenExitosa.id}
                </Typography>
                
                <Typography color="text.secondary" mb={4} maxWidth="400px">
                    Te hemos enviado un recibo a tu correo. Para agilizar tu entrega, envíanos un mensaje por WhatsApp.
                </Typography>

                <Button 
                    variant="contained" 
                    href={ordenExitosa.link} 
                    target="_blank"
                    rel="noopener noreferrer"
                    sx={{ 
                        bgcolor: "#25D366",
                        color: "#fff", 
                        fontWeight: "900", 
                        fontSize: "1.2rem",
                        py: 2, 
                        px: 4,
                        border: "4px solid #000",
                        borderRadius: "12px",
                        boxShadow: "6px 6px 0px #000",
                        "&:hover": { bgcolor: "#1ebe57", transform: "translate(-2px, -2px)", boxShadow: "8px 8px 0px #000" }
                    }}
                >
                    CONFIRMAR POR WHATSAPP
                </Button>

                <Button 
                    onClick={() => navigate("/")}
                    sx={{ mt: 4, color: "#000", fontWeight: "bold", textDecoration: "underline" }}
                >
                    Volver a la tienda
                </Button>
            </Box>
        );
    }

    if (cartData.length === 0) {
        return (
            <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" minHeight="70vh" p={3}>
                <Box 
                    sx={{
                        bgcolor: "#fff",
                        border: "4px solid #000",
                        boxShadow: "12px 12px 0px #000",
                        borderRadius: "16px",
                        p: 5,
                        textAlign: "center",
                        maxWidth: "400px"
                    }}
                >
                    <Typography variant="h4" fontWeight="900" fontFamily="Caprasimo" mb={2}>
                        TU CARRITO ESTÁ VACÍO
                    </Typography>
                    <Typography variant="body1" fontWeight="bold" color="text.secondary" mb={4}>
                        Aún no has agregado nada. ¡Ve a buscar tus sabores favoritos!
                    </Typography>
                    <Button 
                        variant="contained" 
                        fullWidth
                        onClick={() => navigate("/cat")}
                        sx={{
                            bgcolor: "#D6FF00",
                            color: "#000",
                            fontWeight: 900,
                            border: "3px solid #000",
                            boxShadow: "4px 4px 0px #000",
                            py: 1.5,
                            "&:hover": {
                                bgcolor: "#c2e600",
                                transform: "translate(-2px, -2px)",
                                boxShadow: "6px 6px 0px #000",
                            }
                        }}
                    >
                        IR AL CATÁLOGO
                    </Button>
                </Box>
            </Box>
        );
    }

    return (
        <Box
            maxWidth="md"
            mx="auto"
            p={3}
            sx={{
                mt: 2,
                mb: 2,
                  mx: {
                    xs: 2,
                    md: "auto"
                },
                p: 3,
                maxWidth: "md",
                borderRadius: "12px",
                border: "3px solid #000",
                boxShadow: "6px 6px 0px #000",
                overflow: "visible",
                backgroundColor: "#fff",
                fontFamily: "'Inter', sans-serif",
                transition: "transform 0.2s ease",
                "&:hover": {
                    transform: "translate(-2px, -2px)",
                    boxShadow: "8px 8px 0px #000",
                }
            }}
        >
            <Typography
                variant="h4"
                mb={3}
                sx={{ fontWeight: 700, textAlign: "center", letterSpacing: "0.5px" }}
            >
                Finalizar Compra
            </Typography>

            <Card
                sx={{
                    mb: 4,
                    borderRadius: "12px",
                    border: "3px solid #000",
                    boxShadow: "6px 6px 0px #000",
                    overflow: "visible",
                    backgroundColor: "#fff",
                    transition: "transform 0.2s ease",
                    "&:hover": {
                        transform: "translate(-2px, -2px)",
                        boxShadow: "8px 8px 0px #000",
                    }
                }}
            >
                <CardContent>
                    <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                        Resumen del Carrito
                    </Typography>

                    {cartData.map((item, idx) => (
                        <Box
                            key={idx}
                            display="flex"
                            justifyContent="space-between"
                            alignItems="center"
                            py={1}
                            sx={{
                                borderBottom: idx !== cartData.length - 1 ? "3px dotted #000" : "none"
                            }}
                        >
                            <Typography sx={{ fontSize: "1rem", fontWeight: 500 }}>
                                {item.nombre}{" "}
                                <span style={{ opacity: 0.6 }}>(x {
                                    item.sabores?.reduce(
                                        (subTotal, sabor) => subTotal + Number(sabor.cantidad || 0), 0
                                    ) || 0})
                                </span>
                            </Typography>

                            <Typography sx={{ fontWeight: 600 }}>
                                ${(item?.subtotal).toFixed(2)}
                            </Typography>
                        </Box>
                    ))}

                    <Divider sx={{ my: 2 }} />

                    <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 2 }}>
                        <Typography
                            variant="h5"
                            sx={{
                                fontWeight: 900,
                                fontFamily: "Caprasimo",
                                bgcolor: "#D6FF00",
                                color: "#000",
                                px: 3,
                                py: 1,
                                borderRadius: "8px",
                                border: "2px solid #000",
                                boxShadow: "3px 3px 0px #000",
                                transform: "rotate(-2deg)",
                            }}
                        >
                            TOTAL: {total.toLocaleString("es-MX", {
                                style: "currency",
                                currency: "MXN"
                            })}
                        </Typography>
                    </Box>
                </CardContent>
            </Card>

            <Card
                sx={{
                    mb: 4,
                    borderRadius: "12px",
                    border: "3px solid #000",
                    boxShadow: "6px 6px 0px #000",
                    overflow: "visible",
                    backgroundColor: "#fff",
                    transition: "transform 0.2s ease",
                    "&:hover": {
                        transform: "translate(-2px, -2px)",
                        boxShadow: "8px 8px 0px #000",
                    }
                }}
            >
                <CardContent>
                    <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                    Datos del Cliente
                    </Typography>
                
                    <TextFieldCustom
                        label="Nombre Completo"
                        name="nombre"
                        type="text"
                        value={cliente.nombre}
                        onChange={handleChange}
                        required
                        sx={{ mb: 2 }}
                    />
                    <TextFieldCustom
                        label="Teléfono"
                        name="telefono"
                        type="phone"
                        value={cliente.telefono}
                        onChange={handleChange}
                        required
                        sx={{ mb: 2 }}
                    />
                    <TextFieldCustom
                        label="Dirección"
                        name="direccion"
                        type="text"
                        value={cliente.direccion}
                        onChange={handleChange}
                        required
                        sx={{ mb: 2 }}
                    />
                    <TextFieldCustom
                        label="Correo electrónico"
                        name="email"
                        type="email"
                        value={cliente.email}
                        onChange={handleChange}
                        required
                    />
                </CardContent>
            </Card>

            <Card
                sx={{
                    mb: 4,
                    borderRadius: "12px",
                    border: "3px solid #000",
                    boxShadow: "6px 6px 0px #000",
                    overflow: "visible",
                    backgroundColor: "#fff",
                    transition: "transform 0.2s ease",
                    "&:hover": {
                        transform: "translate(-2px, -2px)",
                        boxShadow: "8px 8px 0px #000",
                    }
                }}
            >
                <CardContent>
                    <Typography variant="h6" sx={{ fontWeight: 900, fontFamily: "Caprasimo", mb: 3 }}>
                        Método de Pago
                    </Typography>
                    <Stack spacing={2}>
                        <Box
                            onClick={() => setMetodoPago("transferencia")}
                            sx={{
                                p: 2,
                                border: "3px solid #000",
                                borderRadius: "8px",
                                cursor: "pointer",
                                transition: "all 0.1s ease",
                                bgcolor: metodoPago === "transferencia" ? "#00E5FF" : "#fff",
                                boxShadow: metodoPago === "transferencia" ? "none" : "6px 6px 0px #000",
                                transform: metodoPago === "transferencia" ? "translate(6px, 6px)" : "none",
                            }}
                        >
                            <Typography fontWeight="900" fontSize="1.1rem">Transferencia bancaria</Typography>
                        </Box>

                        <Box
                            onClick={() => setMetodoPago("entrega")}
                            sx={{
                                p: 2,
                                border: "3px solid #000",
                                borderRadius: "8px",
                                cursor: "pointer",
                                transition: "all 0.1s ease",
                                bgcolor: metodoPago === "entrega" ? "#00E5FF" : "#fff",
                                boxShadow: metodoPago === "entrega" ? "none" : "6px 6px 0px #000",
                                transform: metodoPago === "entrega" ? "translate(6px, 6px)" : "none",
                            }}
                        >
                            <Typography fontWeight="900" fontSize="1.1rem">Pago contra entrega</Typography>
                        </Box>
                    </Stack>
                </CardContent>
            </Card>

            <Card
                sx={{
                    mb: 4,
                    borderRadius: "12px",
                    border: "3px solid #000",
                    boxShadow: "6px 6px 0px #000",
                    overflow: "visible",
                    backgroundColor: "#fff",
                    transition: "transform 0.2s ease",
                    "&:hover": {
                        transform: "translate(-2px, -2px)",
                        boxShadow: "8px 8px 0px #000",
                    }
                }}
            >
                <CardContent>
                    <Typography variant="h6" sx={{ fontWeight: 900, fontFamily: "Caprasimo", mb: 3 }}>
                        Método de Envío
                    </Typography>

                    <Stack spacing={2}>
                        {metodoPago != "entrega" && (
                            <Box
                                onClick={() => setTipoEnvio("app")}
                                sx={{
                                    p: 2,
                                    border: "3px solid #000",
                                    borderRadius: "8px",
                                    cursor: "pointer",
                                    transition: "all 0.1s ease",
                                    bgcolor: tipoEnvio === "app" ? "#00E5FF" : "#fff",
                                    boxShadow: tipoEnvio === "app" ? "none" : "6px 6px 0px #000",
                                    transform: tipoEnvio === "app" ? "translate(6px, 6px)" : "none",
                                }}
                            >
                                <Typography fontWeight="900" fontSize="1.1rem">App de Envío</Typography>
                            </Box>
                        )}

                        <Box
                            onClick={() => setTipoEnvio("personal")}
                            sx={{
                                p: 2,
                                border: "3px solid #000",
                                borderRadius: "8px",
                                cursor: "pointer",
                                transition: "all 0.1s ease",
                                bgcolor: tipoEnvio === "personal" ? "#00E5FF" : "#fff",
                                boxShadow: tipoEnvio === "personal" ? "none" : "6px 6px 0px #000",
                                transform: tipoEnvio === "personal" ? "translate(6px, 6px)" : "none",
                            }}
                        >
                            <Typography fontWeight="900" fontSize="1.1rem">Entrega Personal (1–2 días)</Typography>
                        </Box>

                        <Box
                            onClick={() => setTipoEnvio("encuentro")}
                            sx={{
                                p: 2,
                                border: "3px solid #000",
                                borderRadius: "8px",
                                cursor: "pointer",
                                transition: "all 0.1s ease",
                                bgcolor: tipoEnvio === "encuentro" ? "#00E5FF" : "#fff",
                                boxShadow: tipoEnvio === "encuentro" ? "none" : "6px 6px 0px #000",
                                transform: tipoEnvio === "encuentro" ? "translate(6px, 6px)" : "none",
                            }}
                        >
                            <Typography fontWeight="900" fontSize="1.1rem">Recoger en Punto de Encuentro</Typography>
                        </Box>
                    </Stack>
                </CardContent>
            </Card>

            {(tipoEnvio === "personal" || tipoEnvio === "encuentro") && (
                <Card
                    sx={{
                        mb: 4,
                        borderRadius: "12px",
                        border: "3px solid #000",
                        boxShadow: "6px 6px 0px #000",
                        overflow: "visible",
                        backgroundColor: "#fff",
                        transition: "transform 0.2s ease",
                        "&:hover": {
                            transform: "translate(-2px, -2px)",
                            boxShadow: "8px 8px 0px #000",
                        }
                    }}
                >
                    <CardContent>
                        <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                            Selecciona tu ubicación
                        </Typography>

                        <Typography variant="body2" sx={{ mb: 2, color: "text.secondary" }}>
                            Marca tu ubicación exacta para confirmar que está dentro del rango de entrega.
                        </Typography>
                        <Box 
                            sx={{ 
                                border: "4px solid #000",
                                borderRadius: "8px", 
                                overflow: "hidden",
                                boxShadow: "4px 4px 0px #000",
                                my: 3 
                            }}
                        >
                            <MapDelivery onLocationSelect={(coords) => setUbicacionCliente(coords)} />
                        </Box>

                        {ubicacionCliente && !ubicacionCliente.dentroDelRango && (
                            <Typography color="error" sx={{ mt: 1 }}>
                                Tu ubicación está fuera del rango de entrega (3 km), favor de ingresar un método de envío o ubicación distinta.
                            </Typography>
                        )}

                        {ubicacionCliente && ubicacionCliente.dentroDelRango && (
                            <Typography color="success.main" sx={{ mt: 1 }}>
                                Ubicación válida dentro del área de entrega
                            </Typography>
                        )}
                    </CardContent>
                </Card>
            )}
            <Stack direction={{ xs: "column", sm: "row" }} spacing={2} mt={4}>
                <Button
                    variant="outlined"
                    fullWidth
                    size="large"
                    onClick={() => navigate("/cat")}
                    sx={{
                        py: 2,
                        borderRadius: "8px",
                        fontSize: "1.1rem",
                        fontWeight: 900,
                        color: "#000",
                        border: "3px solid #000",
                        "&:hover": { 
                            bgcolor: "#f4f5f7", 
                            border: "3px solid #000",
                            transform: "translate(-2px, -2px)",
                            boxShadow: "4px 4px 0px #000"
                        }
                    }}
                >
                    SEGUIR COMPRANDO
                </Button>

                <Button
                    variant="contained"
                    fullWidth
                    size="large"
                    disabled={isSubmitDisabled}
                    onClick={handleSubmit}
                    sx={{
                        py: 2,
                        borderRadius: "8px",
                        fontSize: "1.2rem",
                        fontWeight: 900,
                        fontFamily: "Caprasimo",
                        letterSpacing: "1px",
                        bgcolor: isSubmitDisabled ? "#ccc" : "#FF3366", 
                        color: isSubmitDisabled ? "#666" : "#fff",
                        border: "3px solid #000",
                        boxShadow: isSubmitDisabled ? "none" : "6px 6px 0px #000",
                        textTransform: "uppercase",
                        transition: "all 0.2s ease",
                        "&:hover": {
                            bgcolor: isSubmitDisabled ? "#ccc" : "#ff1a53",
                            transform: isSubmitDisabled ? "none" : "translate(-2px, -2px)",
                            boxShadow: isSubmitDisabled ? "none" : "8px 8px 0px #000",
                        }
                    }}
                >
                    {loading ? "PROCESANDO..." : "CONFIRMAR COMPRA"}
                </Button>
            </Stack>
            {isFormIncomplete && (
                <Typography color="error" fontWeight="bold" textAlign="center" mt={2}>
                    * Por favor llena todos tus datos para continuar.
                </Typography>
            )}
        </Box>
    );

}
export default Checkout;