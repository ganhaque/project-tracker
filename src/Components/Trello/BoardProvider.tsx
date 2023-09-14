/* import { invoke } from '@tauri-apps/api/tauri'; */
/* import { writeFile } from '@tauri-apps/api/fs'; */
/* import { fs } from '@tauri-apps/api'; */
/* import { write } from 'xlsx'; */
import { save } from '@tauri-apps/api/dialog';
import { writeTextFile } from '@tauri-apps/api/fs';
import { homeDir } from '@tauri-apps/api/path';
import React, { createContext, ReactNode, useContext, useState } from 'react';
import { useLocalStorage } from '../Hooks/LocalStorageHook';
import { BoardProps, exampleBoards, ListProps, CardProps } from './Data';

interface BoardContextType {
  boards: BoardProps[];
  selectedBoardIndex: number;
  setSelectedBoardIndex: (newSelectedBoardIndex: number) => void;
  updateBoard: (updatedBoard: BoardProps) => void;
  updateListTitle: (listIndex: number, newTitle: string) => void;
  updateCardTitle: (
    listIndex: number,
    cardIndex: number,
    newTitle: string
  ) => void;
  updateCardDescription: (
    listIndex: number,
    cardIndex: number,
    newDescription: string
  ) => void;
  addNewCard: (
    listIndex: number,
    newCardTitle: string
  ) => void;
  addNewList: (
    newListTitle: string
  ) => void;
  removeList: (
    listIndex: number
  ) => void;
  removeCard: (
    listIndex: number,
    cardIndex: number
  ) => void;
  exportBoardData: () => void;
  importBoardData: (file: File) => void;
}

const BoardContext = createContext<BoardContextType | null>(null);

// Create a provider to wrap the components that need access to the board context
export const BoardProvider: React.FC<{children: ReactNode}> = ({ children }) => {
  const [boards, setBoards] = useLocalStorage<BoardProps[]>('boards', exampleBoards);
  const [selectedBoardIndex, updateSelectedBoardIndex] = useState<number>(0);

  const setSelectedBoardIndex = (newIndex: number) => {
    updateSelectedBoardIndex(newIndex);
  };

  if (!boards || boards.length === 0) {
    console.log(boards);
    return <div>Loading or no boards available.</div>;
  }

  const updateBoard = (updatedBoard: BoardProps) => {
    const updatedBoards = [...boards];
    updatedBoards[selectedBoardIndex] = updatedBoard;
    setBoards(updatedBoards);
  };

  const updateListTitle = (listIndex: number, newTitle: string) => {
    setBoards((prevBoards) => {
      const updatedBoards = [...prevBoards];
      const selectedBoard = updatedBoards[selectedBoardIndex];
      const updatedLists = [...selectedBoard.lists];
      updatedLists[listIndex] = {
        ...updatedLists[listIndex],
        title: newTitle,
      };
      selectedBoard.lists = updatedLists;
      updatedBoards[selectedBoardIndex] = selectedBoard;
      return updatedBoards;
    });
  };

  const updateCardData = (
    listIndex: number,
    cardIndex: number,
    updateFunction: (card: CardProps) => CardProps
  ) => {
    setBoards((prevBoards) =>
      prevBoards.map((board, i) => {
        if (i === selectedBoardIndex) {
          const updatedLists = board.lists.map((list, j) => {
            if (j === listIndex) {
              return {
                ...list,
                ...(cardIndex !== null
                  ? {
                    cards: list.cards.map((card, k) =>
                      k === cardIndex ? updateFunction(card) : card
                    ),
                  }
                  : {}),
              };
            }
            return list;
          });
          return {
            ...board,
            lists: updatedLists,
          };
        }
        return board;
      })
    );
  };

  const updateCardTitle = (
    listIndex: number,
    cardIndex: number,
    newTitle: string
  ) => {
    updateCardData(listIndex, cardIndex, (card) => ({
      ...card,
      title: newTitle,
    }));
  };

  const updateCardDescription = (
    listIndex: number,
    cardIndex: number,
    newDescription: string
  ) => {
    updateCardData(listIndex, cardIndex, (card) => ({
      ...card,
      description: newDescription,
    }));
  };

  const addNewCard = (
    listIndex: number,
    newCardTitle: string
  ) => {
    setBoards((prevBoards) => {
      const updatedBoards = [...prevBoards];
      const selectedBoard = updatedBoards[selectedBoardIndex];

      if (selectedBoard && selectedBoard.lists[listIndex]) {
        const timestamp = new Date().getTime();
        const newCardId = `${timestamp}`;
        const updatedLists = [...selectedBoard.lists];
        const newCard: CardProps = {
          id: newCardId,
          title: newCardTitle,
          /* description: '', */
        };
        updatedLists[listIndex].cards.push(newCard);
        selectedBoard.lists = updatedLists;
        updatedBoards[selectedBoardIndex] = selectedBoard;
      }

      return updatedBoards;
    });
  }

  /* IDEA: have a trashcan visible when dragging card */

  const addNewList = (
    newListTitle: string
  ) => {
    setBoards((prevBoards) => {
      const updatedBoards = [...prevBoards];
      const selectedBoard = updatedBoards[selectedBoardIndex];
      if (selectedBoard) {
        const updatedLists = [...selectedBoard.lists];
        // Generate a unique droppableId based on the current timestamp
        const timestamp = new Date().getTime();
        const newDroppableId = `${timestamp}`;

        const newList: ListProps = {
          droppableId: newDroppableId,
          title: newListTitle,
          cards: [],
        };
        updatedLists.push(newList);
        selectedBoard.lists = updatedLists;
        updatedBoards[selectedBoardIndex] = selectedBoard;
      }
      return updatedBoards;
    });
  }

  const removeList = (listIndex: number) => {
    setBoards((prevBoards) => {
      const updatedBoards = [...prevBoards];
      const selectedBoard = updatedBoards[selectedBoardIndex];
      if (selectedBoard) {
        const updatedLists = [...selectedBoard.lists];
        updatedLists.splice(listIndex, 1);
        selectedBoard.lists = updatedLists;
        updatedBoards[selectedBoardIndex] = selectedBoard;
      }
      return updatedBoards;
    });
  };

  const removeCard = (
    listIndex: number,
    cardIndex: number
  ) => {
    setBoards((prevBoards) => {
      const updatedBoards = [...prevBoards];
      const selectedList = updatedBoards[selectedBoardIndex].lists[listIndex];

      if (selectedList) {
        const updatedCards = [...selectedList.cards];
        updatedCards.splice(cardIndex, 1);

        updatedBoards[selectedBoardIndex].lists[listIndex] = {
          ...selectedList,
          cards: updatedCards,
        };
      }

      return updatedBoards;
    });
  };

  const exportBoardData = async () => {
    const dataToExport = boards[selectedBoardIndex]; // Get the selected board data
    const jsonData = JSON.stringify(dataToExport, null, 2); // Convert to JSON string with indentation

    /* TODO: Make this work on other machine as well */
    const homeDirPath = await homeDir();
    console.log(homeDirPath)

    const selected = await save({
      defaultPath: homeDirPath + './Documents/board-data.json'
    });
    if(!selected) return;

    await writeTextFile(selected, jsonData);
    console.log("Successfully saved file to", selected);
  };

  const importBoardData = (file: File) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const jsonData = event.target?.result as string;
        const importedData = JSON.parse(jsonData);

        if (importedData && importedData.lists) {
          // Update the lists and cards in the selected board
          const updatedBoards = [...boards];
          const selectedBoard = updatedBoards[selectedBoardIndex];

          // Ensure importedData.lists is an array
          if (Array.isArray(importedData.lists)) {
            selectedBoard.lists = importedData.lists;
          }

          // Optionally, update other properties if needed

          // Update the boards array
          updatedBoards[selectedBoardIndex] = selectedBoard;
          setBoards(updatedBoards);

          // Reset selected board index or perform other necessary updates
          /* setSelectedBoardIndex(0); */
        }
      } catch (error) {
        console.error('Error importing data:', error);
        // Display an error message to the user
      }
    };
    reader.readAsText(file);
  };

  return (
    <BoardContext.Provider
      value={{
        boards,
        selectedBoardIndex,
        setSelectedBoardIndex,
        updateBoard,
        updateListTitle,
        updateCardTitle,
        updateCardDescription,
        addNewCard,
        addNewList,
        removeList,
        removeCard,
        exportBoardData,
        importBoardData,
        // Add more functions for other board-related updates
      }}
    >
      {children}
    </BoardContext.Provider>
  );
};

// A custom hook to use the board context in components
export const useBoardContext = () => {
  const context = useContext(BoardContext);
  if (!context) {
    throw new Error('useBoardContext must be used within a BoardProvider');
  }
  return context;
};
