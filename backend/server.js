const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const OpenAI = require('openai');
const axios = require('axios');
const cheerio = require('cheerio');
const multer = require('multer');
const pdfParse = require('pdf-parse');
const upload = multer({ storage: multer.memoryStorage() });

// Load environment variables
dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

if (!process.env.OPENAI_API_KEY) {
  console.error('Error: OPENAI_API_KEY is not set in .env file');
  process.exit(1);
}

// Initialize OpenAI
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

// Chat endpoint
app.post('/api/chat', async (req, res) => {
  try {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "You are a helpful and friendly AI assistant. Provide clear, concise, and accurate responses."
        },
        {
          role: "user",
          content: message
        }
      ],
      temperature: 0.7,
      max_tokens: 500,
    });

    const aiResponse = completion.choices[0].message.content;
    res.json({ message: aiResponse });

  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ 
      error: 'An error occurred while processing your request',
      details: error.message 
    });
  }
});

app.post('/api/summarize', async (req, res) => {
    const { url } = req.body;

    if (!url) return res.status(400).json({ error: 'URL is required' });

    try {
        const { data: html } = await axios.get(url);
        const $ = cheerio.load(html);

        // Lấy nội dung chính (có thể tùy chỉnh theo từng trang)
        let content = '';
        $('p').each((i, el) => {
        const text = $(el).text().trim();
        if (text.length > 40) content += text + '\n';
        });

        const completion = await openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [
            { role: 'system', content: 'Bạn là một AI tóm tắt văn bản ngắn gọn, dễ hiểu.' },
            { role: 'user', content: `Tóm tắt bài viết sau:\n${content}` }
        ],
        max_tokens: 500
        });

        const summary = completion.choices[0].message.content;
        res.json({ summary });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Không thể tải hoặc tóm tắt nội dung', details: error.message });
    }
});

let uploadedPdfContent = '';

app.post('/api/upload-pdf', upload.single('pdf'), async (req, res) => {
  try {
    const data = await pdfParse(req.file.buffer);
    uploadedPdfContent = data.text;
    res.json({ message: 'Tải file thành công và đã trích xuất nội dung.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Lỗi khi xử lý file PDF.' });
  }
});

app.post('/api/ask-pdf', async (req, res) => {
    const { question } = req.body;
  
    if (!uploadedPdfContent) {
      return res.status(400).json({ error: 'Chưa có file PDF nào được upload.' });
    }
  
    try {
      const completion = await openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [
          { role: 'system', content: 'Bạn là một AI trợ lý thông minh chuyên trả lời câu hỏi dựa trên nội dung PDF người dùng cung cấp.' },
          { role: 'user', content: `Văn bản: ${uploadedPdfContent}\n\nCâu hỏi: ${question}` }
        ],
        max_tokens: 500
      });
  
      const answer = completion.choices[0].message.content;
      res.json({ answer });
  
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Không thể xử lý câu hỏi.', details: error.message });
    }
  });

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    error: 'Something broke!',
    details: err.message 
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
}); 