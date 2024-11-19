import { useState, useEffect } from "react";
import {
  Typography,
  Alert,
  Input,
  Button,
  Tabs,
  Tab,
  TabPanel,
  TabsHeader,
  TabsBody,
  Avatar,
} from "@material-tailwind/react";
import {
  ClipboardIcon,
  XMarkIcon,
  ChatBubbleLeftEllipsisIcon,
  StarIcon,
} from "@heroicons/react/24/outline";

export const LiveStream = ({
  bingoConfig,
  userUid,
  cardboardCode,
  logs,
  sendChat,
  message,
  setMessage,
  chat,
}) => {
  const [showAlert, setShowAlert] = useState(false);
  const [alertData, setAlertData] = useState({
    color: "blue",
    message: "",
  });

  const copyToClipboard = (text) => {
    navigator.clipboard
      .writeText(text)
      .then(() => {
        setShowAlert(true);
        setAlertData({
          color: "blue",
          message: "Código copiado en el portapapeles.",
        });
        setTimeout(() => {
          setShowAlert(false);
        }, 2000);
      })
      .catch((err) => console.error("Error al copiar el enlace:", err));
  };

  return (
    <div>
      {showAlert && (
        <Alert
          color={alertData.color}
          onClose={() => setShowAlert(false)}
          variant="gradient"
          className="fixed w-11/12 bottom-5 left-1/2 transform -translate-x-1/2 z-50 shadow"
        >
          {alertData.message}
        </Alert>
      )}
      <section>
        {bingoConfig && (
          <Accordion name={bingoConfig?.name}>
            <Typography
              variant="small"
              className="mb-1 gap-1 flex cursor-pointer"
              onClick={() => copyToClipboard(cardboardCode)}
            >
              <strong>Código de cartón:</strong> {cardboardCode}{" "}
              <ClipboardIcon className="h-5 w-5 cursor-pointer" />
            </Typography>
          </Accordion>
        )}
      </section>
      <section className="hidden sm:block">
        <SectionLiveStream />
      </section>
      <section className="mt-4 bg-gray-100 rounded">
        <Tabs>
          <TabsHeader>
            <Tab value="chat">
              <div className="flex items-center gap-2">
                <ChatBubbleLeftEllipsisIcon
                  className="h-5 w-5"
                  strokeWidth={2}
                />
                Chat
              </div>
            </Tab>
            <Tab value="logs">
              {" "}
              <div className="flex items-center gap-2">
                <StarIcon className="h-5 w-5" strokeWidth={2} />
                Eventos
              </div>
            </Tab>
          </TabsHeader>
          <TabsBody>
            <TabPanel value="chat">
              <div className="bg-white rounded shadow-md p-2">
                <div className="h-32 overflow-y-auto">
                  {chat
                    .sort((a, b) => new Date(a.date) - new Date(b.date))
                    .map((msg, index) => (
                      <div
                        key={index}
                        className={`flex m-2 shadow-md ${
                          msg.userId === userUid
                            ? "justify-end"
                            : "justify-start"
                        }`}
                      >
                        <div
                          className={`flex items-center gap-4 ${
                            msg.userId === userUid
                              ? "flex-row-reverse text-right"
                              : "text-left"
                          }`}
                        >
                          <Avatar
                            src="https://www.webiconio.com/_upload/255/image_255.svg"
                            alt="avatar"
                          />
                          <div>
                            <Typography variant="paragraph">{msg.userName}</Typography>
                            <Typography
                              variant="small"
                              color="gray"
                              className="font-normal"
                            >
                              {msg.message}
                            </Typography>
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
                <form onSubmit={sendChat}>
                  <div className="relative flex w-full">
                    <Input
                      type="text"
                      label="Enviar mensaje"
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      className="pr-20"
                      containerProps={{
                        className: "min-w-0",
                      }}
                    />
                    <Button
                      size="sm"
                      type="submit"
                      color={message ? "gray" : "blue-gray"}
                      disabled={!message}
                      onClick={sendChat}
                      className="!absolute right-1 top-1 rounded"
                    >
                      Enviar
                    </Button>
                  </div>
                </form>
              </div>
            </TabPanel>
            <TabPanel value="logs">
              <div className="bg-white p-3 rounded shadow-md">
                <Typography variant="h6" className="mb-2">
                  Logs
                </Typography>
                <div className="max-h-20 overflow-y-auto">
                  {logs &&
                    logs.length > 0 &&
                    logs.map((log, index) => (
                      <Typography key={index} variant="small" className="mb-1">
                        {log}
                      </Typography>
                    ))}
                </div>
              </div>
            </TabPanel>
          </TabsBody>
        </Tabs>
      </section>
    </div>
  );
};

const SectionLiveStream = () => {
  return (
    <div style={{ border: "1px solid black", width: "100%", height: "200px" }}>
      <iframe
        style={{ width: "100%", height: "100%" }}
        src="https://www.youtube.com/embed/x7gazu5rlT8?si=e-MiD73LRR3CHzMt"
        title="YouTube video player"
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        referrerPolicy="strict-origin-when-cross-origin"
        allowFullScreen
      ></iframe>
    </div>
  );
};

const Accordion = ({ name, children }) => {
  return (
    <div className="mb-1 bg-black rounded">
      <Typography
        variant="h6"
        color="white"
        className="pl-3 pt-2 uppercase text-sm md:text-base"
      >
        {name}
      </Typography>
      <div className="p-3 text-white">{children}</div>
    </div>
  );
};
