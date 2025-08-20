// Top app bar component

import React from "react";
import {
  AppBar as MuiAppBar,
  Toolbar,
  Typography,
  useTheme,
} from "@mui/material";

interface AppBarProps {
  title?: string;
}

const AppBar: React.FC<AppBarProps> = ({ title = "Expense Tracker" }) => {
  const theme = useTheme();

  return (
    <MuiAppBar
      position="fixed"
      sx={{
        zIndex: theme.zIndex.drawer + 1,
        background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
        boxShadow: "0 4px 20px rgba(0,0,0,0.15)",
        borderRadius: "0",
        borderBottom: "none",
      }}
    >
      <Toolbar sx={{ minHeight: 64, px: 3 }}>
        <Typography
          variant="h5"
          noWrap
          component="div"
          sx={{
            flexGrow: 1,
            fontWeight: 600,
            color: "white",
            textShadow: "0 2px 4px rgba(0,0,0,0.2)",
            letterSpacing: "-0.3px",
          }}
        >
          {title}
        </Typography>
      </Toolbar>
    </MuiAppBar>
  );
};

export default AppBar;
