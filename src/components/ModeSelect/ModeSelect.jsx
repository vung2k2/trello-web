import { useColorScheme } from "@mui/material/styles";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import LightModeIcon from "@mui/icons-material/LightMode";
import SettingsBrightnessIcon from "@mui/icons-material/SettingsBrightness";
import ModeNightIcon from "@mui/icons-material/ModeNight";
import { Box } from "@mui/material";

const ModeSelect = () => {
  const { mode, setMode } = useColorScheme();

  const handleChange = (event) => {
    setMode(event.target.value);
  };

  return (
    <FormControl size="small" sx={{ minWidth: "120px" }}>
      <InputLabel id="select-mode-label">Mode</InputLabel>
      <Select labelId="select-mode-label" id="select-mode" value={mode} label="mode" onChange={handleChange}>
        <MenuItem value="light">
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <LightModeIcon fontSize="small" /> Light
          </Box>
        </MenuItem>

        <MenuItem value="dark" fontSize="small">
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <ModeNightIcon /> Dark
          </Box>
        </MenuItem>

        <MenuItem value="system" fontSize="small">
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <SettingsBrightnessIcon /> System
          </Box>
        </MenuItem>
      </Select>
    </FormControl>
  );
};

export default ModeSelect;
