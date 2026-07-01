import { useEffect, useState } from "react";

export default function LiveFeed() {

  const [messages, setMessages] = useState([]);

  useEffect(() => {

    let socket;
    try {
      socket = new WebSocket(
        "ws://127.0.0.1:8000/ws"
      );

      socket.onmessage = (event) => {
        setMessages((prev) => [
          event.data,
          ...prev,
        ].slice(0, 20));
      };

      socket.onerror = () => {
        console.warn(
          "WebSocket unavailable"
        );
      };

    } catch (error) {
      console.warn(
        "WebSocket connection failed",
        error
      );
    }

    return () => {
      if (socket) {
        socket.close();
      }
    };
  }, []);

  return (

    <div
      className="
        bg-white dark:bg-slate-900
        border border-slate-800
        rounded-2xl
        p-4
      "
    >

      <h3
        className="
          text-white font-semibold
          mb-4
        "
      >
        Live Feed
      </h3>

      <div className="space-y-2">

        {messages.length === 0 && (

          <div
            className="
              text-slate-500 text-sm
            "
          >
            Waiting for live events...
          </div>

        )}

        {messages.map(
          (msg, index) => (

            <div
              key={index}
              className="
                text-sm text-slate-300
                bg-slate-950
                rounded-lg p-2
              "
            >
              {msg}
            </div>
          )
        )}
      </div>
    </div>
  );
}