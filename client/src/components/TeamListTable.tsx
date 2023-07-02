import { Table } from 'antd';
import React from 'react';
import { Player } from '../config/config';

interface Team {
  id: string;
  name: string;
  coach: string;
  description: string;
  year: string;
  opponent: string;
  formation: string;
  players: Player[];
}

interface Props {
  teams: Team[];
}

const TeamListTable: React.FC<Props> = ({ teams }) => {
  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: 'Guessing team',
      dataIndex: 'name',
      key: 'id',
      sorter: (a: Team, b: Team) => a.name.localeCompare(b.name),
    },
    {
      title: 'Opponent',
      dataIndex: 'opponent',
      key: 'id',
      sorter: (a: Team, b: Team) => a.opponent.localeCompare(b.opponent),
    },
    {
      title: 'Match description',
      dataIndex: 'description',
      key: 'id',
    },
    {
      title: 'Coach',
      dataIndex: 'coach',
      key: 'id',
    },
    {
      title: 'Year',
      dataIndex: 'year',
      key: 'id',
      sorter: (a: Team, b: Team) => parseInt(a.year) - parseInt(b.year),
    },
  ];

  const handleRowClick = (record: Team) => {
    window.location.href = `/guess/${record.id}`;
  };

  return (
    <Table<Team>
      dataSource={teams}
      columns={columns}
      onRow={(record) => ({
        onClick: () => handleRowClick(record),
      })}
    />
  );
};

export default TeamListTable;
