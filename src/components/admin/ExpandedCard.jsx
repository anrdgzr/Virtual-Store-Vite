import { motion } from "framer-motion";
import CloseIcon from "@mui/icons-material/Close";
import { Box, IconButton, Typography, useMediaQuery, useTheme } from "@mui/material";


const ExpandedCard = ({ id, panels, onClose }) => {
    const data = panels.find((p) => p.id === id);
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

    return (
        <>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={onClose}
                style={{
                    position: "fixed",
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: "rgba(0,0,0,0.6)",
                    zIndex: 1100,
                    backdropFilter: "blur(4px)"
                }}
            />

            <Box
                sx={{
                    position: "fixed",
                    top: 0,
                    left: 0,
                    height: "100vh",
                    width: "100vw",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    zIndex: 1301,
                    pointerEvents: "none",
                    p: { xs: 0, sm: 2, md: 0 },
                }}
            >
                <motion.div
                    layoutId={id}
                    style={{
                        width: "100%",
                        maxWidth: "900px",
                        height: isMobile ? "100vh" : "90vh",
                        background: "#fff",
                        borderRadius: isMobile ? "0px" : "16px",
                        border: isMobile ? "none" : "4px solid #000",
                        boxShadow: isMobile ? "none" : "12px 12px 0px #000",
                        overflow: "hidden",
                        pointerEvents: "auto",
                        display: "flex",
                        flexDirection: "column",
                    }}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                >
                    <Box 
                        sx={{
                            display: 'flex', 
                            justifyContent: 'space-between', 
                            alignItems: 'center', 
                            p: { xs: 2, md: 3 }, 
                            borderBottom: '4px solid #000', 
                            bgcolor: data.color || "#00E5FF", 
                        }}
                    >
                        <Typography 
                            variant="h5" 
                            fontWeight="900"
                            fontFamily="Caprasimo" 
                            textTransform="uppercase"
                        >
                            {data.title}
                        </Typography>
                        <IconButton 
                            onClick={onClose}
                            sx={{
                                bgcolor: "#FF3366",
                                color: "#fff",
                                border: "3px solid #000",
                                borderRadius: "8px",
                                transition: "all 0.2s",
                                "&:hover": {
                                    bgcolor: "#fff",
                                    color: "#000",
                                    transform: "translate(-2px, -2px)",
                                    boxShadow: "4px 4px 0px #000"
                                }
                            }}
                        >
                            <CloseIcon sx={{ fontSize: "1.5rem" }} />
                        </IconButton>
                    </Box>

                    <Box
                        component={motion.div}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        sx={{
                            flexGrow: 1,
                            overflowY: 'auto',
                            p: { xs: 2, md: 4 },
                            bgcolor: "#f4f5f7",
                            
                            "&::-webkit-scrollbar": { width: "12px" },
                            "&::-webkit-scrollbar-track": { bgcolor: "#fff", borderLeft: "3px solid #000" },
                            "&::-webkit-scrollbar-thumb": { bgcolor: "#000", borderLeft: "3px solid #000" },
                        }}
                    >
                        {typeof data.content === 'function' ? data.content({ isExpanded: true }) : data.content}
                    </Box>

                </motion.div>
            </Box>
        </>
    );
};

export default ExpandedCard;