import { Box } from "@mui/material";

const BoardContent = () => {
  return (
    <Box
      sx={{
        backgroundColor: "primary.light",
        width: "100%",
        height: (theme) =>
          `calc(100vh - ${theme.trello.appBarHeight} - ${theme.trello.boarBarHeight})`,
        display: "flex",
        alignItems: "center",
      }}
    >
      boar conten
    </Box>
  );
};

export default BoardContent;
