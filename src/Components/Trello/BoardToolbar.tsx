import { useRef } from 'react';
import { useBoardContext } from './BoardProvider';
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from "../UI/Popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList
} from "../UI/Command";

function BoardToolbar() {
  const {
    boards,
    /* selectedBoardIndex, */
    setSelectedBoardIndex,
    /* updateBoard, */
    /* addNewList, */
    exportBoardData,
    importBoardData
  } = useBoardContext();
  /* const [selectedFile, setSelectedFile] = useState<File | null>(null); */
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      importBoardData(selectedFile);
      event.target.value = ''; // Reset file input
    }
  };
  /* const handleImportClick = () => { */
  /*   if (selectedFile) { */
  /*     importBoardData(selectedFile); */
  /*     setSelectedFile(null); // Reset selected file after importing */
  /*   } */
  /* }; */
  const handleImportClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click(); // Trigger the file input click event
    }
  };


  return (
    <div style={{
      display:'flex',
      gap:'0.5rem',
      backgroundColor:'hsla(var(--one_bg1), 0.6)',
      padding:'0.75rem',
      height:'100%',
      width:'100%',
    }}>

      <Popover>
        <PopoverTrigger>
            Change board
        </PopoverTrigger>
        <PopoverContent align='start'>
          <Command>
            <CommandInput placeholder="Type to search..."/>
            <CommandList>
              <CommandEmpty> No result found. </CommandEmpty>
              <CommandGroup>
                {boards.map((board, index) => (
                  <CommandItem
                    key={index}
                    onSelect={() => {setSelectedBoardIndex(index)}}
                  >
                    {board.title}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>


      <button
        onClick={() => {
          exportBoardData()
        }}
      >
        Export Board JSON
      </button>
      <button
        onClick={handleImportClick}
      >
        Import Board JSON
      </button>
      <input
        type="file"
        accept=".json"
        style={{ display: 'none' }}
        ref={fileInputRef}
        onChange={handleFileChange}
      />
    </div>
  );
}

export default BoardToolbar;

