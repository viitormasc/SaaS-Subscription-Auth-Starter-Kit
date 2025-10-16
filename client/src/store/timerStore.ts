/* import { create } from 'zustand';

interface Card {
  _id: String;
  userId: String;
  name: String;
  dailyGoalMinutes: Number;
  color: String;
}

interface CardState {
  cards: Record<String, Card>;
  addCard: (title: String) => void;
  removeCard: (cardId: String) => void;
  setCardState: (cardId: String, stateUpdate: Partial<Card>) => void;
}

const useCardStore = create<CardState>((set) => ({
  cards: {},

  addCard: (cardata) => {
    const newCard = {...cardata}
  }


}))

 */
