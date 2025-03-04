// server.js
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const Web3 = require('web3');
const { create } = require('ipfs-http-client');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const crypto = require('crypto-js');
const { v4: uuidv4 } = require('uuid');

const app = express();
const upload = multer({ storage: multer.memoryStorage() });
app.use(express.json());

// Database Connection
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

// IPFS Configuration
const ipfs = create({
  host: 'ipfs.infura.io',
  port: 5001,
  protocol: 'https',
  headers: {
    authorization: `Basic ${Buffer.from(
      `${process.env.INFURA_PROJECT_ID}:${process.env.INFURA_PROJECT_SECRET}`
    ).toString('base64')}`
  }
});

// Web3 & Smart Contract Setup
const web3 = new Web3(
  new Web3.providers.HttpProvider(
    `https://${process.env.NETWORK}.infura.io/v3/${process.env.INFURA_PROJECT_ID}`
  )
);
const contractABI = require('./DigitalLockerABI.json');
const contract = new web3.eth.Contract(
  contractABI,
  process.env.CONTRACT_ADDRESS
);

// Models
const UserSchema = new mongoose.Schema({
  uid: { type: String, required: true, unique: true },
  publicKey: String,
  encryptedPrivateKey: String,
  documents: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Document' }]
});

const DocumentSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  docType: String,
  ipfsHash: String,
  verified: Boolean,
  timestamp: { type: Date, default: Date.now }
});

const User = mongoose.model('User', UserSchema);
const Document = mongoose.model('Document', DocumentSchema);

// Utility Functions
const encryptData = (data, key) => crypto.AES.encrypt(data, key).toString();
const decryptData = (ciphertext, key) => 
  crypto.AES.decrypt(ciphertext, key).toString(crypto.enc.Utf8);

const generateAuthToken = (user) => {
  return jwt.sign(
    { uid: user.uid, publicKey: user.publicKey },
    process.env.JWT_SECRET,
    { expiresIn: '1h' }
  );
};

// Middleware
const auth = async (req, res, next) => {
  try {
    const token = req.header('Authorization').replace('Bearer ', '');
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findOne({ uid: decoded.uid });
    next();
  } catch (error) {
    res.status(401).send({ error: 'Please authenticate' });
  }
};

// Routes
app.post('/signup', async (req, res) => {
  try {
    const { uid } = req.body;
    
    // Validate UID
    const existingUser = await User.findOne({ uid });
    if (existingUser) {
      return res.status(400).send({ error: 'User already exists' });
    }

    // Generate Ethereum account
    const account = web3.eth.accounts.create();
    const encryptedPrivateKey = encryptData(
      account.privateKey, 
      process.env.ENCRYPTION_KEY
    );

    // Save to blockchain
    const txData = contract.methods
      .registerUser(uid, account.address, encryptedPrivateKey)
      .encodeABI();

    const tx = {
      to: process.env.CONTRACT_ADDRESS,
      data: txData,
      gas: 500000
    };

    const signedTx = await web3.eth.accounts.signTransaction(
      tx, 
      process.env.ADMIN_PRIVATE_KEY
    );

    const receipt = await web3.eth.sendSignedTransaction(
      signedTx.rawTransaction
    );

    // Save to database
    const user = new User({ uid, publicKey: account.address, encryptedPrivateKey });
    await user.save();

    const token = generateAuthToken(user);
    res.status(201).send({ user, token });

  } catch (error) {
    res.status(400).send({ error: error.message });
  }
});

app.post('/login', async (req, res) => {
  try {
    const { uid } = req.body;
    const user = await User.findOne({ uid });
    
    if (!user) {
      throw new Error('Invalid login credentials');
    }

    const token = generateAuthToken(user);
    res.send({ user, token });
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
});

app.post('/upload', auth, upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      throw new Error('No file uploaded');
    }

    // Encrypt file
    const encryptedFile = encryptData(
      req.file.buffer.toString('hex'),
      process.env.ENCRYPTION_KEY
    );

    // Add to IPFS
    const { cid } = await ipfs.add(Buffer.from(encryptedFile));
    
    // Save document
    const document = new Document({
      userId: req.user._id,
      docType: req.body.docType,
      ipfsHash: cid.toString(),
      verified: false
    });

    await document.save();

    // Update blockchain
    const txData = contract.methods
      .addDocument(req.user.uid, cid.toString(), req.body.docType)
      .encodeABI();

    const signedTx = await web3.eth.accounts.signTransaction({
      to: process.env.CONTRACT_ADDRESS,
      data: txData,
      gas: 500000
    }, process.env.ADMIN_PRIVATE_KEY);

    await web3.eth.sendSignedTransaction(signedTx.rawTransaction);

    res.send({ document });

  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

app.get('/documents/:cid', auth, async (req, res) => {
  try {
    const document = await Document.findOne({ 
      ipfsHash: req.params.cid,
      userId: req.user._id
    });

    if (!document) {
      throw new Error('Document not found');
    }

    // Retrieve from IPFS
    const chunks = [];
    for await (const chunk of ipfs.cat(req.params.cid)) {
      chunks.push(chunk);
    }

    const encryptedContent = Buffer.concat(chunks).toString();
    const decryptedContent = decryptData(
      encryptedContent, 
      process.env.ENCRYPTION_KEY
    );

    res.set('Content-Type', 'application/pdf');
    res.send(Buffer.from(decryptedContent, 'hex'));

  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});