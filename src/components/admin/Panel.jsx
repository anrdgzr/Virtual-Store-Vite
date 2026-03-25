import { motion } from "framer-motion";
import { 
    Box,
} from "@mui/material";

const Panel = ({ data, onClick }) => {
    return (
        <motion.div
            layoutId={data.id} 
            onClick={onClick}
            style={{
                width: "100%",
                height: "100%",
                cursor: "pointer",
                borderRadius: "24px",
                overflow: "hidden",
                backgroundColor: data.color,
                boxShadow: "0px 10px 30px rgba(0,0,0,0.05)",
            }}
            whileHover={{ scale: 1.02, y: -4 }}
            whileTap={{ scale: 0.98 }}
        >
            <Box sx={{ p: 3, pb: 1, height: "100%", display: "flex", flexDirection: "column" }}>
                <motion.h3 
                    style={{
                        margin: 0, 
                        color: "#1a1a1a", 
                        fontSize: "1.5rem", 
                        letterSpacing: "-0.5px", 
                        fontWeight: "900", 
                        fontFamily: "Caprasimo", 
                        textTransform: "uppercase"  
                    }}
                >
                    {data.title}
                </motion.h3>
                <Box sx={{ flex: 1, opacity: 0.8, overflow: "hidden", mt: 1, pointerEvents: "none" }}>
                    {typeof data.content === 'function' ? data.content({ isExpanded: false }) : data.content}
                </Box>
            </Box>
        </motion.div>
    );
};
export default Panel;