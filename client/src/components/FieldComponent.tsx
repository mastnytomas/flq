import { useContext, useState, useEffect } from 'react';
import { Button } from 'antd';
import html2canvas from 'html2canvas';
import { useParams } from 'react-router-dom';
import { LineupsContext } from './LineupsContext';
import { PLAYER_POSITIONS } from '../config/config';

const FieldComponent = () => {
  const { teamLineups } = useContext(LineupsContext);
  const params = useParams();
  const paramsId = params.id;
  const selectedLineup = teamLineups.find((o) => o.id === paramsId);
  const storage = JSON.parse(localStorage.getItem('lineup' + paramsId));
  const [lineup, setLineup] = useState(storage ?? selectedLineup);
  const [allPlayersGuessed, setAllPlayersGuessed] = useState(
    lineup?.players.every((player) => player.guessed),
  );
  const [selectedPlayer, setSelectedPlayer] = useState(null);
  const [guessInput, setGuessInput] = useState('');
  const [success, setSuccess] = useState(false);

  const selectedFormation = PLAYER_POSITIONS.find(
    (formation) => formation.value === lineup?.formation,
  );

  const handlePlayerClick = (player) => {
    setSelectedPlayer(player);
    setGuessInput('');
    setSuccess(false);
  };

  const saveDivAsImage = () => {
    const divElement = document.getElementById('field');
    html2canvas(divElement).then((canvas) => {
      const fileName = `${lineup?.name}_${lineup?.year}.png`;
      const imgData = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.href = imgData;
      link.download = fileName;
      link.click();
    });
  };

  const handleGuessSubmit = (e) => {
    e.preventDefault();
    if (guessInput.toLowerCase() === selectedPlayer.name.toLowerCase()) {
      setSuccess(true);
      const key = selectedPlayer.id;
      setLineup((prevState) => ({
        ...prevState,
        players: prevState.players.map((el) => (el.id === key ? { ...el, guessed: true } : el)),
      }));
    }
    setGuessInput('');
  };

  const handleInputChange = (e) => {
    setGuessInput(e.target.value);
  };

  useEffect(() => {
    if (lineup) {
      localStorage.setItem('lineup' + lineup.id, JSON.stringify(lineup));
      setAllPlayersGuessed(lineup.players.every((player) => player.guessed));
    }
  }, [lineup]);

  const renderPlayers = () => {
    return lineup?.players.map((player) => {
      const positionData = selectedFormation?.players[player.position];
      if (!positionData) {
        return null;
      }
      const hiddenName = player.name.replaceAll(/./g, '*');
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
            <div onClick={() => !player.guessed && handlePlayerClick(player)} aria-hidden='true'>
              <img
                src='../jersey.png'
                alt='Dres ikona'
                style={{ width: 40, height: 40, cursor: 'pointer' }}
              />
            </div>
            {player.guessed ? (
              <div
                style={{ textAlign: 'center', marginTop: -1, color: 'black', fontWeight: 'bold' }}
              >
                {player.name}
              </div>
            ) : (
              <div>{hiddenName}</div>
            )}
          </div>
        </div>
      );
    });
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
