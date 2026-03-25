import {
  Grid,
  Box,
  Typography,
  Slider,
  Stack,
  Drawer,
  Button,
  Chip,
  Autocomplete,
  TextField,
} from "@mui/material";
import { useEffect, useState } from "react";
import { api } from "../network/api";
import Cards from "../components/Cards";
import WhaFab from "../components/WhaFab";
import FilterListIcon from "@mui/icons-material/FilterList";
import { notify } from "../utils/notify";

const Catalogo = () => {
    const [productos, setProductos] = useState([]);
    const [marca, setMarca] = useState("");
    const [saboresFiltrados, setSaboresFiltrados] = useState([]);
    const initialPrecio = [0, 2000];
    const [precio, setPrecio] = useState(initialPrecio);
    const [brands, setBrands] = useState([]);
    const [favorites, setFavorites] = useState([]);
    const token = localStorage.getItem("token");

    const isPriceChanged =
        precio[0] !== initialPrecio[0] || precio[1] !== initialPrecio[1];

    const marcasDisponibles = [...new Set(productos.map((p) => p.marca))];
    const saboresDisponibles = [
        ...new Set(
            productos?.flatMap((prod) =>
            prod.sabores
                ?.filter((p) => p.cantidad > 0)
                .map((p) => p.nombre)
            )
        )
    ];

    const [mobileOpen, setMobileOpen] = useState(false);

    const brandColorMap = brands.reduce((acc, brand) => {
        acc[brand.marca] = brand.color || "#000000";
        return acc;
    }, {});

    const fetchBrands = async () => {
        try {
            const res = await api.get("/api/brands");
            setBrands(res.data);
        } catch (e) {
            console.error("Error fetching brands", e);
        }
    };

    const fetchProducts = async () => {
        const res = await api.get("/api/products")
        console.log("RES:" , res);
        setProductos(res.data);
    };

    useEffect(() => {
        fetchProducts();
        fetchBrands();

        if (token) {
            api.get("/api/user/profile", {
                headers: { Authorization: `Bearer ${token}` }
            })
            .then(res => {
                const favoriteIds = res.data.favorites.map(fav => fav._id);
                setFavorites(favoriteIds);
            })
            .catch(err => console.error("Error fetching favorites", err));
        }
    }, [token]);

    const toggleDrawer = () => {
        setMobileOpen(!mobileOpen);
    };

    const resetFilters = () => {
        setMarca("");
        setSaboresFiltrados([]);
        setPrecio([0, 2000]);
    }

    const productosFiltrados = productos.filter((p) => {
        const matchMarca = !marca || p.marca === marca;
        const matchSabor = 
            saboresFiltrados.length === 0 ||
            p.sabores.some((saborObj) => saboresFiltrados.includes(saborObj.nombre));
        return matchMarca && matchSabor;
    });

    const marcasFiltradas = [...new Set(productosFiltrados.map((p) => p.marca))];

    const SidebarContent = (
        <Box sx={{ width: { xs: "75vw", sm: "100%" }, p: 3 }}>
            <Typography variant="h5" fontFamily="Caprasimo" mb={3}>
                Filtros
            </Typography>

            <Typography variant="subtitle2" color="text.secondary" fontWeight="bold" textTransform="uppercase" mb={1}>
                Marca
            </Typography>
            <Stack direction="row" flexWrap="wrap" gap={1} mb={4}>
                <Chip 
                    label="Todas" 
                    onClick={() => setMarca("")} 
                    color={marca === "" ? "primary" : "default"}
                    variant={marca === "" ? "filled" : "outlined"}
                    sx={{ fontWeight: "bold", borderRadius: "8px" }}
                />
                {marcasDisponibles.map((m) => (
                    <Chip 
                        key={m} 
                        label={m} 
                        onClick={() => setMarca(m)} 
                        color={marca === m ? "primary" : "default"}
                        variant={marca === m ? "filled" : "outlined"}
                        sx={{ fontWeight: "bold", borderRadius: "8px" }}
                    />
                ))}
            </Stack>

            {/* <Typography variant="subtitle2" color="text.secondary" fontWeight="bold" textTransform="uppercase" mb={1}>
                Sabor
            </Typography>
            <Stack direction="row" flexWrap="wrap" gap={1} mb={4}>
                <Chip 
                    label="Todos" 
                    onClick={() => setSabor("")} 
                    color={sabor === "" ? "secondary" : "default"}
                    variant={sabor === "" ? "filled" : "outlined"}
                    sx={{ fontWeight: "bold", borderRadius: "8px" }}
                />
                {saboresDisponibles.map((s) => (
                    <Chip 
                        key={s} 
                        label={s} 
                        onClick={() => setSabor(s)} 
                        color={sabor === s ? "secondary" : "default"}
                        variant={sabor === s ? "filled" : "outlined"}
                        sx={{ fontWeight: "bold", borderRadius: "8px" }}
                    />
                ))}
            </Stack> */}

            <Box sx={{ mb: 4 }}>
                <Typography variant="subtitle2" color="text.secondary" fontWeight="bold" textTransform="uppercase" mb={1}>
                    Sabor
                </Typography>

                {/* 1. The Active Chips Display (Rendered OUTSIDE the text input) */}
                <Stack direction="row" flexWrap="wrap" gap={1} mb={2}>
                    {saboresFiltrados.length > 0 ? (
                        saboresFiltrados.map((s) => (
                            <Chip 
                                key={s}
                                label={s} 
                                onDelete={() => setSaboresFiltrados(saboresFiltrados.filter(item => item !== s))} 
                                color="secondary"
                                sx={{ 
                                    fontWeight: "bold", 
                                    borderRadius: "8px",
                                    border: "2px solid #000",
                                    boxShadow: "2px 2px 0px #000",
                                    "&:hover": { transform: "translate(-1px, -1px)", boxShadow: "3px 3px 0px #000" }
                                }}
                            />
                        ))
                    ) : (
                        <Chip 
                            label="Todos los sabores" 
                            color="default"
                            variant="outlined"
                            sx={{ fontWeight: "bold", borderRadius: "8px", border: "2px solid #000" }}
                        />
                    )}
                </Stack>

                <Autocomplete
                    multiple
                    options={saboresDisponibles.filter(s => !saboresFiltrados.includes(s))}
                    value={saboresFiltrados}
                    onChange={(event, newValue) => {
                        setSaboresFiltrados(newValue);
                    }}
                    renderTags={() => null}
                    renderInput={(params) => (
                        <TextField 
                            {...params} 
                            placeholder="Buscar o agregar sabor..." 
                            variant="outlined"
                            sx={{
                                "& .MuiOutlinedInput-root": {
                                    borderRadius: "8px",
                                    border: "2px solid #000",
                                    boxShadow: "4px 4px 0px #000",
                                    fontWeight: "bold",
                                    backgroundColor: "#fff",
                                    transition: "all 0.2s ease",
                                    width: "75%",
                                    "&:hover": {
                                        transform: "translate(-2px, -2px)",
                                        boxShadow: "6px 6px 0px #000",
                                    },
                                    "& fieldset": { border: "none" }
                                }
                            }}
                        />
                    )}
                />
            </Box>

            <Box sx={{ mb: 2, width: "75%" }}>
                <Typography variant="subtitle2" color="text.secondary" fontWeight="bold" textTransform="uppercase" mb={2}>
                    Rango de Precio
                </Typography>
                <Slider
                    value={precio}
                    onChange={(e, newValue) => setPrecio(newValue)}
                    valueLabelDisplay="auto"
                    min={0}
                    max={2000}
                    sx={{ color: "#000" }}
                />
                <Stack direction="row" justifyContent="space-between">
                    <Typography variant="body2" fontWeight="bold" sx={{ color: "#000" }}>${precio[0]}</Typography>
                    <Typography variant="body2" fontWeight="bold" sx={{ color: "#000" }}>${precio[1]}</Typography>
                </Stack>
            </Box>

            <Button 
                variant="contained" 
                onClick={resetFilters}
                sx={{ 
                    width: "75%",
                    mt: 2, 
                    bgcolor: "#000", 
                    color: "#fff", 
                    borderRadius: "8px", 
                    py: 1.5, 
                    fontWeight: "bold", 
                    '&:hover': { 
                        bgcolor: "#333" 
                    } 
                }}
            >
                Limpiar Filtros
            </Button>
        </Box>
    );

    const activeChips = [
        marca && {
            label: `Marca: ${marca}`,
            color: "#C2A61D",
            onDelete: () => setMarca(null)
        },
        saboresFiltrados?.length > 0 && {
            label: `Sabor: ${saboresFiltrados}`,
            color: "#B0D0FF",
            onDelete: () => setSaboresFiltrados([])
        },
        isPriceChanged && {
            label: `Precio: $${precio[0]} - $${precio[1]}`,
            color: "#ED5528",
            onDelete: () => setPrecio(initialPrecio)
        }
    ].filter(Boolean);

    const handleToggleFavorite = async (e, productId) => {
        e.stopPropagation();
        e.stopPropagation();
        
        try {
            const res = await api.post("/api/user/favorites", 
                { productId }, 
                { headers: { Authorization: `Bearer ${token}` } }
            );
            
            setFavorites(res.data.favorites);

            const isNowFavorited = res.data.favorites.includes(productId);
            if (isNowFavorited) {
                notify.success("¡Agregado a tus favoritos!");
            } else {
                notify.warning("Removido de tus favoritos...");
            }
        } catch (error) {
            console.error("Error toggling favorite", error);
            notify.error("Error al actualizar favoritos");
        }
    };

    return (
        <Box 
            sx={{ 
                display: "flex", 
                mt: 1,
                minHeight: "100vh",
                bgcolor: "#f4f5f7"
            }}
        >
        {/* FILTROS */}
            {/* Tablets & Laptops */}
            <Box
                sx={{
                    display: { xs: "none", sm: "block" },
                    width: "280px",
                    minWidth: "280px",
                    maxWidth: "280px",
                    flexShrink: 0,
                    backgroundColor: "white",
                    boxSizing: "border-box",
                    borderRight: "3px solid #000",
                }}
            >
                {SidebarContent}
            </Box>

            {/* Celulares */}
            <Drawer anchor="left" open={mobileOpen} onClose={toggleDrawer}>
                {SidebarContent}
            </Drawer>

        {/* PRODUCTOS */}
            <Box 
                sx={{ 
                    flexGrow: 1,
                    p: { xs: 2, sm: 3 } ,
                    ml: {xs: 0, sm: 2}
                }}
            >
                {/* Botón filtro móvil */}
                <Stack justifyContent={"space-between"} direction={"row"} sx={{ display: { xs: "flex", sm: "none" }, mb: 2, width:"100%" }}>
                    <Stack spacing={1} direction="row" flexWrap="wrap" alignContent={"center"}>
                        {activeChips.map((chip, index) => (
                            <Chip
                                key={index}
                                label={chip.label}
                                onDelete={chip.onDelete}
                                size="small"
                                variant="contained"
                                sx={{ mr: 1, mb: 1, backgroundColor: chip.color, color: "#fff" }}
                            />
                        ))}
                    </Stack>
                    <Box sx={{ display: { xs: "flex", sm: "none" }, justifyContent: "flex-end"}}>
                        <Button
                            variant="outlined"
                            startIcon={<FilterListIcon />}
                            onClick={toggleDrawer}
                        >
                            Filtros
                        </Button>
                    </Box>
                </Stack>

                {/* Productos */}
                {marcasFiltradas.map((m) => {
                    const productosDeMarca = productosFiltrados.filter((p) => p.marca === m);
                    const dynamicColor = brandColorMap[m] || "#000000";
                    return (
                        <Box key={m} sx={{ mb: 5 }}>
                            <Typography
                                variant="h4"
                                gutterBottom
                                fontFamily="Caprasimo"
                                sx={{ 
                                    textTransform: "capitalize",
                                    color: dynamicColor,
                                    textShadow: dynamicColor !== "#000000" ? "2px 2px 0px #000" : "none",
                                    letterSpacing: "1px"
                                }}
                            >
                                {m}
                            </Typography>
                            <Grid container spacing={3} justifyContent="center">
                                <Cards 
                                    productos={productosDeMarca} 
                                    token={token}
                                    favorites={favorites}
                                    handleToggleFavorite={handleToggleFavorite}
                                />
                            </Grid>
                        </Box>
                    );
                })}
                <WhaFab />
            </Box>
        </Box>
    );
};

export default Catalogo;
