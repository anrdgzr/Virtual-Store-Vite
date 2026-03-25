import { AppBar, Toolbar, Typography, Button, IconButton, Drawer, List, ListItem, ListItemText, Box, Badge } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { useState } from "react";
import { Link } from "react-router-dom";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import LogoutIcon from '@mui/icons-material/Logout';
import PersonIcon from '@mui/icons-material/Person';
import { 
    useCartStoreGetTotal, 
    useCartStoreOpen, 
    useCartStoreSetGenValue, 
    useCartStoreSetOpen,
    useCartStoreGetItemCount
} from "../stores/useCartStore";

const Navbar = () => {
    const [openMenu, setOpenMenu] = useState(false);
    const setCartOpen = useCartStoreSetOpen();
    const cartItemCount = useCartStoreGetItemCount();

    const token = localStorage.getItem("token");
    const role = JSON.parse(localStorage.getItem("role"));

    const baseMenu = [
        { text: "Inicio", path: "/" },
        { text: "Catálogo", path: "/cat" },
    ];

    const userMenu = [
        ...baseMenu,
        { text: "Mi Perfil", path: "/profile" },
        { text: "Logout", path: "/" }
    ];

    const guestMenu = [
        ...baseMenu,
        { text: "Iniciar Sesión", path: "/login" }
    ];

    const menuItemsAdmin = [
        ...baseMenu,
        { text: "Mi Perfil", path: "/profile" },
        { text: "Administrar", path: "/admin/panel" },
        { text: "Dashboard", path: "/admin/dashboard" },
        { text: "Logout", path: "/" }
    ];

    let activeMenu = guestMenu;
    if (token) {
        activeMenu = role === "admin" ? menuItemsAdmin : userMenu;
    }

    const desktopMenu = activeMenu.filter(item => item.text !== "Logout" && item.text !== "Iniciar Sesión");

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("role")
        window.location.reload();
    };

    const iconButtonStyle = {
        color: "#000",
        border: "2px solid #000",
        borderRadius: "8px",
        bgcolor: "#fff",
        transition: "all 0.2s",
        "&:hover": { 
            bgcolor: "#D6FF00", 
            boxShadow: "4px 4px 0px #000", 
            transform: "translate(-2px, -2px)" 
        }
    };

    return (
        <>
            <AppBar position="sticky" sx={{ bgcolor: "#fff", color:"#000", borderBottom: "4px solid #000", boxShadow: "none", zIndex: 1100 }}>
                <Toolbar sx={{ display: "flex", justifyContent: "space-between", py: 1 }}>
                    
                    {/* LOGO */}
                    <Typography 
                        variant="h5" 
                        component={Link}
                        to="/"
                        sx={{ 
                            fontWeight: "900", 
                            fontFamily: "Caprasimo",
                            textDecoration: "none",
                            color: "#000",
                            letterSpacing: "1px",
                            transition: "transform 0.2s",
                            "&:hover": { transform: "scale(1.05)" }
                        }}
                    >
                        GAULT VAPES
                    </Typography>
                    
                    {/* DESKTOP LINKS */}
                    <Box sx={{ display: { xs: "none", md: "flex" }, gap: 2, alignItems: "center" }}>
                        {desktopMenu.map((item) => (
                            <Button
                                key={item.text}
                                component={Link}
                                to={item.path}
                                sx={{
                                    color: "#000",
                                    fontWeight: "900",
                                    fontSize: "1rem",
                                    border: "2px solid transparent",
                                    borderRadius: "8px",
                                    px: 2,
                                    transition: "all 0.2s",
                                    "&:hover": {
                                        bgcolor: "#D6FF00",
                                        border: "2px solid #000",
                                        boxShadow: "4px 4px 0px #000",
                                        transform: "translate(-2px, -2px)",
                                    }
                                }}
                            >
                                {item.text}
                            </Button>
                        ))}
                    </Box>

                    {/* ACTIONS BOX (Icons) */}
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                        
                        {/* 1. GUEST: Show Login Icon */}
                        {!token && (
                            <IconButton component={Link} to="/login" sx={{ ...iconButtonStyle, display: { xs: "none", md: "flex" } }}>
                                <PersonIcon />
                            </IconButton>
                        )}

                        {/* 2. LOGGED IN (Admin or User): Show Logout Icon */}
                        {token && (
                            <IconButton onClick={handleLogout} sx={{ ...iconButtonStyle, display: { xs: "none", md: "flex" }, "&:hover": { bgcolor: "#FF3366", color: "#fff", boxShadow: "3px 3px 0px #000", transform: "translate(-2px, -2px)" } }}>
                                <LogoutIcon />
                            </IconButton>
                        )}

                        {/* 3. EVERYONE EXCEPT ADMIN: Show Cart Icon */}
                        {(!token || role !== "admin") && (
                            <IconButton onClick={() => setCartOpen(true)} sx={iconButtonStyle}>
                                <Badge
                                    badgeContent={cartItemCount} 
                                    sx={{ 
                                        "& .MuiBadge-badge": { 
                                            bgcolor: "#FF3366",
                                            color: "#fff", 
                                            fontWeight: "bold",
                                            border: "2px solid #000",
                                        } 
                                    }}
                                >
                                    <ShoppingCartIcon />
                                </Badge>
                            </IconButton>
                        )}

                        {/* MOBILE MENU TOGGLE */}
                        <IconButton
                            sx={{ ...iconButtonStyle, display: { xs: "flex", md: "none" }, ml: 1 }}
                            onClick={() => setOpenMenu(true)}
                        >
                            <MenuIcon />
                        </IconButton>
                    </Box>
                </Toolbar>
            </AppBar>

            {/* MOBILE DRAWER */}
            <Drawer 
                anchor="right" 
                open={openMenu} 
                onClose={() => setOpenMenu(false)}
                PaperProps={{
                    sx: { 
                        width: 250, 
                        borderLeft: "4px solid #000",
                        bgcolor: "#fff" 
                    }
                }}
            >
                <List sx={{ mt: 2 }}>
                    {activeMenu.map((item) => (
                        <ListItem 
                            button 
                            key={item.text} 
                            component={item.text === "Logout" ? "div" : Link} 
                            to={item.text !== "Logout" ? item.path : undefined} 
                            onClick={() => {
                                if (item.text === "Logout") handleLogout();
                                setOpenMenu(false);
                            }}
                            sx={{ 
                                mb: 1, 
                                mx: 1, 
                                borderRadius: "8px",
                                border: "2px solid transparent",
                                "&:hover": { 
                                    bgcolor: item.text === "Logout" ? "#FF3366" : "#D6FF00", 
                                    border: "2px solid #000",
                                    color: item.text === "Logout" ? "#fff" : "#000"
                                }
                            }}
                        >
                            <ListItemText 
                                primary={item.text} 
                                sx={{ "& span": { fontWeight: "900" } }} 
                            />
                        </ListItem>
                    ))}
                </List>
            </Drawer>
        </>
    );
}

export default Navbar;