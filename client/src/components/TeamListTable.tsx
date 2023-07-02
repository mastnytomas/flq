import { Table } from 'antd';
import React from 'react';
import { Squad } from '../config/config';

interface Props {
  teams: Squad[];
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
      sorter: (a: Squad, b: Squad) => a.name.localeCompare(b.name),
    },
    {
      title: 'Opponent',
      dataIndex: 'opponent',
      key: 'id',
      sorter: (a: Squad, b: Squad) => a.opponent.localeCompare(b.opponent),
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
      sorter: (a: Squad, b: Squad) => a.year - b.year,
    },
  ];

  const handleRowClick = (record: Squad) => {
    window.location.href = `/guess/${record.id}`;
  };

  return (
    <Table<Squad>
      dataSource={teams}
      columns={columns}
      onRow={(record) => ({
        onClick: () => handleRowClick(record),
      })}
    />
  );
};

export default TeamListTable;
