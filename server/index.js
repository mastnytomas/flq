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
      console.error('Chyba při čtení souboru data.json:', err);
      res.status(500).send('Chyba při ukládání dat.');
      return;
    }
    let updatedContent = fileContent.trim();
    if (updatedContent.endsWith(']')) {
      updatedContent = updatedContent.slice(0, -1);
    }
    updatedContent += ',' + formattedData + ']';
    fs.writeFile('data.json', updatedContent, 'utf8', err => {
      if (err) {
        console.error('Chyba při ukládání dat:', err);
        res.status(500).send('Chyba při ukládání dat.');
      } else {
        console.log('Data byla uložena do souboru data.json');
        res.send('Data byla úspěšně uložena.');
      }
    });
  });
});

app.get('/loadData', (req, res) => {
  fs.readFile('data.json', 'utf8', (err, data) => {
    if (err) {
      console.error('Chyba při čtení dat:', err);
      res.status(500).send('Chyba při čtení dat.');
    } else {
      try {
        const teamLineups = JSON.parse(data);
        console.log('Data byla načtena ze souboru data.json');
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
        console.error('Chyba při parsování dat:', parseError);
        res.status(500).send('Chyba při parsování dat.');
      }
    }
  });
});

const port = 3001;
app.listen(port, () => {
  console.log(`Server běží na http://localhost:${port}`);
});