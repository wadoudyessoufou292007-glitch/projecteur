const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

// Servir les fichiers statiques du dossier public
app.use(express.static('public'));

// Gestion des connexions à distance via WebSocket
io.on('connection', (socket) => {
    console.log(`Un utilisateur est connecté : ${socket.id}`);

    // Relayer le signal WebRTC entre les PC
    socket.on('signal', (data) => {
        socket.broadcast.emit('signal', data);
    });

    // Relayer les actions de contrôle
    socket.on('remote-action', (action) => {
        socket.broadcast.emit('remote-action', action);
    });

    // Relayer les messages du chat
    socket.on('chat-message', (msg) => {
        socket.broadcast.emit('chat-message', msg);
    });

    socket.on('disconnect', () => {
        console.log(`Utilisateur déconnecté : ${socket.id}`);
    });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Serveur de contrôle à distance lancé sur le port ${PORT}`);
});