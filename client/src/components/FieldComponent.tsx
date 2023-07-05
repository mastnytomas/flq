import { Button, Card, Col, Input, Row } from 'antd';
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
  const [submittedChars, setSubmittedChars] = useState<string[]>([]);
  const [correctChars, setCorrectChars] = useState<string[]>([]);
  const [wrongChars, setWrongChars] = useState<string[]>([]);

  useEffect(() => {
    const storage = localStorage.getItem('lineup' + paramsId);
    if (storage) {
      const storageData = JSON.parse(storage);
      if (storageData) {
        setLineup(storageData);
      } else {
        setLineup(selectedLineup);
      }
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

  useEffect(() => {
    if (selectedPlayer) {
      setSubmittedChars([]);
      setCorrectChars(selectedPlayer.correctChars);
      setWrongChars(selectedPlayer.wrongChars);
    }
  }, [selectedPlayer]);

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
          : undefined,
      );
      setSubmittedChars([]);
    }
    if (selectedPlayer) {
      const correct: string[] = correctChars;
      const wrong: string[] = wrongChars;
      for (const char of submittedChars) {
        if (selectedPlayer.name.toUpperCase().includes(char)) {
          correct.push(char);
        } else {
          wrong.push(char);
        }
      }
      setCorrectChars(correct);
      setWrongChars(wrong);
      const key = selectedPlayer.id;
      setLineup((prevState) =>
        prevState
          ? {
              ...prevState,
              players: Array.isArray(prevState.players)
                ? prevState.players.map((el) =>
                    el.id === key
                      ? { ...el, correctChars: correctChars, wrongChars: wrongChars }
                      : el,
                  )
                : prevState.players,
            }
          : undefined,
      );
    }
    setGuessInput('');
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setGuessInput(e.target.value);
  };

  const handleDeleteOneCharacter = () => {
    setGuessInput((prevInput) => prevInput.slice(0, -1));
  };

  const handleDeleteAllCharacters = () => {
    setGuessInput('');
  };

  const handleKeyClick = (key: string) => {
    setGuessInput((prevInput) => prevInput + key);
    setSubmittedChars((prevChars) => [...prevChars, key]);
  };

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
                    src='/jersey.png'
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

  const renderKeyboard = () => {
    const keyboardRows = [
      ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
      ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
      ['Z', 'X', 'C', 'V', 'B', 'N', 'M'],
    ];
    return (
      <div style={{ marginTop: 20 }}>
        {keyboardRows.map((row, rowIndex) => (
          <div key={rowIndex} style={{ display: 'flex' }}>
            {row.map((key) => (
              <Button
                key={key}
                type='text'
                onClick={() => handleKeyClick(key)}
                style={{
                  fontWeight: 'bold',
                  margin: 2,
                  width: 50,
                  color: 'black',
                  backgroundColor: guessInput.includes(key)
                    ? 'lightblue'
                    : correctChars?.includes(key)
                    ? 'lime'
                    : wrongChars?.includes(key)
                    ? 'lightcoral'
                    : 'gray',
                }}
                disabled={
                  selectedPlayer &&
                  (guessInput?.length >= selectedPlayer.name.length || wrongChars?.includes(key))
                }
              >
                {key}
              </Button>
            ))}
          </div>
        ))}
        <Row>
          <Col>
            <Button
              type='text'
              onClick={handleDeleteOneCharacter}
              style={{ color: 'black', margin: 2, width: 120, backgroundColor: 'white' }}
            >
              Backspace
            </Button>
          </Col>
          <Col>
            <Button
              type='text'
              onClick={handleDeleteAllCharacters}
              style={{ color: 'black', margin: 2, width: 80, backgroundColor: 'white' }}
            >
              Clear
            </Button>
          </Col>
          <Col>
            <Button
              type='text'
              onClick={handleGuessSubmit}
              style={{ color: 'black', margin: 2, width: 120, backgroundColor: 'white' }}
            >
              Submit
            </Button>
          </Col>
        </Row>
      </div>
    );
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
            {success ? (
              <>
                <Card
                  headStyle={{ backgroundColor: 'lime', color: 'black' }}
                  title='Successfully guessed!'
                >
                  <p>Position: {selectedPlayer.position}</p>
                  <p style={{ fontWeight: 'bold' }}>Name: {selectedPlayer.name}</p>
                </Card>
              </>
            ) : (
              <>
                <Card title='Guessing player:'>
                  <p>Position: {selectedPlayer.position}</p>
                  <p>Name length: {selectedPlayer.name.length}</p>
                  <label>
                    Enter player's name:
                    <Input
                      disabled={true}
                      value={guessInput}
                      onChange={handleInputChange}
                      maxLength={selectedPlayer.name.length}
                    />
                  </label>
                  <br />
                  {renderKeyboard()}
                </Card>
              </>
            )}
          </div>
        )}
      </div>
    </>
  );
};

export default FieldComponent;
