import Box from "@mui/material/Box";
import theme from "../../../theme";
import ListColumns from "./ListColumns/ListColumns";
import { mapOrder } from "../../../utils/sorts";
import {
  DndContext,
  // PointerSensor,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { useEffect, useState } from "react";
import { arrayMove } from "@dnd-kit/sortable";

const BoardContent = ({ board }) => {
  // Yêu cầu di chuyển chuột mới nhận event tranh click đã nhận
  // const pointerSensor = useSensor(PointerSensor, {
  //   activationConstraint: { distance: 10 },
  // });
  const mouseSensor = useSensor(MouseSensor, {
    activationConstraint: { distance: 10 },
  });
  const touchSensor = useSensor(TouchSensor, {
    activationConstraint: { delay: 250, tolerance: 500 }, // trên càm ứng nhấn giữ 250ms mới nhận
  });
  // const sensors = useSensors(pointerSensor);
  const sensors = useSensors(mouseSensor, touchSensor);

  const [orderedColumns, setOrderedColumns] = useState([]);

  useEffect(() => {
    setOrderedColumns(mapOrder(board?.columns, board?.columnOrderIds, "_id"));
  }, [board]);

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (!over) return;
    if (active.id !== over.id) {
      const oldIndex = orderedColumns.findIndex((c) => c._id === active.id);
      const newIndex = orderedColumns.findIndex((c) => c._id === over.id);
      const dndOrderedColumns = arrayMove(orderedColumns, oldIndex, newIndex);
      setOrderedColumns(dndOrderedColumns);
      // const dndOrderedColumnsIds = dndOrderedColumns.map((c) => c._id);
    }
  };
  return (
    <DndContext onDragEnd={handleDragEnd} sensors={sensors}>
      <Box
        sx={{
          bgcolor: (theme) =>
            theme.palette.mode === "dark" ? "#34495e" : "#1976d2",
          width: "100%",
          height: theme.trello.boardContentHeight,
          p: "10px 0",
        }}
      >
        <ListColumns columns={orderedColumns} />
      </Box>
    </DndContext>
  );
};

export default BoardContent;
