import Box from "@mui/material/Box";
import Column from "./Column/Column";

const ListColumns = () => {
  return (
    <Box
      sx={{
        bgcolor: "inherit",
        height: "100%",
        width: "100%",
        display: "flex",
        overflowX: "auto",
        overflowY: "hidden",
        "&::-webkit-scrollbar-track": { m: 2 },
      }}
    >
      <Column />
    </Box>
  );
};

export default ListColumns;
