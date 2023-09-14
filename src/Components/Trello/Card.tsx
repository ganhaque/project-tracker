import { useState, useRef, useEffect } from 'react';
import { Draggable } from '@hello-pangea/dnd';
import { Pencil1Icon } from '@radix-ui/react-icons';
import { labelValueColorMap, labelValueBackgroundColorMap } from './Data';
/* import { Settings } from './Data'; */
import "./Card.css"
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
  /* CommandItem, */
  CommandList
} from "../UI/Command";

/* NOTE: This is a custom CardProps prop & not the actual CardProps */
interface CardProps {
  /* id: string; */
  /* title: string; */
  /* labels?: string[]; */
  cardIndex: number;
  listIndex: number
}

const Card = ({ cardIndex, listIndex }: CardProps) => {
  const {
    boards,
    selectedBoardIndex,
    updateCardTitle,
    removeCard,
    /* updateCardDescription, */
  } = useBoardContext();
  const card = boards[selectedBoardIndex].lists[listIndex].cards[cardIndex];


  const [isEditingCardTitle, setIsEditingCardTitle] = useState(false);
  const [editedTitle, setEditedTitle] = useState(card.title);
  const textAreaRef = useRef<HTMLTextAreaElement>(null); // Create a ref for the textarea
  const [isEditingCardLabels, setIsEditingCardLabels] = useState(false);

  useEffect(() => {
    // When isEditingCardTitle becomes true, focus on the textarea and move the cursor to the end of the content
    if (isEditingCardTitle && textAreaRef.current) {
      textAreaRef.current.focus();
      textAreaRef.current.setSelectionRange(editedTitle.length, editedTitle.length);
    }
    else {
      setIsEditingCardLabels(false);
    }
  }, [isEditingCardTitle]);

  const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter") {
      updateCardTitle(listIndex, cardIndex, editedTitle);
      setIsEditingCardTitle(false);
    }
    else if (e.key === "Escape") {
      setIsEditingCardTitle(false);
      setEditedTitle(card.title);
    }
  };

  return (
    <Draggable key={card.id} draggableId={card.id} index={cardIndex}>
      {(provided) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
        >
          <div className='card-wrapper'>
            {card.labels && card.labels.length > 0 && (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.25rem' }}>
                {card.labels?.map((label) => (
                  <div
                    style={{
                      backgroundColor: `hsla(var(--${labelValueBackgroundColorMap[label]})`,
                      color: `hsla(var(--${labelValueColorMap[label]}))`,
                    }}
                    key={label}
                    className='card-label'
                  >
                    {label}
                  </div>
                ))}
              </div>
            )}

            {isEditingCardTitle ? (
              <textarea
                ref={textAreaRef}
                style={{
                  borderWidth:'0px',
                  padding:'0',
                }}
                value={editedTitle}
                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => {
                  setEditedTitle(e.target.value);
                }}
                /* onBlur={() => { */
                /*   updateCardTitle(listIndex, cardIndex, editedTitle); */
                /*   setIsEditing(false); */
                /* }} */
                onKeyDown={handleKeyPress}
                autoFocus
              />
            ) : (
                card.title
              )}

            {isEditingCardTitle ? (
              <div
                style={{
                }}
                className={`card-edit-toolbar`}
              >
                <button
                  onClick={() => {
                    removeCard(listIndex, cardIndex);
                  }}
                >
                  Delete
                </button>
                {/* <button */}
                {/*   onClick={() => { */}
                {/*     removeCard(listIndex, cardIndex); */}
                {/*   }} */}
                {/* > */}
                {/*   Edit labels */}
                {/* </button> */}
                <button
                  onClick={() => {
                  }}
                >
                  Move
                </button>

                {/* MAYBE: Use Dialog instead of Popover since Popover can go outside window size */}
                <Popover
                  open={isEditingCardLabels}
                  onOpenChange={setIsEditingCardLabels}
                >
                  <PopoverTrigger>
                    Edit labels
                  </PopoverTrigger>
                  <PopoverContent
                    align='start'
                    onInteractOutside={(event) => {event.preventDefault()}}
                  >
                    <div
                      className='label-edit-container'
                    >
                      Labels
                      <Command>
                        <CommandInput
                          style={{
                            backgroundColor:'hsla(var(--black))',
                          }}
                          placeholder="Type to search..."
                        />
                        <CommandList>
                          <CommandEmpty> No result found. </CommandEmpty>
                          <CommandGroup>
                            TODO: Map all labels here

                          </CommandGroup>
                        </CommandList>
                      </Command>
                      <hr style={{width:'100%', margin:'0.25rem'}}></hr>
                      <button
                        style={{
                          width:'100%',
                        }}
                      >
                        Create a new label
                      </button>
                    </div>
                  </PopoverContent>
                </Popover>
              </div>
            ) : (
                <button
                  style={{ display:isEditingCardTitle ? 'none' : '', }}
                  className='card-edit-button'
                  onClick={() => {setIsEditingCardTitle(true)}}
                >
                  <Pencil1Icon style={{ height:'1rem', width:'1rem' }}/>
                </button>
              )
            }
          </div>
        </div>
      )}
    </Draggable>
  );
};

export default Card;

/* {initialStatuses.map((status) => { */
/*   return ( */
/*     <CommandItem */
/*       key={status.value} */
/*       onSelect={() => { */
/*         setNewCardStatus(status.value); */
/*         setIsStatusPopoverOpen(false); */
/*       }} */
/*     > */
/*       {status.icon && ( */
/*         <status.icon style={{ */
/*           marginRight:"0.5rem", */
/*           height:"1rem", */
/*           width:"1rem", */
/*           font:"hsla(var(--muted-foreground))" */
/*         }}/> */
/*       )} */
/*       {status.label} */
/*       <CheckIcon style={{ */
/*         marginLeft:"auto", */
/*         height:"1rem", */
/*         width:"1rem", */
/*         opacity:newCardStatus === status.value ? "1" : "0" */
/*       }} */
/*       /> */
/*     </CommandItem> */
/*   ) */
/* })} */












            {/* NOTE: Popover doesn't work because I want to hide the pencil button */}
            {/* when the edit menu is open, but that make the PopoverContent */}
            {/* lose its anchor to the card wrapper element */}
            {/* <Popover */}
            {/*   open={isEditingCardTitle} */}
            {/*   onOpenChange={setIsEditingCardTitle} */}
            {/* > */}
            {/*   <PopoverTrigger */}
            {/*     className='card-edit-button' */}
            {/*   > */}
            {/*     <Pencil1Icon style={{ height:'1rem', width:'1rem' }}/> */}
            {/*   </PopoverTrigger> */}
            {/*   <PopoverContent */}
            {/*     align='start' */}
            {/*     side='right' */}
            {/*     onOpenAutoFocus={(event) => {event.preventDefault()}} */}
            {/*   > */}
            {/*     <div */}
            {/*       style={{ */}
            {/*       }} */}
            {/*       className={`card-edit-toolbar`} */}
            {/*     > */}
            {/*       <button */}
            {/*         onClick={() => { */}
            {/*           removeCard(listIndex, cardIndex); */}
            {/*         }} */}
            {/*       > */}
            {/*         Delete */}
            {/*       </button> */}
            {/*       <button */}
            {/*         onClick={() => { */}
            {/*           removeCard(listIndex, cardIndex); */}
            {/*         }} */}
            {/*       > */}
            {/*         Edit labels */}
            {/*       </button> */}
            {/*       <button */}
            {/*         onClick={() => { */}
            {/*         }} */}
            {/*       > */}
            {/*         Move */}
            {/*       </button> */}
            {/*     </div> */}
            {/*   </PopoverContent> */}
            {/* </Popover> */}
