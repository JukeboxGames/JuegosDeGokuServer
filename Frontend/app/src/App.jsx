import React, { useEffect, useState } from "react";
import { socket } from "./socket";
import GridSquare from "./components/GridSquare";
import GridSquareMap from "./components/GridSquareMap";
import "./App.css";

/**
 * socket.emit() -> manda mensaje al server
 * socket.on() -> recibe mensaje del server
 * siempre refresca la pantalla antes de testing,
 * si solo compilas se suscribe varias veces al evento y se multiplica
 */

export default function App() {
  const [SocketId, setSocketId] = useState();
  const [Username, setUsername] = useState("");
  const [isAssassin, setAssassin] = useState(false);
  const [isConnected, setConnected] = useState(socket.connected);
  const [playerPos, setPosition] = useState(655);
  const [assasinPos, setAssasinPosition] = useState(650);
  const [gameStarted, setStarted] = useState(false);
  const [gameData, setGameData] = useState([]);
  const [endGame, setEndGame] = useState();
  const [playerDist, setDist] = useState(1000);
  const [trapPositions, setTrapPosition] = useState([]);
  const [clonePosition, setClonePosition] = useState(10000);
  const [doorPositions, setDoorPosition] = useState([]);
 
  const array = Array.from({ length: 1156 }, (_, index) => index + 1);

  const divsSurvivor = [
    { value: "", isButton: false },
    {
      value: 1,
      isButton: true,
      picture: "https://imgur.com/svgYARg.png",
    },
    { value: "", isButton: false },
    { value: 4, isButton: true, picture: "https://imgur.com/RADhXx3.png" },
    { value: "", isButton: false },
    { value: 2, isButton: true, picture: "https://imgur.com/ymUdxC8.png" },
    { value: "", isButton: false },
    { value: 3, isButton: true, picture: "https://imgur.com/tB9gj7o.png" },
    { value: "", isButton: false },
  ];
  const divsAssasin = [
    { value: 5, isButton: true, picture: "https://imgur.com/WI02Zwa.png" },
    {
      value: 1,
      isButton: true,
      picture: "https://imgur.com/WSngcZE.png",
    },
    { value: 6, isButton: true, picture: "https://imgur.com/IUPYNxS.png" },
    { value: 4, isButton: true, picture: "https://imgur.com/HEkx73j.png" },
    { value: "", isButton: false, picture: "https://imgur.com/z9WYpEi.png" },
    { value: 2, isButton: true, picture: "https://imgur.com/ZZ4Lesf.png" },
    { value: 8, isButton: true, picture: "https://imgur.com/fBwL57d.png" },
    { value: 3, isButton: true, picture: "https://imgur.com/cvaTEoI.png" },
    { value: 7, isButton: true, picture: "https://imgur.com/z9WYpEi.png" },
  ];

  const welcomeUrl = "https://imgur.com/FOcGwBb.png";
  const connectUrl = "https://imgur.com/YiaR7dl.png";

  const SendDirection = (dir) => {
    if (dir) socket.emit("direccion", dir);
  };

  useEffect(() => {
    //TODO: encontrar una buena forma de recibir mensajes
    // De esta forma por alguna razon lo recibe doble
    socket.on("join_game", (sId) => {
      setSocketId(sId);
    });

    socket.on("assassin", () => {
      setAssassin(true);
    });

    socket.on("startgame", (data) => {
      console.log('game started')
      const json = JSON.parse(data);
      setGameData(json.list);
      setStarted(true);
    });

    socket.on("update", (data) => {
      const datos = JSON.parse(data);
      setGameData(datos.list);
      setPosition(datos.list[0].tile);
      setAssasinPosition(datos.list[1].tile);
    });

    socket.on("endgame", (msg) => {
      console.log('engame');
      setEndGame(msg);
    });
  });

  useEffect(() => {
    console.log(gameData);
    if(gameData){
      const traps = gameData.filter((dato) => dato.name=='trap').map((dato) => dato.tile);
      console.log("traps: ", traps);
      const clone = gameData.filter((dato) => dato.name=='clone').map((dato) => dato.tile)[0];
      console.log("clone: ", clone);
      setTrapPosition(traps);

      const doors = gameData.filter((dato) => dato.name=='door').map((dato) => dato.tile);
      setDoorPosition(doors);
      setClonePosition(clone?clone:10000);
    }
  }, [gameData])

  useEffect(() => {
    const calculateDistance = (pPos, ePos, cPos) => {
      const xDist = Math.pow(Math.abs((pPos % 34) - (ePos % 34)), 2);
      const yDist = Math.pow(Math.abs(pPos / 34 - ePos / 34), 2);
      const aDist = Math.sqrt(xDist + yDist);

      const cxDist = Math.pow(Math.abs((pPos % 34) - (cPos % 34)), 2);
      const cyDist = Math.pow(Math.abs(pPos / 34 - cPos / 34), 2); 
      const cDist = Math.sqrt(cxDist + cyDist);
      
      return aDist < cDist ? aDist : cDist;
    };

    setDist(calculateDistance(playerPos, assasinPos, clonePosition));
  }, [playerPos, assasinPos, clonePosition]);

  return (
    <div>
      {endGame && (
        <div className="inputFields">
          <img
            className="welcomeImage"
            src={
              endGame == "assassin"
                ? "https://imgur.com/8JLODwZ.png"
                : "https://imgur.com/XlyRSty.png"
            }
          ></img>
          <button
            className="connectButton"
            onClick={() => {
              setAssassin(false);
              setStarted(false);
              setEndGame();
            }}
          >
            <img
              className="welcomeImage"
              src={"https://imgur.com/bFYT4YX.png"}
            ></img>
          </button>
        </div>
      )}

      {!endGame && !isConnected && (
        <div className="inputFields">
          <img className="welcomeImage" src={welcomeUrl}></img>
          <input
            className="nickname"
            onChange={(e) => {
              setUsername(e.target.value);
            }}
            placeholder="Nickname: "
          ></input>
          <button
            className="connectButton"
            onClick={() => {
              socket.connect();
              socket.emit("join_game", Username); // No checa por usernames repetidos lol(no importa porque de todos modos tiene id)
              setConnected(true);
            }}
          >
            <img className="welcomeImage" src={connectUrl}></img>
          </button>
        </div>
      )}

      {!endGame && isConnected && !gameStarted && (
        <div>
          <div className="headerBar">Waiting for game to start...</div>
          <div className="grid-container-lobby">
            <img className="lobbyImage" src="https://imgur.com/IxrGBiZ.gif" />
            <img className="lobbyImage" src="https://imgur.com/5lFxxj1.gif" />
          </div>
        </div>
      )}

      {!endGame && isConnected && gameStarted && (
        <>
          <div className="headerBar">
            {isAssassin ? (
              <img
                src="https://imgur.com/zpv4nFn.png"
                style={{ height: "inherit", aspectRatio: "initial" }}
              ></img>
            ) : (
              <img
                src="https://imgur.com/YGNS1eW.png"
                style={{ height: "inherit", aspectRatio: "initial" }}
              ></img>
            )}
          </div>
          {isAssassin ? (
            <div className="grid-container-map">
              {array.map((val, index) => {
                index = index + 1;
                return (
                  <GridSquareMap
                    key={index}
                    survivor={playerPos == index}
                    assasin={assasinPos == index}
                    trap={trapPositions.includes(index)}
                    clone={clonePosition == index}
                    door={doorPositions.includes(index)}
                    in={index}
                  />
                );
              })}
            </div>
          ) : (
            <div>
              <div className="grid-container-lobby">
                {playerDist > 10 && <img
                  className="lobbyImage"
                  src="https://imgur.com/hWW7uRg.gif"
                />}
                {playerDist > 5 && playerDist <= 10 && <img
                  className="lobbyImage"
                  src="https://imgur.com/FqB2y3c.gif"
                />}
                {playerDist <= 5 && <img
                  className="lobbyImage"
                  src="https://imgur.com/yMq5bYT.gif"
                />}
              </div>
            </div>
          )}

          <div className="grid-container-dpad">
            {isAssassin
              ? divsAssasin.map((val, index) => {
                  return (
                    <GridSquare
                      params={val}
                      key={index}
                      index={index}
                      onClick={() => {
                        SendDirection(val.value);
                      }}
                    />
                  );
                })
              : divsSurvivor.map((val, i) => (
                  <GridSquare
                    params={val}
                    index={i}
                    onClick={() => {
                      SendDirection(val.value);
                    }}
                  />
                ))}
          </div>
        </>
      )}
    </div>
  );
}
