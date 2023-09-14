import { useState } from 'react';

import { CaretSortIcon, CheckIcon, PlusCircledIcon } from "@radix-ui/react-icons"
import { Label } from '../UI/Label'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '../UI/Popover';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "../UI/Command"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../UI/Dialog"
import { Separator } from "../UI/Separator";

import { initialStatuses, initialLabels } from './Data';
import { Badge } from "../UI/Badge";

export function NewCardDialog() {
  const [isStatusPopoverOpen, setIsStatusPopoverOpen] = useState(false);
  /* const [isLabelPopoverOpen, setIsLabelPopoverOpen] = useState(false); */
  const [newCardTitle, setNewCardTitle] = useState<string>('new card title');
  const [newCardStatus, setNewCardStatus] = useState<string>('Todo');
  /* const [newCardLabels, setNewCardLabels] = useState<string[]>([]); */
  /* const newCardLabels = new Set(); */
  /* const [newCardLabels, newCardLabelsAction] = useSet<string>(); */
  const [newCardLabels, setNewCardLabels] = useState<Set<string>>(new Set());

  const addCardLabel = (label: string) => {
    setNewCardLabels((prevSet) => new Set([...Array.from(prevSet), label]));
  };
  const removeCardLabel = (label: string) => {
    setNewCardLabels((prevSet)=> new Set(Array.from(prevSet).filter((i) => i != label)));
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <button>New Card</button>
      </DialogTrigger>
      <DialogContent className="">
        <DialogHeader>
          <DialogTitle>New Card</DialogTitle>
          <DialogDescription>
            Description lorem ipsum
          </DialogDescription>
        </DialogHeader>
        <div className="flex-column gap-6">
          <div className="flex-column gap-2">
            <Label htmlFor="cardTitle" className="">
              Title
            </Label>
            <div className="flex gap-6">
              <input
                style={{
                  /* width:"16rem" */
                }}
                id="newCardTitle"
                value={newCardTitle}
                onChange={(event) => {
                  setNewCardTitle(event.target.value)
                }}
                placeholder="title go here..."
                className="flex-yes-grow"
              />
              <div className="flex gap-2">
                <Popover open={isStatusPopoverOpen} onOpenChange={setIsStatusPopoverOpen}>
                  <PopoverTrigger asChild>
                    <button
                      className="border-dashed"
                    >
                      {newCardStatus}
                      <CaretSortIcon style={{
                        marginLeft:"0.5rem",
                        height:"1rem",
                        width:"1rem",
                        flexShrink:"0",
                        opacity:"0.5",
                      }}/>
                    </button>
                  </PopoverTrigger>
                  <PopoverContent
                    style={{width:"10rem"}}
                    className="z-50 black-bg" align="start"
                  >
                    <Command className="">
                      <CommandInput placeholder="Change card status..." />
                      <CommandList>
                        <CommandEmpty>
                          No status found.
                        </CommandEmpty>
                        <CommandGroup heading="">
                          {initialStatuses.map((status) => {
                            return (
                              <CommandItem
                                key={status.value}
                                onSelect={() => {
                                  setNewCardStatus(status.value);
                                  setIsStatusPopoverOpen(false);
                                }}
                              >
                                {status.icon && (
                                  <status.icon style={{
                                    marginRight:"0.5rem",
                                    height:"1rem",
                                    width:"1rem",
                                    font:"hsla(var(--muted-foreground))"
                                  }}/>
                                )}
                                {status.label}
                                <CheckIcon style={{
                                  marginLeft:"auto",
                                  height:"1rem",
                                  width:"1rem",
                                  opacity:newCardStatus === status.value ? "1" : "0"
                                }}
                                />
                              </CommandItem>
                            )
                          })}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>

                <Popover>
                  <PopoverTrigger asChild>
                    <button
                      className="border-dashed justify-start"
                      onClick={() => {
                      }}
                    >
                      {/* <PlusCircledIcon style={{ */}
                      {/*   marginRight:"0.5rem", */}
                      {/*   height:"1rem", */}
                      {/*   width:"1rem", */}
                      {/* }}/> */}
                      Priority
                      <CaretSortIcon style={{
                        marginLeft:"0.5rem",
                        height:"1rem",
                        width:"1rem",
                        flexShrink:"0",
                        opacity:"0.5",
                      }}/>
                    </button>
                  </PopoverTrigger>
                  <PopoverContent
                    style={{ width:"12rem",
                    }}
                    className="z-50" align="start">
                    <Command className="rounded-lg border shadow-md">
                      <CommandInput placeholder="add labels" />
                      <CommandList>
                        <CommandEmpty>
                          No labels found.
                        </CommandEmpty>
                        <CommandGroup heading="">
                          {initialLabels.map((label) => {
                            const isSelected = newCardLabels.has(label.value);
                            return (
                              <CommandItem
                                key={label.value}
                                onSelect={() => {
                                  /* NOTE: add does not close the popover, remove does,
                              the check in popoverTrigger button is responsible */
                                  if (isSelected) {
                                    removeCardLabel(label.value);
                                    /* setIsLabelPopoverOpen(true); */
                                  }
                                  else {
                                    addCardLabel(label.value);
                                    /* setIsLabelPopoverOpen(true); */
                                  }
                                  console.log(label.value);
                                }}
                              >
                                <div style={{
                                  display:"flex",
                                  justifyContent:"center",
                                  alignItems:"center",
                                  height:"1rem",
                                  width:"1rem",
                                  borderRadius: "calc(var(--radius) - 4px)",
                                  borderWidth:"1px",
                                  marginRight:"0.5rem",
                                  background:isSelected ? "hsla(var(--base06))" : "transparent",
                                  color:"hsla(var(--black))"
                                }}>
                                  <CheckIcon style={{
                                    height:"1rem",
                                    width:"1rem",
                                    visibility:isSelected ? "visible" : "hidden",
                                  }}/>
                                </div>
                                {label.label}
                              </CommandItem>
                            )
                          })}
                        </CommandGroup>
                        {newCardLabels.size > 0 && (
                          <>
                            <CommandSeparator />
                            <CommandItem
                              style={{
                                justifyContent:"center",
                                textAlign:"center"
                              }}
                              onSelect={() => setNewCardLabels(new Set())}
                            >
                              Clear labels
                            </CommandItem>
                          </>
                        )}

                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>
              </div>
            </div>
          </div>

          <div className="flex gap-2">
            <Popover>
              {/* <Popover open={isLabelPopoverOpen} onOpenChange={setIsLabelPopoverOpen}> */}
              <PopoverTrigger asChild>
                <button
                  className="border-dashed justify-start"
                  onClick={ () => {
                  }}
                >
                  <PlusCircledIcon style={{
                    marginRight:"0.5rem",
                    height:"1rem",
                    width:"1rem",
                  }}/>
                  Labels
                  {/* NOTE: comment this out if want popover to not close due to re-render */}
                  {/* NOTE: after testing, it seems it is caused by having popover inside
                  a dialog */}
                  {newCardLabels.size > 0 && (
                    <>
                      <Separator
                        style={{
                          marginLeft:"0.5rem",
                          marginRight:"0.5rem"
                        }}
                        orientation="vertical"
                      />
                      {initialLabels
                        .filter((label) => newCardLabels.has(label.value))
                        .map((label) => (
                          <Badge
                            style={{
                              marginLeft:"0.25rem"
                            }}
                            key={label.value}
                            variant="outline"
                            className=""
                          >
                            {label.label}
                          </Badge>
                        ))
                      }
                    </>
                  )}
                </button>
              </PopoverTrigger>
              <PopoverContent
                style={{ width:"12rem",
                }}
                className="z-50" align="start">
                <Command className="rounded-lg border shadow-md">
                  <CommandInput placeholder="add labels" />
                  <CommandList>
                    <CommandEmpty>
                      No labels found.
                    </CommandEmpty>
                    <CommandGroup heading="">
                      {initialLabels.map((label) => {
                        const isSelected = newCardLabels.has(label.value);
                        return (
                          <CommandItem
                            key={label.value}
                            onSelect={() => {
                              /* NOTE: add does not close the popover, remove does,
                              the check in popoverTrigger button is responsible */
                              if (isSelected) {
                                removeCardLabel(label.value);
                                /* setIsLabelPopoverOpen(true); */
                              }
                              else {
                                addCardLabel(label.value);
                                /* setIsLabelPopoverOpen(true); */
                              }
                              console.log(label.value);
                            }}
                          >
                            <div style={{
                              display:"flex",
                              justifyContent:"center",
                              alignItems:"center",
                              height:"1rem",
                              width:"1rem",
                              borderRadius: "calc(var(--radius) - 4px)",
                              borderWidth:"1px",
                              marginRight:"0.5rem",
                              background:isSelected ? "hsla(var(--base06))" : "transparent",
                              color:"hsla(var(--black))"
                            }}>
                              <CheckIcon style={{
                                height:"1rem",
                                width:"1rem",
                                visibility:isSelected ? "visible" : "hidden",
                              }}/>
                            </div>
                            {label.label}
                          </CommandItem>
                        )
                      })}
                    </CommandGroup>
                    {newCardLabels.size > 0 && (
                      <>
                        <CommandSeparator />
                        <CommandItem
                          style={{
                            justifyContent:"center",
                            textAlign:"center"
                          }}
                          onSelect={() => setNewCardLabels(new Set())}
                        >
                          Clear labels
                        </CommandItem>
                      </>
                    )}

                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
          </div>

          <div className="flex-column gap-2">
            <Label htmlFor="cardDescription" className="">
              Description
            </Label>
            {/* TODO: replace this with Textarea */}
            <input
              style={{
                height:"5rem"
              }}
              id="username"
              /* value="@peduarte" */
              placeholder="description go here..."
              className=""
            />
          </div>

        </div>
        <DialogFooter>
          <button
            type="submit"
            onClick={() => {
              console.log(newCardTitle);
              console.log(newCardLabels);
              console.log(newCardStatus);
              // description, priority,...
            }}
          >
            Submit
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
