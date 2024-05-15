import { Box } from "@mui/material";

const BoardBar = () => {
  return (
    <Box
      sx={{
        backgroundColor: "primary.dark",
        width: "100%",
        height: (theme) => theme.trello.boarBarHeight,
        display: "flex",
        alignItems: "center",
      }}
    >
      board Bar
    </Box>
  );
};

export default BoardBar;
