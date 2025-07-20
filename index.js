import express from 'express';
import cors from 'cors';
import fetch from 'node-fetch'; // npm install node-fetch@2

const app = express();
app.use(cors());
app.use(express.json());

const JUPITER_API_URL = 'https://quote-api.jup.ag/v1/quote';

app.get('/', (req, res) => {
  res.send('✅ Solana Swap Backend with Jupiter REST API is running');
});

app.post('/quote', async (req, res) => {
  try {
    const { inputMint, outputMint, amount } = req.body;

    if (!inputMint || !outputMint || !amount) {
      return res.status(400).json({ error: 'Missing required fields: inputMint, outputMint, amount' });
    }

    const params = new URLSearchParams({
      inputMint,
      outputMint,
      amount,
      slippageBps: '50', // 0.5% slippage
    });

    const response = await fetch(`${JUPITER_API_URL}?${params.toString()}`);
    const data = await response.json();

    if (!data.data || data.data.length === 0) {
      return res.status(404).json({ error: 'No swap routes found' });
    }

    res.json(data);
  } catch (error) {
    console.error('Error fetching swap quote:', error);
    res.status(500).json({ error: 'Failed to fetch swap quote' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Backend running on http://localhost:${PORT}`);
});
