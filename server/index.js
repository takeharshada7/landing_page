const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const bcrypt = require('bcryptjs');
const { body, validationResult } = require('express-validator');
const { v4: uuidv4 } = require('uuid');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 4000;

const DATA_DIR = path.join(__dirname, 'data');
const USERS_FILE = path.join(DATA_DIR, 'users.json');

function ensureDataFiles() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  if (!fs.existsSync(USERS_FILE)) {
    fs.writeFileSync(USERS_FILE, JSON.stringify([]));
  }
}

ensureDataFiles();

app.use(cors({ origin: '*'}));
app.use(express.json());
app.use(morgan('dev'));

function readUsers() {
  const raw = fs.readFileSync(USERS_FILE, 'utf8');
  return JSON.parse(raw);
}

function writeUsers(users) {
  fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));
}

app.post('/api/signup',
  [
    body('fullName').isLength({ min: 3 }).withMessage('Full name is required'),
    body('email').isEmail().withMessage('Valid email required').normalizeEmail(),
    body('password').isLength({ min: 8 }).withMessage('Password must be 8+ characters'),
    body('phone').optional().isMobilePhone().withMessage('Valid phone required'),
  ],
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { fullName, email, password, phone } = req.body;

    const users = readUsers();
    const existing = users.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (existing) {
      return res.status(409).json({ message: 'Email already registered' });
    }

    const passwordHash = bcrypt.hashSync(password, 10);
    const newUser = {
      id: uuidv4(),
      fullName,
      email: email.toLowerCase(),
      phone: phone || null,
      passwordHash,
      createdAt: new Date().toISOString(),
    };
    users.push(newUser);
    writeUsers(users);

    return res.status(201).json({ id: newUser.id, fullName: newUser.fullName, email: newUser.email });
  }
);

app.post('/api/chat', [body('message').isLength({ min: 1 }).withMessage('Message required')], (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { message } = req.body;
  const lower = String(message).toLowerCase();

  let reply = "I'm your banking assistant. I can help with signup and general info.";
  if (lower.includes('hello') || lower.includes('hi')) {
    reply = 'Hello! How can I assist you with your banking needs today?';
  } else if (lower.includes('account')) {
    reply = 'To open an account, please complete the signup form with your details.';
  } else if (lower.includes('password')) {
    reply = 'For security, choose a strong password of at least 8 characters.';
  } else if (lower.includes('help')) {
    reply = 'You can ask about account opening, card services, or app features.';
  }

  res.json({ reply });
});

app.get('/', (_req, res) => {
  res.json({ status: 'ok', service: 'banking-backend' });
});

app.listen(PORT, () => {
  console.log(`Backend listening on http://localhost:${PORT}`);
});
