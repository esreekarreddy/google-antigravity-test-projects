// P2P connection manager using PeerJS for real-time multiplayer
// Similar architecture to ZapShare/GhostLine

import Peer, { DataConnection } from 'peerjs';

export type RaceMessage = 
  | { type: 'ready'; text: string }
  | { type: 'start' }
  | { type: 'progress'; position: number; wpm: number }
  | { type: 'complete'; wpm: number; accuracy: number; time: number }
  | { type: 'rematch' };

export interface PeerState {
  status: 'disconnected' | 'connecting' | 'waiting' | 'connected' | 'racing' | 'finished';
  roomCode: string | null;
  isHost: boolean;
  error: string | null;
}

// Generate a short room code (4 characters)
function generateRoomCode(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // Avoiding confusing chars
  let code = '';
  for (let i = 0; i < 4; i++) {
    code += chars[Math.floor(Math.random() * chars.length)];
  }
  return code;
}

// Hash room code to peer ID (for obscurity)
async function hashRoomCode(code: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(`typerace-${code.toUpperCase()}`);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  return `typerace-${hashHex.slice(0, 16)}`;
}

export class RacePeer {
  private peer: Peer | null = null;
  private connection: DataConnection | null = null;
  private roomCode: string | null = null;
  private isHost: boolean = false;
  
  private onStateChange: (state: PeerState) => void;
  private onMessage: (message: RaceMessage) => void;
  private onOpponentDisconnect: () => void;

  constructor(
    onStateChange: (state: PeerState) => void,
    onMessage: (message: RaceMessage) => void,
    onOpponentDisconnect: () => void
  ) {
    this.onStateChange = onStateChange;
    this.onMessage = onMessage;
    this.onOpponentDisconnect = onOpponentDisconnect;
  }

  private emitState(status: PeerState['status'], error: string | null = null) {
    this.onStateChange({
      status,
      roomCode: this.roomCode,
      isHost: this.isHost,
      error,
    });
  }

  // Create a new race room (host)
  async createRoom(): Promise<string> {
    this.roomCode = generateRoomCode();
    this.isHost = true;
    this.emitState('connecting');

    try {
      const peerId = await hashRoomCode(this.roomCode);
      
      return new Promise((resolve, reject) => {
        this.peer = new Peer(peerId, {
          debug: 0,
        });

        this.peer.on('open', () => {
          this.emitState('waiting');
          resolve(this.roomCode!);
        });

        this.peer.on('error', (err) => {
          console.error('Peer error:', err);
          this.emitState('disconnected', err.message);
          reject(err);
        });

        this.peer.on('connection', (conn) => {
          this.connection = conn;
          this.setupConnection();
        });
      });
    } catch (err) {
      this.emitState('disconnected', 'Failed to create room');
      throw err;
    }
  }

  // Join an existing race room (guest)
  async joinRoom(code: string): Promise<void> {
    this.roomCode = code.toUpperCase();
    this.isHost = false;
    this.emitState('connecting');

    try {
      const hostPeerId = await hashRoomCode(this.roomCode);
      
      return new Promise((resolve, reject) => {
        this.peer = new Peer({
          debug: 0,
        });

        this.peer.on('open', () => {
          // Connect to host
          this.connection = this.peer!.connect(hostPeerId, {
            reliable: true,
          });

          this.connection.on('open', () => {
            this.emitState('connected');
            this.setupConnection();
            resolve();
          });

          this.connection.on('error', (err) => {
            this.emitState('disconnected', 'Failed to connect to room');
            reject(err);
          });
        });

        this.peer.on('error', (err) => {
          console.error('Peer error:', err);
          if (err.type === 'peer-unavailable') {
            this.emitState('disconnected', 'Room not found. Check the code and try again.');
          } else {
            this.emitState('disconnected', err.message);
          }
          reject(err);
        });
      });
    } catch (err) {
      this.emitState('disconnected', 'Failed to join room');
      throw err;
    }
  }

  private setupConnection() {
    if (!this.connection) return;

    this.connection.on('open', () => {
      this.emitState('connected');
    });

    this.connection.on('data', (data) => {
      this.onMessage(data as RaceMessage);
    });

    this.connection.on('close', () => {
      this.onOpponentDisconnect();
      this.emitState('disconnected', 'Opponent disconnected');
    });

    this.connection.on('error', (err) => {
      console.error('Connection error:', err);
      this.emitState('disconnected', 'Connection error');
    });
  }

  // Send a message to the opponent
  send(message: RaceMessage) {
    if (this.connection && this.connection.open) {
      this.connection.send(message);
    }
  }

  // Disconnect and cleanup
  disconnect() {
    if (this.connection) {
      this.connection.close();
      this.connection = null;
    }
    if (this.peer) {
      this.peer.destroy();
      this.peer = null;
    }
    this.roomCode = null;
    this.isHost = false;
    this.emitState('disconnected');
  }

  // Check if connected
  isConnected(): boolean {
    return this.connection !== null && this.connection.open;
  }

  // Get room code
  getRoomCode(): string | null {
    return this.roomCode;
  }
}
