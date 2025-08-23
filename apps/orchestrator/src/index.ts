import express from 'express';
import cors from 'cors';

const app = express();
app.use(express.json());
app.use(cors({ origin: process.env.ORCH_ALLOWED_ORIGINS?.split(',') ?? ['*'] }));

app.get('/health', (_req, res) => res.json({ ok: true }));

app.post('/events', (req, res) => {
  // TODO route to Aura/Valeion adapters
  res.json({ ok: true });
});

const port = Number(process.env.ORCH_PORT || 6060);
app.listen(port, () => console.log(`orchestrator listening on :${port}`));
