import express from 'express';
import fetch from 'node-fetch';
import bodyParser from 'body-parser';

const app = express();
const PORT = 3000;

app.use(bodyParser.json());

app.post('/flashcards', async (req, res) => {
    const word = req.body.word;

    if(!word) {
        return res.status(400).json({ error: 'Word not provided in request body.' });
    }

    const API_URL = `https://api.dictionaryapi.dev/api/v2/entries/en_US/${word}`;

    try {
        const response = await fetch(API_URL);
        const data = await response.json();

        if(!data[0] || !data[0].meanings || !data[0].meanings.length) {
            return res.status(404).json({ error: 'Meaning not found for provided word.' });
        }

        const flashcards = data[0].meanings.map(meaning => ({
            word: word,
            partOfSpeech: meaning.partOfSpeech,
            definition: meaning.definitions[0].definition
        }));

        return res.json(flashcards);
    } catch (error) {
        return res.status(500).json({ error: 'Failed to fetch word meaning.' });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
