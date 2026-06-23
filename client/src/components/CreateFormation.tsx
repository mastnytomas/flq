import { useState, useRef } from 'react';
import { Button, Card, Input, Modal, Typography } from 'antd';

const { Text } = Typography;

const DEFAULT_FORMATION = '4-3-3';
const DEFAULT_POSITIONS = {
  GK: { top: '50%', left: '16%' },
  CB1: { top: '40%', left: '25%' },
  CB2: { top: '60%', left: '25%' },
  LB: { top: '20%', left: '25%' },
  RB: { top: '80%', left: '25%' },
  CM1: { top: '30%', left: '45%' },
  CM2: { top: '50%', left: '45%' },
  CM3: { top: '70%', left: '45%' },
  LW: { top: '20%', left: '72%' },
  ST: { top: '50%', left: '72%' },
  RW: { top: '80%', left: '72%' },
};

const CreateFormation = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [value, setValue] = useState(DEFAULT_FORMATION);
  const [players, setPlayers] = useState<string[]>(Object.keys(DEFAULT_POSITIONS));
  const [playerInput, setPlayerInput] = useState('');
  const [positions, setPositions] =
    useState<{ [key: string]: { top: string; left: string } }>(DEFAULT_POSITIONS);
  const fieldRef = useRef<HTMLDivElement>(null);

  const handleAddPlayer = () => {
    if (playerInput.trim() !== '') {
      setPlayers([...players, playerInput.trim()]);
      setPositions({ ...positions, [playerInput.trim()]: { top: '50%', left: '50%' } });
      setPlayerInput('');
    }
  };

  const handleDragStart = (player: string, e: React.DragEvent<HTMLDivElement>) => {
    e.dataTransfer.setData('player', player);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    const player = e.dataTransfer.getData('player');
    const rect = fieldRef.current?.getBoundingClientRect();
    if (!rect) return;
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setPositions((prev) => ({
      ...prev,
      [player]: { top: `${y}%`, left: `${x}%` },
    }));
  };

  const handleSave = async () => {
    if (!value || players.length === 0) return;
    try {
      setIsModalOpen(true);
      setValue(DEFAULT_FORMATION);
      setPlayers(Object.keys(DEFAULT_POSITIONS));
      setPositions(DEFAULT_POSITIONS);
    } catch (error) {
      console.error('Error saving formation:', error);
    }
  };

  return (
    <>
      <Modal
        title='Formation created'
        open={isModalOpen}
        onOk={() => setIsModalOpen(false)}
        cancelButtonProps={{ style: { display: 'none' } }}
      >
        <h2 style={{ color: 'lime' }}>Successfully!</h2>
        <h3>
          You have created a new formation: <Text strong>{value}</Text>
        </h3>
        <h4>Players: {players.join(', ')}</h4>
      </Modal>
      <Card
        title='Create new formation'
        style={{ maxWidth: 900, margin: 'auto', marginBottom: 24 }}
      >
        <div style={{ display: 'flex', gap: 32, flexWrap: 'wrap', alignItems: 'flex-start' }}>
          <div style={{ minWidth: 320, flex: '1 1 320px' }}>
            <Text strong>Formation name (např. 4-3-3):</Text>
            <Input
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder='Formation name'
              style={{ marginBottom: 16 }}
            />
            <Text strong>Players (např. GK, CB1, CB2...):</Text>
            <Input
              value={playerInput}
              onChange={(e) => setPlayerInput(e.target.value)}
              placeholder='Player position'
              onPressEnter={handleAddPlayer}
              style={{ width: '70%', marginRight: 8, marginBottom: 8 }}
            />
            <Button onClick={handleAddPlayer}>Add</Button>
            <div style={{ marginTop: 16 }}>
              <Text>Current players:</Text>
              <div>
                {players.map((p, i) => (
                  <span key={i} style={{ marginRight: 8 }}>
                    {p}
                  </span>
                ))}
              </div>
            </div>
            <Button
              type='primary'
              onClick={handleSave}
              disabled={!value || players.length === 0}
              style={{ marginTop: 24 }}
            >
              Save formation
            </Button>
          </div>
          <div style={{ flex: '2 1 600px', minWidth: 320, maxWidth: 900 }}>
            <div
              ref={fieldRef}
              onDragOver={(e) => e.preventDefault()}
              onDrop={handleDrop}
              style={{
                position: 'relative',
                width: '100%',
                paddingTop: '77.7%',
                backgroundImage: 'url(/field.jpg)',
                backgroundRepeat: 'no-repeat',
                backgroundSize: 'cover',
                borderRadius: 16,
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
              }}
            >
              <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}>
                {players.map((player) => {
                  const pos = positions[player] || { top: '50%', left: '50%' };
                  return (
                    <div
                      key={player}
                      draggable
                      onDragStart={(e) => handleDragStart(player, e)}
                      style={{
                        position: 'absolute',
                        top: pos.top,
                        left: pos.left,
                        transform: 'translate(-50%, -50%)',
                        cursor: 'grab',
                        zIndex: 2,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                      }}
                    >
                      <div style={{ textAlign: 'center', color: 'black', fontWeight: 'bold' }}>
                        {player}
                      </div>
                      <img src='/jersey.png' alt='Dres ikona' style={{ width: 40, height: 40 }} />
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </Card>
    </>
  );
};

export default CreateFormation;
