import express from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(express.json());

// Lazy-initialized Gemini client to prevent crashes if key is omitted
let aiClient: GoogleGenAI | null = null;

function getGemini(): GoogleGenAI {
  if (!aiClient) {
    const key = process.env.GEMINI_API_KEY;
    if (!key || key.includes('MY_GEMINI_API_KEY')) {
      throw new Error('GEMINI_API_KEY não está configurado ou possui o valor padrão.');
    }
    aiClient = new GoogleGenAI({
      apiKey: key,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });
  }
  return aiClient;
}

// AI Hair & Beauty Expert advice handler
app.post('/api/gemini/generate', async (req, res) => {
  try {
    const { message, history } = req.body;
    if (!message) {
      return res.status(400).json({ error: 'A mensagem é obrigatória.' });
    }

    const ai = getGemini();

    const systemInstruction = `
      Você é a Consultora Virtual Inteligente do "Lê Marques Hair & Estética", um salão de beleza de altíssimo padrão localizado no Brasil, especialista em Megahair, Extensão de Cílios de Luxo (Volume Russo, Fio a Fio Clássico), Micropigmentação HD (Nanoblading Realista) e tratamentos capilares sofisticados.
      
      Suas diretrizes:
      1. Escreva em português brasileiro de forma acolhedora, premium, inspiradora e muito profissional.
      2. Você possui extremo conhecimento em técnicas de megahair (Micropele Invisível, Queratina HD, Fita Adesiva Flex), cronograma capilar, métodos inovadores de alongamento sem danos, manutenção, escovação correta, e mitos/verdades de cuidados em casa.
      3. Dê conselhos detalhados, elegantes e empoderadores sobre como cuidar do cabelo em casa com megahair (lavar com cuidado, escovar começando pelas pontas, não dormir com ele úmido, aplicar protetor térmico).
      4. Sempre recomende agendar uma avaliação física e personalizada na Lê Marques Hair & Estética para melhores diagnósticos, destacando que cada cabelo é único e que a excelência exige análise profissional.
      5. Nunca use jargões excessivamente técnicos que assustem o cliente, mas mostre maestria absoluta e sofisticação em cada resposta.
      6. Mantenha os parágrafos limpos e fáceis de ler. Use bullet points se for listar dicas ou rotinas.
    `;

    // Format chat contents for the SDK using history if provided
    let contents: any[] = [];
    if (history && Array.isArray(history)) {
      contents = history.map((h: any) => ({
        role: h.role === 'user' ? 'user' : 'model',
        parts: [{ text: h.text }]
      }));
    }
    contents.push({ role: 'user', parts: [{ text: message }] });

    const response = await ai.models.generateContent({
      model: 'gemini-3.5-flash',
      contents: contents,
      config: {
        systemInstruction,
        temperature: 0.7,
      }
    });

    const replyText = response.text || 'Desculpe, não consegui formular uma resposta no momento. Por favor, tente novamente.';
    res.json({ text: replyText });
  } catch (err: any) {
    console.error('Erro na chamada do Gemini:', err.message);
    // Graceful error fallback response for clients
    res.status(200).json({ 
      text: `Olá! Notei que no momento estou rodando em modo offline (sem chave de API configurada). Mas posso adiantar que para qualquer manutenção de Megahair, o mais importante é manter o couro cabeludo limpo, usar protetor térmico nas pontas, escovar sempre das pontas para a raiz utilizando escova específica tipo raquete cerdas macias, e nunca puxar as tags de fita ou queratina. Gostaria de agendar uma consulta pessoal com a equipe Lê Marques para uma análise real dos seus fios?` 
    });
  }
});

const isProd = process.env.NODE_ENV === 'production';

if (!isProd) {
  // Setup Vite Dev server connect configuration
  const { createServer: createViteServer } = await import('vite');
  const vite = await createViteServer({
    server: { middlewareMode: true },
    appType: 'spa',
  });
  app.use(vite.middlewares);
} else {
  // Production serving
  const distPath = path.resolve(__dirname, 'dist');
  app.use(express.static(distPath));
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(distPath, 'index.html'));
  });
}

const PORT = 3000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`[Lê Marques Server] rodando em http://0.0.0.0:${PORT}`);
});
