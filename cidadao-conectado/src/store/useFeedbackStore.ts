import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export interface FeedbackRecord {
  id: string;
  itemId: string;
  itemName: string;
  itemType: "glossary" | "benefit" | "law" | "other";
  isHelpful: boolean;
  comment?: string;
  timestamp: number;
}

interface FeedbackStore {
  feedbacks: FeedbackRecord[];
  votedItems: Record<string, boolean>; // itemId -> true
  addFeedback: (itemId: string, itemName: string, itemType: "glossary" | "benefit" | "law" | "other", isHelpful: boolean, comment?: string) => void;
  hasVoted: (itemId: string) => boolean;
  getDashboardMetrics: () => {
    totalVotes: number;
    approvalRate: number;
    items: Record<string, {
      itemName: string;
      itemType: string;
      helpful: number;
      notHelpful: number;
      comments: string[];
    }>;
  };
}

export const useFeedbackStore = create<FeedbackStore>()(
  persist(
    (set, get) => ({
      feedbacks: [],
      votedItems: {},
      
      addFeedback: (itemId, itemName, itemType, isHelpful, comment) => set((state) => {
        if (state.votedItems[itemId]) return state; // Prevent duplicate votes

        const newFeedback: FeedbackRecord = {
          id: Math.random().toString(36).substring(2, 9),
          itemId,
          itemName,
          itemType,
          isHelpful,
          comment,
          timestamp: Date.now()
        };

        return {
          feedbacks: [...state.feedbacks, newFeedback],
          votedItems: { ...state.votedItems, [itemId]: true }
        };
      }),

      hasVoted: (itemId) => {
        return !!get().votedItems[itemId];
      },

      getDashboardMetrics: () => {
        const { feedbacks } = get();
        
        let helpfulTotal = 0;
        const items: Record<string, any> = {};

        feedbacks.forEach(f => {
          if (f.isHelpful) helpfulTotal++;
          
          if (!items[f.itemId]) {
            items[f.itemId] = {
              itemName: f.itemName,
              itemType: f.itemType,
              helpful: 0,
              notHelpful: 0,
              comments: []
            };
          }

          if (f.isHelpful) items[f.itemId].helpful++;
          else items[f.itemId].notHelpful++;

          if (f.comment && f.comment.trim() !== "") {
            items[f.itemId].comments.push(f.comment);
          }
        });

        const totalVotes = feedbacks.length;
        const approvalRate = totalVotes === 0 ? 0 : Math.round((helpfulTotal / totalVotes) * 100);

        return {
          totalVotes,
          approvalRate,
          items
        };
      }
    }),
    {
      name: "cidadao-feedback-storage",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
