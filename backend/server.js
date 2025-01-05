const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const axios = require('axios');
const cassandra = require('cassandra-driver');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(bodyParser.json());
app.use(cors());

// DataStax Astra DB Configuration
const client = new cassandra.Client({
    cloud: { secureConnectBundle: './secure-connect-datastax.zip' }, // Add your secure connect bundle here
    keyspace: 'social_media',
});

client.connect()
    .then(() => console.log('Connected to DataStax Astra DB'))
    .catch(err => console.error('Connection error:', err));

// Routes
// Fetch data from Langflow
app.post('/fetch-insights', async (req, res) => {
    const { postType } = req.body;

    try {
        const response = await axios.post(process.env.LANGFLOW_API_URL, {
            type: postType
        }, {
            headers: {
                'Authorization': `Bearer ${process.env.LANGFLOW_API_KEY}`
            }
        });

        res.json(response.data);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching insights from Langflow' });
    }
});

// Query data from DataStax
app.get('/query-data', async (req, res) => {
    const query = 'SELECT * FROM engagement_data';

    try {
        const result = await client.execute(query);
        res.json(result.rows);
    } catch (error) {
        res.status(500).json({ error: 'Error querying data from DataStax' });
    }
});

// Chatbot integration (GPT)
app.post('/chatbot', async (req, res) => {
    const { message } = req.body;

    try {
        const response = await axios.post(process.env.GPT_API_URL, {
            prompt: message,
        }, {
            headers: {
                'Authorization': `Bearer ${process.env.GPT_API_KEY}`
            }
        });

        res.json(response.data);
    } catch (error) {
        res.status(500).json({ error: 'Error with chatbot API' });
    }
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
