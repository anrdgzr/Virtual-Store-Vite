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
        const matchPrecio = p.precio >= precio[0] && p.precio <= precio[1];
        return matchMarca && matchSabor && matchPrecio;
    });

    const marcasFiltradas = [...new Set(productosFiltrados.map((p) => p.marca))];

    const SidebarContent = (
        <Box sx={{ width: "100%", p: 3, boxSizing: "border-box" }}>
            <Typography variant="h5" fontFamily="Caprasimo" mb={3} textTransform="uppercase">
                Filtros
            </Typography>

            <Typography variant="subtitle2" color="text.secondary" fontWeight="900" textTransform="uppercase" mb={1}>
                Marca
            </Typography>
            <Stack direction="row" flexWrap="wrap" gap={1} mb={4}>
                <Chip 
                    label="Todas" 
                    onClick={() => setMarca("")} 
                    sx={{ 
                        fontWeight: "900", borderRadius: "8px", border: "2px solid #000",
                        bgcolor: marca === "" ? "#D6FF00" : "#fff",
                        boxShadow: marca === "" ? "4px 4px 0px #000" : "none",
                        "&:hover": { bgcolor: "#D6FF00" }
                    }}
                />
                {marcasDisponibles.map((m) => (
                    <Chip 
                        key={m} 
                        label={m} 
                        onClick={() => setMarca(m)} 
                        sx={{ 
                            fontWeight: "900", borderRadius: "8px", border: "2px solid #000",
                            bgcolor: marca === m ? "#00E5FF" : "#fff",
                            boxShadow: marca === m ? "4px 4px 0px #000" : "none",
                            "&:hover": { bgcolor: "#00E5FF" }
                        }}
                    />
                ))}
            </Stack>

            <Box sx={{ mb: 4 }}>
                <Typography variant="subtitle2" color="text.secondary" fontWeight="900" textTransform="uppercase" mb={1}>
                    Sabor
                </Typography>

                <Stack direction="row" flexWrap="wrap" gap={1} mb={2}>
                    {saboresFiltrados.length > 0 ? (
                        saboresFiltrados.map((s) => (
                            <Chip 
                                key={s}
                                label={s} 
                                onDelete={() => setSaboresFiltrados(saboresFiltrados.filter(item => item !== s))} 
                                sx={{ 
                                    fontWeight: "900", borderRadius: "8px", border: "2px solid #000",
                                    bgcolor: "#FF3366", color: "#fff", boxShadow: "4px 4px 0px #000",
                                    "& .MuiChip-deleteIcon": { color: "#fff" }
                                }}
                            />
                        ))
                    ) : (
                        <Chip 
                            label="Todos los sabores" 
                            sx={{ fontWeight: "900", borderRadius: "8px", border: "2px solid #000", bgcolor: "#fff" }}
                        />
                    )}
                </Stack>

                <Autocomplete
                    multiple
                    options={saboresDisponibles.filter(s => !saboresFiltrados.includes(s))}
                    value={saboresFiltrados}
                    onChange={(event, newValue) => setSaboresFiltrados(newValue)}
                    renderTags={() => null}
                    renderInput={(params) => (
                        <TextField 
                            {...params} 
                            placeholder="Buscar sabor..." 
                            variant="outlined"
                            sx={{
                                // Changed width to 100%
                                width: "100%",
                                "& .MuiOutlinedInput-root": {
                                    borderRadius: "8px", border: "3px solid #000",
                                    boxShadow: "4px 4px 0px #000", fontWeight: "900",
                                    backgroundColor: "#fff", transition: "all 0.2s ease",
                                    "&:hover": { transform: "translate(-2px, -2px)", boxShadow: "6px 6px 0px #000" },
                                    "& fieldset": { border: "none" }
                                }
                            }}
                        />
                    )}
                />
            </Box>

            <Box sx={{ mb: 4, width: "100%" }}>
                <Typography variant="subtitle2" color="text.secondary" fontWeight="900" textTransform="uppercase" mb={2}>
                    Rango de Precio
                </Typography>
                <Slider
                    value={precio}
                    onChange={(e, newValue) => setPrecio(newValue)}
                    valueLabelDisplay="auto"
                    min={0}
                    max={2000}
                    sx={{ 
                        color: "#000",
                        "& .MuiSlider-thumb": { border: "3px solid #000", bgcolor: "#D6FF00", width: 24, height: 24 },
                        "& .MuiSlider-track": { border: "2px solid #000", bgcolor: "#000" },
                        "& .MuiSlider-rail": { border: "2px solid #000", bgcolor: "#fff" }
                    }}
                />
                <Stack direction="row" justifyContent="space-between">
                    <Typography variant="h6" fontWeight="900" fontFamily="Caprasimo">${precio[0]}</Typography>
                    <Typography variant="h6" fontWeight="900" fontFamily="Caprasimo">${precio[1]}</Typography>
                </Stack>
            </Box>

            <Button 
                fullWidth 
                onClick={resetFilters}
                sx={{ 
                    bgcolor: "#000", color: "#fff", borderRadius: "8px", border: "3px solid #000",
                    py: 1.5, fontWeight: "900", fontSize: "1.1rem", transition: "all 0.2s",
                    '&:hover': { bgcolor: "#FF3366", transform: "translate(-2px, -2px)", boxShadow: "4px 4px 0px #000" } 
                }}
            >
                LIMPIAR FILTROS
            </Button>
        </Box>
    );

    const activeChips = [
        marca && {
            label: `Marca: ${marca}`,
            color: "#D6FF00",
            onDelete: () => setMarca(null)
        },
        saboresFiltrados?.length > 0 && {
            label: `Sabor: ${saboresFiltrados}`,
            color: "#00E5FF",
            onDelete: () => setSaboresFiltrados([])
        },
        isPriceChanged && {
            label: `Precio: $${precio[0]} - $${precio[1]}`,
            color: "#FF3366",
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

            <Drawer 
                anchor="left" 
                open={mobileOpen} 
                onClose={toggleDrawer} sx={{
                    "& .MuiDrawer-paper": { 
                        width: "300px", 
                        borderRight: "4px solid #000" 
                    }
                }}
            >
                {SidebarContent}
            </Drawer>

            <Box 
                sx={{ 
                    flexGrow: 1,
                    p: { xs: 2, sm: 3 } ,
                    ml: {xs: 0, sm: 2}
                }}
            >
                <Stack justifyContent={"space-between"} direction={"row"} sx={{ display: { xs: "flex", sm: "none" }, mb: 2, width:"100%" }}>
                    <Stack direction="row" flexWrap="wrap" alignItems="center">
                        {activeChips.map((chip, index) => (
                            <Chip
                                key={index}
                                label={chip.label}
                                onDelete={chip.onDelete}
                                sx={{ 
                                    mr: 2, 
                                    mb: 2, 
                                    backgroundColor: chip.color, 
                                    color: "#000",
                                    fontWeight: "900",
                                    fontSize: "0.85rem",
                                    border: "3px solid #000",
                                    borderRadius: "8px",
                                    boxShadow: "4px 4px 0px #000",
                                    "& .MuiChip-deleteIcon": {
                                        color: "rgba(0,0,0,0.6)",
                                        transition: "color 0.2s",
                                        "&:hover": { color: "#000" }
                                    }
                                }}
                            />
                        ))}
                    </Stack>
                    <Box sx={{ display: { xs: "flex", sm: "none" }, justifyContent: "flex-end", width: "100%", mb: 2 }}>
                        <Button
                            startIcon={<FilterListIcon />}
                            onClick={toggleDrawer}
                            sx={{
                                bgcolor: "#D6FF00", color: "#000", fontWeight: "900",
                                border: "3px solid #000", borderRadius: "8px",
                                boxShadow: "4px 4px 0px #000",
                                "&:hover": { bgcolor: "#c2e600" }
                            }}
                        >
                            FILTROS
                        </Button>
                    </Box>
                </Stack>

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
