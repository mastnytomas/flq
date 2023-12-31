import { Button, Card, Col, Input, Modal, Row, Select, Typography } from 'antd';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import { FORMATIONS, Formation, PLAYER_POSITIONS, SERVER_URL } from '../config/config';
import transformData from '../utils/TransformData';

const { Text } = Typography;

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

interface PlayerPosition {
  top: string;
  left: string;
}

const Create = () => {
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const defaulFormation = '4-3-3';
  const [playerData, setPlayerData] = useState<{ [key: string]: string }>({});
  const [formation, setFormation] = useState(defaulFormation);
  const [selectedFormation, setSelectedFormation] = useState<Formation>();
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

  const handleChangePlayers = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setPlayerData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleModalOk = () => {
    setIsModalOpen(false);
    navigate(`/`);
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
    const cpy = { ...data, id: uuidv4(), formation: formation, players: transformData(playerData) };
    axios
      .post(SERVER_URL + 'saveData', cpy)
      .then(() => {
        setIsModalOpen(true);
      })
      .catch((error) => {
        console.error('Error saving data:', error);
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
    if (!positions || !positions.players) {
      return null;
    }
    const playerKeys = Object.keys(positions.players);
    return playerKeys.map((playerKey) => {
      const player: PlayerPosition = positions.players[playerKey];
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
              <img src='/jersey.png' alt='Dres ikona' style={{ width: 40, height: 40 }} />
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
          Lets hope people sweat when they remember who played for <Text strong>{data.name}</Text>{' '}
          against <Text strong>{data.opponent}</Text> in {data.year}
        </h4>
      </Modal>
      <a href='/'>
        <Button>Back</Button>
      </a>
      <Row style={{ margin: 50 }}>
        <Col span={4}>
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
            <Input type='number' onChange={(e) => handleChange(e, 'year')} placeholder='2012' />
            Opponent
            <Input onChange={(e) => handleChange(e, 'opponent')} placeholder='Bayern Munchen' />
          </Card>
        </Col>
        <Col span={4}>
          <Card title='Players' bordered={false} style={{ width: 300 }}>
            {playerInputs}
          </Card>
        </Col>
        <Col span={6}>
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
