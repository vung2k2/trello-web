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
  DragOverlay,
  defaultDropAnimationSideEffects,
  closestCorners,
  closestCenter,
  rectIntersection,
  pointerWithin,
  getFirstCollision,
} from "@dnd-kit/core";
import { cloneDeep, isEmpty } from "lodash";
import { useEffect, useState, useCallback, useRef } from "react";
import { arrayMove } from "@dnd-kit/sortable";
import Card from "./ListColumns/Column/ListCards/Card/Card";
import Column from "./ListColumns/Column/Column";
import { generatePlaceholderCard } from "../../../utils/formatter";

const ACTIVE_DRAG_ITEM_TYPE = {
  COLUMN: "ACTIVE_DRAG_ITEM_TYPE_COLUMN",
  CARD: "ACTIVE_DRAG_ITEM_TYPE_CARD",
};

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
  const [activeDragItemId, setActiveDragItemId] = useState(null);
  const [activeDragItemType, setActiveDragItemType] = useState(null);
  const [activeDragItemData, setActiveDragItemData] = useState(null);

  const [oldColumnWhenDraggingCard, setOldColumnWhenDraggingCard] =
    useState(null);
  const lastOverId = useRef(null);
  useEffect(() => {
    setOrderedColumns(mapOrder(board?.columns, board?.columnOrderIds, "_id"));
  }, [board]);

  const findColumnByCardId = (cardId) => {
    return orderedColumns.find((column) =>
      column?.cards?.map((card) => card._id)?.includes(cardId)
    );
  };

  const handleDragStart = (event) => {
    setActiveDragItemId(event?.active?.id);
    setActiveDragItemType(
      event?.active?.data?.current?.columnId
        ? ACTIVE_DRAG_ITEM_TYPE.CARD
        : ACTIVE_DRAG_ITEM_TYPE.COLUMN
    );
    setActiveDragItemData(event?.active?.data?.current);

    if (event?.active?.data?.current?.columnId) {
      setOldColumnWhenDraggingCard(findColumnByCardId(event?.active?.id));
    }
  };

  const moveCardBetweenDifferenColumns = (
    overColumn,
    overCardId,
    active,
    over,
    activeColumn,
    activeDraggingCardId,
    activeDraggingCardData
  ) => {
    setOrderedColumns((prevColumns) => {
      const overCardIndex = overColumn?.cards?.findIndex(
        (card) => card._id === overCardId
      );

      let newCardIndex;
      const isBelowOverItem =
        active.rect.current.translated &&
        active.rect.current.translated.top > over.rect.top + over.rect.height;

      const modifier = isBelowOverItem ? 1 : 0;

      newCardIndex =
        overCardIndex >= 0
          ? overCardIndex + modifier
          : overColumn?.cards?.length + 1;

      const nextColumns = cloneDeep(prevColumns);
      const nextActiveColumn = nextColumns.find(
        (column) => column._id === activeColumn._id
      );
      const nextOverColumn = nextColumns.find(
        (column) => column._id === overColumn._id
      );
      if (nextActiveColumn) {
        nextActiveColumn.cards = nextActiveColumn.cards.filter(
          (card) => card._id !== activeDraggingCardId
        );
        if (isEmpty(nextActiveColumn.cards)) {
          nextActiveColumn.cards = [generatePlaceholderCard(nextActiveColumn)];
        }
        nextActiveColumn.cardOrderIds = nextActiveColumn.cards.map(
          (card) => card._id
        );
      }
      if (nextOverColumn) {
        nextOverColumn.cards = nextOverColumn.cards.filter(
          (card) => card._id !== activeDraggingCardId
        );
        nextOverColumn.cards = nextOverColumn.cards.toSpliced(
          newCardIndex,
          0,
          activeDraggingCardData
        );
        nextOverColumn.cards = nextOverColumn.cards.filter(
          (card) => !card.FE_PlaceholderCard
        );
        nextOverColumn.cardOrderIds = nextOverColumn.cards.map(
          (card) => card._id
        );
        console.log(nextOverColumn);
      }
      return nextColumns;
    });
  };

  const handleDragOver = (event) => {
    if (activeDragItemType === ACTIVE_DRAG_ITEM_TYPE.COLUMN) return;
    const { active, over } = event;
    if (!active || !over) return;

    const {
      id: activeDraggingCardId,
      data: { current: activeDraggingCardData },
    } = active;
    const { id: overCardId } = over;

    const activeColumn = findColumnByCardId(activeDraggingCardId);
    const overColumn = findColumnByCardId(overCardId);

    if (!activeColumn || !overColumn) return;

    if (activeColumn._id !== overColumn._id) {
      moveCardBetweenDifferenColumns(
        overColumn,
        overCardId,
        active,
        over,
        activeColumn,
        activeDraggingCardId,
        activeDraggingCardData
      );
    }
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (!active || !over) return;

    // Xử lý kéo thả cards
    if (activeDragItemType === ACTIVE_DRAG_ITEM_TYPE.CARD) {
      const {
        id: activeDraggingCardId,
        data: { current: activeDraggingCardData },
      } = active;
      const { id: overCardId } = over;

      const activeColumn = findColumnByCardId(activeDraggingCardId);
      const overColumn = findColumnByCardId(overCardId);

      if (!activeColumn || !overColumn) return;
      if (oldColumnWhenDraggingCard._id !== overColumn._id) {
        moveCardBetweenDifferenColumns(
          overColumn,
          overCardId,
          active,
          over,
          activeColumn,
          activeDraggingCardId,
          activeDraggingCardData
        );
      } else {
        const oldCardIndex = oldColumnWhenDraggingCard?.cards.findIndex(
          (c) => c._id === activeDragItemId
        );
        const newCardIndex = overColumn?.cards?.findIndex(
          (c) => c._id === overCardId
        );
        const dndOrderedCards = arrayMove(
          oldColumnWhenDraggingCard?.cards,
          oldCardIndex,
          newCardIndex
        );
        setOrderedColumns((prevColumns) => {
          const nextColumns = cloneDeep(prevColumns);
          const targetColumn = nextColumns.find(
            (c) => c._id === overColumn._id
          );
          targetColumn.cards = dndOrderedCards;
          targetColumn.cardOrderIds = dndOrderedCards.map((card) => card._id);
          return nextColumns;
        });
      }
    }

    // Xử lý kéo thả columns
    if (activeDragItemType === ACTIVE_DRAG_ITEM_TYPE.COLUMN) {
      if (active.id !== over.id) {
        const oldColummnIndex = orderedColumns.findIndex(
          (c) => c._id === active.id
        );
        const newColumnIndex = orderedColumns.findIndex(
          (c) => c._id === over.id
        );
        const dndOrderedColumns = arrayMove(
          orderedColumns,
          oldColummnIndex,
          newColumnIndex
        );
        setOrderedColumns(dndOrderedColumns);
        // const dndOrderedColumnsIds = dndOrderedColumns.map((c) => c._id);
      }
    }

    setActiveDragItemId(null);
    setActiveDragItemType(null);
    setActiveDragItemData(null);
    setOldColumnWhenDraggingCard(null);
  };

  const dropAnimation = {
    sideEffects: defaultDropAnimationSideEffects({
      styles: { active: { opacity: "0.5" } },
    }),
  };

  const collisionDetectionStrategy = useCallback(
    (args) => {
      if (activeDragItemType === ACTIVE_DRAG_ITEM_TYPE.COLUMN) {
        return closestCorners({ ...args });
      }
      const pointerIntersections = pointerWithin(args);
      const intersections =
        pointerIntersections.length > 0
          ? pointerIntersections
          : rectIntersection(args);
      let overId = getFirstCollision(intersections, "id");
      if (overId) {
        const checkColumn = orderedColumns.find(
          (column) => column._id === overId
        );
        if (checkColumn) {
          overId = closestCenter({
            ...args,
            droppableContainers: args.droppableContainers.filter(
              (container) => {
                return (
                  container.id !== overId &&
                  checkColumn?.cardOrderIds?.includes(container.id)
                );
              }
            ),
          })[0]?.id;
        }
        lastOverId.current = overId;
        return [{ id: overId }];
      }
      return (lastOverId.current = overId);
    },
    [activeDragItemType]
  );
  return (
    <DndContext
      onDragEnd={handleDragEnd}
      onDragOver={handleDragOver}
      onDragStart={handleDragStart}
      // collisionDetection={closestCorners}
      collisionDetection={collisionDetectionStrategy}
      sensors={sensors}
    >
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
        <DragOverlay dropAnimation={dropAnimation}>
          {!activeDragItemType && null}
          {activeDragItemType === ACTIVE_DRAG_ITEM_TYPE.COLUMN && (
            <Column column={activeDragItemData} />
          )}
          {activeDragItemType === ACTIVE_DRAG_ITEM_TYPE.CARD && (
            <Card card={activeDragItemData} />
          )}
        </DragOverlay>
      </Box>
    </DndContext>
  );
};

export default BoardContent;
