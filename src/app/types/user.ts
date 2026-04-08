export interface User {
  id: string;
  email: string;
  displayName: string;
  avatar: string;
  xp: number;
  level: number;
  coins: number;
  achievements: string[];
  inventory: InventoryItem[];
  equipped: {
    avatar: string;
    outfit: string;
    accessory: string;
  };
  progress: {
    completedCards: number[];
    theoryScreenCompleted: boolean;
  };
  createdAt: string;
  lastLogin: string;
}

export interface InventoryItem {
  id: string;
  type: 'avatar' | 'outfit' | 'accessory' | 'achievement';
  name: string;
  icon: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  description: string;
  price: number;
  insuranceTheme: string;
}