import { Select } from 'antd';
import { useState, useEffect } from 'react';
import { Col, Row } from 'antd';
import { Card, Input, Button, Modal } from 'antd';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';
import { PLAYER_POSITIONS, FORMATIONS } from '../config/config';

interface FormData {
  id: string;
  name: string;
  coach: string;
  description: string;
  year: number;
  opponent: string;
  formation: string;
  players: any[];
}

interface Player {
  id: number;
  position: string;
  name: string;
  guessed: boolean;
}

const Create = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const defaulFormation = '4-3-3';
  const [playerData, setPlayerData] = useState<{ [key: string]: string }>({});
  const [formation, setFormation] = useState(defaulFormation);
  const [selectedFormation, setSelectedFormation] = useState();
  const [data, setData] = useState<FormData>({
    id: '',
    name: '',
    coach: '',
    description: '',
    year: 0,
    opponent: '',
    formation: '',
    players: [],
  });

  function transformData(data: { [position: string]: string }): Player[] {
    const transformedData: Player[] = [];
    let id = 1;

    for (const position in data) {
      const name = data[position];

      const player: Player = {
        id,
        position,
        name,
        guessed: false,
      };

      transformedData.push(player);
      id++;
    }

    return transformedData;
  }

  const handleChangePlayers = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setPlayerData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleModalOk = () => {
    setIsModalOpen(false);
    window.location.href = `/`;
  };

  useEffect(() => {
    setSelectedFormation(FORMATIONS.find((f) => f.value === formation));
    if (selectedFormation) {
      const updatedPlayerData: { [key: string]: string } = {};

      selectedFormation.players.forEach((player) => {
        if (playerData[player]) {
          updatedPlayerData[player] = playerData[player];
        }
      });

      setPlayerData(updatedPlayerData);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formation]);

  const playerInputs = FORMATIONS.map((form) => {
    if (form.value === formation) {
      return form.players.map((player) => (
        <>
          {player}
          <Input
            key={`${player}`}
            name={`${player}`}
            placeholder={`${player}`}
            defaultValue={playerData[`${player}`] || ''}
            onChange={handleChangePlayers}
          />
        </>
      ));
    }
    return null;
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>, attribute: keyof FormData) => {
    const { value } = e.target;
    setData((prevData) => ({
      ...prevData,
      [attribute]: value,
    }));
  };

  const handleSave = () => {
    data.id = uuidv4();
    data.formation = formation;
    data.players = transformData(playerData);
    console.log('Uložená data:', data);
    axios
      .post('http://localhost:3001/saveData', data)
      .then(() => {
        setIsModalOpen(true);
      })
      .catch((error) => {
        console.error('Chyba při ukládání dat:', error);
      });
  };

  const isFormValid = () => {
    return (
      data.name !== '' &&
      data.coach !== '' &&
      data.description !== '' &&
      data.year !== 0 &&
      data.opponent !== '' &&
      Object.values(playerData).every((value) => value !== '')
    );
  };

  const renderPlayers = () => {
    const positions = PLAYER_POSITIONS.find((p) => p.value === formation);
    console.log(positions);
    if (!positions || !positions.players) {
      return null;
    }
    const playerKeys = Object.keys(positions.players);
    return playerKeys.map((playerKey) => {
      const player = positions.players[playerKey];
      const { top, left } = player;
      return (
        <div
          key={playerKey}
          style={{
            position: 'absolute',
            top,
            left,
            transform: 'translate(-50%, -50%)',
          }}
        >
          <div>
            <div aria-hidden='true'>
              <div
                style={{ textAlign: 'center', marginTop: -1, color: 'black', fontWeight: 'bold' }}
              >
                {playerKey}
              </div>
              <img
                src='../jersey.png'
                alt='Dres ikona'
                style={{ width: 40, height: 40, cursor: 'pointer' }}
              />
            </div>
            <div style={{ textAlign: 'center', marginTop: -1, color: 'black', fontWeight: 'bold' }}>
              {playerData[playerKey] || ''}
            </div>
          </div>
        </div>
      );
    });
  };

  return (
    <>
      <Modal
        title='Basic Modal'
        open={isModalOpen}
        onOk={handleModalOk}
        cancelButtonProps={{ style: { display: 'none' } }}
      >
        <h2 style={{ color: 'lime' }}>Successfully!</h2>
        <h3>You have created a new squad lineup.</h3>
        <h4>
          Lets hope people sweat when they remember who played for <bold>{data.name}</bold> against
          <bold>{data.opponent}</bold> in {data.year}
        </h4>
      </Modal>
      <a href='/'>
        <Button>Back</Button>
      </a>
      <Row style={{ margin: 50 }}>
        <Col span={6}>
          <Card title='Team configuration' bordered={false} style={{ width: 300 }}>
            Formation
            <br />
            <Select
              defaultValue={defaulFormation}
              style={{ width: 120 }}
              onChange={(e) => setFormation(e)}
              options={FORMATIONS}
            />
            <br />
            Team
            <Input onChange={(e) => handleChange(e, 'name')} placeholder='Chelsea FC' />
            Coach
            <Input onChange={(e) => handleChange(e, 'coach')} placeholder='Roberto Di Matteo' />
            Description
            <Input
              onChange={(e) => handleChange(e, 'description')}
              placeholder='UEFA Champions League final'
            />
            Year
            <Input<number> onChange={(e) => handleChange(e, 'year')} placeholder='2012' />
            Opponent
            <Input onChange={(e) => handleChange(e, 'opponent')} placeholder='Bayern Munchen' />
          </Card>
        </Col>
        <Col span={6}>
          <Card title='Players' bordered={false} style={{ width: 300 }}>
            {playerInputs}
          </Card>
        </Col>
        <Col span={4}>
          <div id='field'>
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
          </div>
        </Col>
      </Row>
      <Button type='primary' onClick={handleSave} disabled={!isFormValid()}>
        Save squad
      </Button>
    </>
  );
};

export default Create;
