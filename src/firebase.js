import { initializeApp } from 'firebase/app';
import { getDatabase, ref, get, set } from 'firebase/database';

const firebaseConfig = {
  apiKey: "AIzaSyC6bY1tYOpd-Po-E6_e61miCXLg-lBOGKU",
  authDomain: "sixpack-trainer.firebaseapp.com",
  databaseURL: "https://sixpack-trainer-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "sixpack-trainer",
  storageBucket: "sixpack-trainer.firebasestorage.app",
  messagingSenderId: "775288452868",
  appId: "1:775288452868:web:75646fff0f4741f11f0251",
  measurementId: "G-PYJMDB3G0S"
};

const _db = { load: null, save: null, loadReceipts: null, saveReceipts: null, ready: false };

export async function initDB() {
  if (_db.ready) return _db;
  _db.ready = true;
  try {
    const app = initializeApp(firebaseConfig);
    const db = getDatabase(app);
    _db.load = async () => {
      const snap = await get(ref(db, 'scores'));
      if (!snap.exists()) return [];
      const val = snap.val();
      return Array.isArray(val) ? val : Object.values(val);
    };
    _db.save = async (data) => { await set(ref(db, 'scores'), data); return true; };
    _db.loadReceipts = async () => {
      const snap = await get(ref(db, 'receipts'));
      if (!snap.exists()) return [];
      const val = snap.val();
      return Array.isArray(val) ? val : Object.values(val);
    };
    _db.saveReceipts = async (data) => { await set(ref(db, 'receipts'), data); return true; };
    console.log('✅ Firebase 연결 완료');
  } catch (e) {
    console.error('⚠️ Firebase 실패:', e);
    _db.load = async () => { try { const v = localStorage.getItem('sp_scores'); return v ? JSON.parse(v) : []; } catch { return []; } };
    _db.save = async (data) => { try { localStorage.setItem('sp_scores', JSON.stringify(data)); return true; } catch { return false; } };
    _db.loadReceipts = async () => { try { const v = localStorage.getItem('sp_receipts'); return v ? JSON.parse(v) : []; } catch { return []; } };
    _db.saveReceipts = async (data) => { try { localStorage.setItem('sp_receipts', JSON.stringify(data)); return true; } catch { return false; } };
  }
  return _db;
}

export function getDB() { return _db; }
