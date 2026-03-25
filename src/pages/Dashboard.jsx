import { useState } from "react";
import { 
  Box, 
  useMediaQuery, 
  useTheme
} from "@mui/material";
import { AnimatePresence } from "framer-motion";
import OrdenesListadas from "../components/admin/OrdenesListadas";
import Metrics from "../components/admin/Metrics";
import Panel from "../components/admin/Panel";
import ExpandedCard from "../components/admin/ExpandedCard";
import EntregasPersonales from "../components/PersonalDelivery";
import Inventory from "../components/admin/Inventory";

const Dashboard = () => {
  const [selectedId, setSelectedId] = useState(null);
  
  const PANELS = [
    { id: "orders", title: "Órdenes Activas", content: (props) => <OrdenesListadas {...props} />, color: "#E3F2FD" },
    { id: "stock", title: "Inventario", content: (props) => <Inventory {...props} />, color: "#FF3366" },
    { id: "deliveries", title: "Entregas en Persona", content: (props) => <EntregasPersonales {...props} />, color: "#FFF3E0" },
    { id: "metrics", title: "Métricas", content: (props) => <Metrics {...props} />, color: "#F3E5F5" },
  ];

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <Box
      sx={{
        minHeight: "100vh",
        width: "100%",
        display: "grid",
        gridTemplateColumns: isMobile ? "1fr" : "repeat(2, 1fr)",
        gridAutoRows: isMobile ? "200px" : "minmax(300px, 1fr)",
        gap: 3,
        pt: 2,
        px: isMobile ? 2 : 4,
        pb: 3,
        bgcolor: "#f4f5f7",
        boxSizing: "border-box",
        overflowX: "hidden"
      }}
    >
    {PANELS.map((panel) => (
      <Panel
        key={panel.id} 
        data={panel} 
        onClick={() => setSelectedId(panel.id)} 
      />
    ))}

    <AnimatePresence>
      {selectedId && (
        <ExpandedCard
          id={selectedId} 
          panels={PANELS} 
          onClose={() => setSelectedId(null)} 
        />
      )}
    </AnimatePresence>
    </Box>
  );
};

export default Dashboard;