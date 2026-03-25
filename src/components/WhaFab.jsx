import { Fab } from "@mui/material";
import WhatsAppIcon from '@mui/icons-material/WhatsApp';

const WhaFab = () => {
    const whaMessage = "Hola :) \nMe interesa realizar un pedido. \n¿Podrían darme más información?";
    const phone = "5215644889629";
    const message4Wha = encodeURIComponent(whaMessage);
    const waLink = `https://wa.me/${phone}?text=${message4Wha}`;

    const handleClick = () => {
        window.open(waLink, "_blank");
    };
    
    return(
        <Fab
            sx={{
                position: "fixed",
                top: 200,
                right: 10,
                backgroundColor: "#ffffff",
                color: "#25D366",
                boxShadow: "0 4px 10px rgba(0,0,0,0.2)",
                transition: "transform 0.3s ease, box-shadow 0.3s ease",
                "&:hover": {
                    transform: "scale(1.15)",
                    boxShadow: "0 6px 14px rgba(0,0,0,0.3)",
                },
            }}
            title="Contactar por WhatsApp"
            size="medium"
            onClick={handleClick}
        >
            <WhatsAppIcon sx={{ color: "#25D366", fontSize: 32 }} />
        </Fab>
    );
}
export default WhaFab;