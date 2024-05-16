import React from "react";
import ModeSelect from "../ModeSelect/ModeSelect";
import { Box, SvgIcon, Typography } from "@mui/material";
import AppsIcon from "@mui/icons-material/Apps";
import { ReactComponent as trelloLogo } from "../../assets/trello-logo.svg";
import Workspace from "./Menu/Workspace";
import Recent from "./Menu/Recent";
import Templates from "./Menu/Templates";
import Starred from "./Menu/Starred";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import NotificationsNoneIcon from "@mui/icons-material/NotificationsNone";
import Badge from "@mui/material/Badge";
import Tooltip from "@mui/material/Tooltip";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import Profiles from "./Menu/Profiles";

const AppBar = () => {
  return (
    <Box
      px={2}
      sx={{
        width: "100%",
        height: (theme) => theme.trello.appBarHeight,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 2,
        overflowX: "auto",
      }}
    >
      <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
        <AppsIcon sx={{ color: "primary.main" }} />
        <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
          <SvgIcon fontSize="small" component={trelloLogo} inheritViewBox sx={{ color: "primary.main" }} />
          <Typography variant="span" sx={{ fontSize: "1.2rem", fontWeight: "bold", color: "primary.main" }}>
            Trello
          </Typography>
        </Box>
        <Box sx={{ display: { xs: "none", md: "flex" }, gap: 1 }}>
          <Workspace />
          <Recent />
          <Starred />
          <Templates />
          <Button variant="outlined">Create</Button>
        </Box>
      </Box>
      <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
        <TextField id="outlined-search" label="Search..." type="search" size="small" sx={{ minWidth: "120px" }} />
        <ModeSelect />
        <Tooltip title="Notification" sx={{ cursor: "pointer" }}>
          <Badge color="secondary" variant="dot">
            <NotificationsNoneIcon sx={{ color: "primary.main" }} />
          </Badge>
        </Tooltip>
        <Tooltip title="Help" sx={{ cursor: "pointer", color: "primary.main" }}>
          <HelpOutlineIcon />
        </Tooltip>
        <Profiles />
      </Box>
    </Box>
  );
};

export default AppBar;
