const express = require('express');
const fs = require('fs');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

app.post('/saveData', (req, res) => {
  const data = req.body;
  const formattedData = JSON.stringify(data, null, 2);

  fs.readFile('data.json', 'utf8', (err, fileContent) => {
    if (err) {
      console.error('Error reading the data.json file:', err);
      res.status(500).send('Error saving data.');
      return;
    }
    let updatedContent = fileContent.trim();
    if (updatedContent.endsWith(']')) {
      updatedContent = updatedContent.slice(0, -1);
    }
    updatedContent += ',' + formattedData + ']';
    fs.writeFile('data.json', updatedContent, 'utf8', err => {
      if (err) {
        console.error('Error saving data:', err);
        res.status(500).send('Error saving data.');
      } else {
        console.log('The data was stored in the data.json file');
        res.send('The data has been successfully saved.');
      }
    });
  });
});

app.get('/loadData', (req, res) => {
  fs.readFile('data.json', 'utf8', (err, data) => {
    if (err) {
      res.status(500).send('Error reading data.');
    } else {
      try {
        const teamLineups = JSON.parse(data);
        console.log('The data was loaded from the data.json file.');
        const transformedData = teamLineups.map((team) => {
          return {
            id: team.id,
            name: team.name,
            coach: team.coach,
            description: team.description,
            year: team.year,
            opponent: team.opponent,
            formation: team.formation,
            players: team.players.map((player) => {
              return {
                id: player.id,
                position: player.position,
                name: player.name,
                guessed: false
              };
            })
          };
        });
        res.send(transformedData);
      } catch (parseError) {
        console.error('Data parsing error:', parseError);
        res.status(500).send('Data parsing error.');
      }
    }
  });
});

const port = 3001;
app.listen(port, () => {
  console.log(`The server is running on http://localhost:${port}`);
});