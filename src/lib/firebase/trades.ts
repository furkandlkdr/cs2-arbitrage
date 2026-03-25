import {
  Unsubscribe,
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  orderBy,
  query,
  setDoc,
} from 'firebase/firestore';
import { getFirestoreDb } from '@/lib/firebase/client';
import { TradeRecord } from '@/utils/calculations';

const tradesCollection = (uid: string) => collection(getFirestoreDb(), 'users', uid, 'trades');

export function subscribeToTrades(
  uid: string,
  onData: (trades: TradeRecord[]) => void,
  onError: (error: unknown) => void
): Unsubscribe {
  const tradesQuery = query(tradesCollection(uid), orderBy('createdAt', 'desc'));

  return onSnapshot(
    tradesQuery,
    (snapshot) => {
      const nextTrades = snapshot.docs.map((item) => item.data() as TradeRecord);
      onData(nextTrades);
    },
    onError
  );
}

export async function upsertTrade(uid: string, trade: TradeRecord) {
  const reference = doc(getFirestoreDb(), 'users', uid, 'trades', trade.id);
  await setDoc(reference, trade, { merge: true });
}

export async function deleteTrade(uid: string, tradeId: string) {
  const reference = doc(getFirestoreDb(), 'users', uid, 'trades', tradeId);
  await deleteDoc(reference);
}
