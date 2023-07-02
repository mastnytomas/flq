import { Button } from 'antd';
import html2canvas from 'html2canvas';
import { useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { PLAYER_POSITIONS, Player, Squad } from '../config/config';
import { LineupsContext, LineupsContextProps } from './LineupsContext';

const FieldComponent = () => {
  const { teamLineups } = useContext<LineupsContextProps>(LineupsContext);
  const params = useParams<{ id: string }>();
  const paramsId = params.id;
  const selectedLineup: Squad | undefined = teamLineups.find((o) => o.id === paramsId);
  const [lineup, setLineup] = useState<Squad | undefined>(undefined);
  const [allPlayersGuessed, setAllPlayersGuessed] = useState<boolean | undefined>(() => {
    if (lineup && lineup.players) {
      const playersArray = Array.isArray(lineup.players) ? lineup.players : [lineup.players];
      return playersArray.every((player) => player.guessed);
    }
    return undefined;
  });
  const [selectedPlayer, setSelectedPlayer] = useState<Player | undefined>(undefined);
  const [guessInput, setGuessInput] = useState<string>('');
  const [success, setSuccess] = useState(false);

  const selectedFormation = PLAYER_POSITIONS.find(
    (formation) => formation.value === lineup?.formation,
  );

  const handlePlayerClick = (player: Player) => {
    setSelectedPlayer(player);
    setGuessInput('');
    setSuccess(false);
  };

  const saveDivAsImage = () => {
    const divElement = document.getElementById('field');
    divElement &&
      html2canvas(divElement).then((canvas) => {
        const fileName = `${lineup?.name}_${lineup?.year}.png`;
        const imgData = canvas.toDataURL('image/png');
        const link = document.createElement('a');
        link.href = imgData;
        link.download = fileName;
        link.click();
      });
  };

  const handleGuessSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedPlayer && guessInput.toLowerCase() === selectedPlayer.name.toLowerCase()) {
      setSuccess(true);
      const key = selectedPlayer.id;
      setLineup((prevState) =>
        prevState
          ? {
              ...prevState,
              players: Array.isArray(prevState.players)
                ? prevState.players.map((el) => (el.id === key ? { ...el, guessed: true } : el))
                : prevState.players,
            }
          : undefined
      );
    }
    setGuessInput('');
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setGuessInput(e.target.value);
  };

  useEffect(() => {
    const storage = JSON.parse(localStorage.getItem('lineup' + paramsId) || '');
    if (storage) {
      setLineup(storage);
    } else {
      setLineup(selectedLineup);
    }
  }, [paramsId, selectedLineup]);

  useEffect(() => {
    if (lineup) {
      localStorage.setItem('lineup' + lineup.id, JSON.stringify(lineup));
      const playersArray = Array.isArray(lineup.players) ? lineup.players : [lineup.players];
      setAllPlayersGuessed(playersArray.every((player) => player.guessed));
    }
  }, [lineup]);

  const renderPlayers = () => {
    return lineup && Array.isArray(lineup.players)
      ? lineup.players.map((player: Player) => {
          const positionData = selectedFormation?.players[player.position];
          if (!positionData) {
            return null;
          }
          const hiddenName = '*'.repeat(player.name.length);
          const { top, left } = positionData;
          return (
            <div
              key={player.id}
              style={{
                position: 'absolute',
                top,
                left,
                transform: 'translate(-50%, -50%)',
              }}
            >
              <div>
                <div
                  onClick={() => !player.guessed && handlePlayerClick(player)}
                  aria-hidden='true'
                >
                  <img
                    src='../jersey.png'
                    alt='Dres ikona'
                    style={{ width: 40, height: 40, cursor: 'pointer' }}
                  />
                </div>
                {player.guessed ? (
                  <div
                    style={{
                      textAlign: 'center',
                      marginTop: -1,
                      color: 'black',
                      fontWeight: 'bold',
                    }}
                  >
                    {player.name}
                  </div>
                ) : (
                  <div>{hiddenName}</div>
                )}
              </div>
            </div>
          );
        })
      : null;
  };

  return (
    <>
      <div>
        <a href='/'>
          <Button>Back</Button>
        </a>
        <h3>{lineup?.name}</h3>
        <p>
          Coach: {lineup?.coach} | Year: {lineup?.year} | Opponent: {lineup?.opponent}
        </p>
        <p>Description: {lineup?.description}</p>
      </div>
      {allPlayersGuessed && (
        <>
          <h2 style={{ color: 'lime' }}>Success, You are a huge knower</h2>
          <Button onClick={saveDivAsImage}>Save</Button>
        </>
      )}
      <div id='field' style={{ display: 'flex', justifyContent: 'center', marginTop: 20 }}>
        <div
          style={{
            position: 'relative',
            width: 900,
            height: 700,
            backgroundImage: 'url(/field.jpg)',
            backgroundRepeat: 'no-repeat',
            backgroundSize: '900px 700px',
          }}
        >
          {renderPlayers()}
        </div>
        {selectedPlayer && (
          <div style={{ marginLeft: 20 }}>
            <h3>Guessing player:</h3>
            {success ? (
              <p>Successfully guessed!</p>
            ) : (
              <form onSubmit={handleGuessSubmit}>
                <label>
                  Enter players name:
                  <input type='text' value={guessInput} onChange={handleInputChange} />
                </label>
                <button type='submit'>Submit</button>
              </form>
            )}
          </div>
        )}
      </div>
    </>
  );
};

export default FieldComponent;
