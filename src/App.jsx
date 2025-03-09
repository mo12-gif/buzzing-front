import React, { useState, useEffect } from "react";
import { io } from "socket.io-client";

const socket = io("https://buzzing-1.onrender.com"); // Replace with actual server URL

export default function BuzzerApp() {
  const [room, setRoom] = useState("");
  const [playerName, setPlayerName] = useState("");
  const [buzzedPlayer, setBuzzedPlayer] = useState(null);
  const [hasBuzzed, setHasBuzzed] = useState(false);
  const [isHost, setIsHost] = useState(false);

  useEffect(() => {
    socket.on("buzzed", (player) => {
      setBuzzedPlayer(player);
    });
    socket.on("reset", () => {
      setBuzzedPlayer(null);
      setHasBuzzed(false);
    });
  }, []);

  const joinRoom = () => {
    if (room && playerName) {
      socket.emit("joinRoom", { room, playerName });
    }
  };

  const buzz = () => {
    if (!buzzedPlayer) {
      socket.emit("buzz", { room, playerName });
      setHasBuzzed(true);
    }
  };

  const resetBuzzer = () => {
    socket.emit("reset", room);
  };

  return (
    <div className="flex flex-col items-center p-4">
      {!room ? (
        <div>
          <input
            type="text"
            placeholder="Enter Room Code"
            value={room}
            onChange={(e) => setRoom(e.target.value)}
            className="border p-2"
          />
          <input
            type="text"
            placeholder="Enter Your Name"
            value={playerName}
            onChange={(e) => setPlayerName(e.target.value)}
            className="border p-2 ml-2"
          />
          <button onClick={joinRoom} className="bg-blue-500 text-white p-2 ml-2">
            Join Game
          </button>
        </div>
      ) : (
        <div className="mt-4">
          {isHost ? (
            <button onClick={resetBuzzer} className="bg-red-500 text-white p-4">
              Reset Buzzer
            </button>
          ) : (
            <button
              onClick={buzz}
              disabled={hasBuzzed || buzzedPlayer}
              className={`p-6 text-white text-xl ${
                hasBuzzed || buzzedPlayer ? "bg-gray-400" : "bg-green-500"
              }`}
            >
              {buzzedPlayer ? "Someone Buzzed!" : "Buzz!"}
            </button>
          )}
        </div>
      )}
    </div>
  );
}
