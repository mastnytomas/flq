import { Player } from '../config/config';

export default function transformData(data: { [position: string]: string }): Player[] {
  const transformedData: Player[] = [];
  let id = 1;
  for (const position in data) {
    const name = data[position];
    const player: Player = {
      id,
      position,
      name,
      guessed: false,
      correctChars: [],
      wrongChars: [],
    };

    transformedData.push(player);
    id++;
  }
  return transformedData;
}
