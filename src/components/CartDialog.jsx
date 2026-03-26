import { 
    Box, 
    Button, 
    Card, 
    Chip, 
    Dialog, 
    DialogActions, 
    DialogContent, 
    DialogTitle, 
    Divider, 
    IconButton, 
    List, 
    ListItem, 
    ListItemText, 
    Stack, 
    TextField, 
    Typography } from "@mui/material";
import { 
    useCartStoreData, 
    useCartStoreClearCart,
    useCartStoreRemoveFromCart,
    useCartStoreUpdateQuantity,
    useCartStoreSetGenValue,
    useCartStoreOpen,
    useCartStoreGetTotal
} from "../stores/useCartStore";
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import { useNavigate } from "react-router-dom";
import { useTheme, useMediaQuery } from "@mui/material";

const CartDialog = () => {
    const cartData = useCartStoreData();
    const clearCart = useCartStoreClearCart();
    const removeFromCart = useCartStoreRemoveFromCart();
    const updateQuantityCart = useCartStoreUpdateQuantity();
    const open = useCartStoreOpen();
    const setGenValue = useCartStoreSetGenValue();
    const total = useCartStoreGetTotal();

    const navigate = useNavigate();

    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

    const handleClose = () => {
        setGenValue("open", false);
    };

    const handleCheckout = () => {
        setGenValue("open", false);
        navigate("/checkout");
    };

    return (
        <Dialog
            open={open}
            onClose={handleClose}
            fullWidth
            maxWidth="sm"
            PaperProps={{
                sx: {
                    borderRadius: 3,
                    p: 1
                }
            }}
        >
            <DialogTitle
                sx={{
                    fontWeight: "bold",
                    textAlign: "center",
                    pb: 1,
                    fontSize: "1.3rem"
                }}
            >
                Carrito de Compras
            </DialogTitle>

            <DialogContent dividers sx={{ px: 2 }}>
                {cartData.length === 0 ? (
                    <Typography
                        variant="body1"
                        sx={{ textAlign: "center", mt: 3, opacity: 0.7 }}
                    >
                        Tu carrito está vacío
                    </Typography>
                ) : (
                    <>
                        <List disablePadding>
                            {cartData.map((item) => (
                                <Card
                                    key={item.id}
                                    variant="outlined"
                                    sx={{
                                        mb: 2,
                                        borderRadius: 2,
                                        p: 1.5,
                                        boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
                                    }}
                                >
                                    <Stack
                                        // direction={isMobile ? "column" : "row"}
                                        direction={"row"}
                                        spacing={2}
                                        alignItems={isMobile ? "flex-start" : "center"}
                                    >
                                        {/* Imagen */}
                                        <Box
                                            component="img"
                                            src={item.imagenes?.[0] || "/placeholder.png"}
                                            alt={item.nombre}
                                            onError={(e) => (e.target.src = "/placeholder.png")}
                                            sx={{
                                                width: 70,
                                                height: 70,
                                                objectFit: "cover",
                                                borderRadius: 2,
                                                boxShadow: "0 1px 2px rgba(0,0,0,0.15)",
                                            }}
                                        />

                                        {/* Info */}
                                        <Box sx={{ flex: 1, width: "100%" }}>
                                            <Typography fontWeight={600}>
                                                {item.nombre}
                                            </Typography>

                                            <Typography variant="body2" sx={{ opacity: 0.7 }}>
                                                Precio unitario: ${item.precioUnitario?.toFixed(2) || 0}
                                            </Typography>

                                        {/* Sabores */}
                                            {item.sabores?.length > 0 && (
                                                <Stack
                                                    direction="row"
                                                    spacing={1}
                                                    mt={0.8}
                                                    flexWrap="wrap"
                                                >
                                                    {item.sabores
                                                        .filter((s) => s.cantidad > 0)
                                                        .map((sabor, idx) => (
                                                            <Chip
                                                                key={idx}
                                                                label={`${sabor.nombre} × ${sabor.cantidad}`}
                                                                size="small"
                                                                variant="outlined"
                                                                sx={{ fontSize: "8.5pt" }}
                                                            />
                                                    ))}
                                                </Stack>
                                            )}

                                            {/* Subtotal */}
                                            <Typography
                                                variant="body2"
                                                fontWeight={600}
                                                sx={{ mt: 1 }}
                                            >
                                                Subtotal: ${item?.subtotal?.toFixed(2)}
                                            </Typography>
                                        </Box>

                                        {/* Eliminar */}
                                        <IconButton
                                            color="error"
                                            onClick={() => removeFromCart(item.id)}
                                            sx={{ alignSelf: "center" }}
                                        >
                                            <DeleteForeverIcon />
                                        </IconButton>
                                    </Stack>
                                </Card>
                            ))}

                        </List>

                        <Divider sx={{ my: 2 }} />

                        <Typography
                            variant="h6"
                            sx={{ textAlign: "right", fontWeight: "bold" }}
                        >
                            Total: ${total.toFixed(2)}
                        </Typography>
                    </>
                )}
            </DialogContent>

            <DialogActions sx={{ justifyContent: "space-between", px: 3 }}>
                <Button
                    variant="outlined"
                    color="error"
                    onClick={clearCart}
                    disabled={cartData.length === 0}
                >
                    Vaciar carrito
                </Button>

                <Button
                    variant="contained"
                    // color="primary"
                    onClick={handleCheckout}
                    disabled={cartData.length === 0}
                    sx={{backgroundColor: "#ADEBB3", color: "#454545"}}
                >
                    Continuar
                </Button>
            </DialogActions>
        </Dialog>
    );
};
export default CartDialog;