import {
  Popover,
  PopoverHandler,
  PopoverContent,
  Chip,
  Button,
} from "@material-tailwind/react";
import { ClipboardIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { useState } from "react";

const InvitePopover = ({ invitationLink, bingoRoom }) => {
  const [popoverOpen, setPopoverOpen] = useState(false);

  const togglePopover = () => setPopoverOpen(!popoverOpen);

  const copyToClipboard = (text) => {
    navigator.clipboard
      .writeText(text)
      .then(() => alert("Enlace copiado al portapapeles"))
      .catch((err) => console.error("Error al copiar el enlace:", err));
  };

  return (
    <Popover
      open={popoverOpen}
      handler={togglePopover}
      animate={{
        mount: { scale: 1, y: 0 },
        unmount: { scale: 0, y: 25 },
      }}
      placement="left"
    >
      <PopoverHandler>
        <Button onClick={togglePopover} className="rounded-r-lg rounded-l-none">
          Invitar
        </Button>
      </PopoverHandler>

      <PopoverContent className="relative space-y-4 p-4 w-1/4 bg-white shadow-md rounded-md">
        <button
          className="absolute top-1 right-1 p-1 text-gray-500 hover:text-black"
          onClick={togglePopover}
        >
          <XMarkIcon className="h-5 w-5" />
        </button>

        <div className="m-auto">
          <Chip
            variant="outlined"
            className="flex items-center justify-between normal-case mb-2"
            value={
              <span
                className="flex items-center gap-2"
                onClick={() => copyToClipboard(invitationLink)}
              >
                <ClipboardIcon className="h-5 w-5 cursor-pointer" />
                <span className="text-center">{invitationLink}</span>
              </span>
            }
            style={{
              maxWidth: "100%",
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          />
          {bingoRoom && (
            <Chip
              variant="outlined"
              className="normal-case text-center"
              value={
                <span
                  className="flex items-center gap-2"
                  onClick={() => copyToClipboard(bingoRoom.roomCode)}
                >
                  <ClipboardIcon className="h-5 w-5 cursor-pointer" />
                  <span className="text-center">
                    Código de sala: {bingoRoom.roomCode}
                  </span>
                </span>
              }
              style={{
                maxWidth: "100%",
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            />
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default InvitePopover;
