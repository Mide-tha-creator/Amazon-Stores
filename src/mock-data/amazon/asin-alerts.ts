import type { AsinAlert } from "@/types/amazon";

export const ASIN_ALERTS: AsinAlert[] = [
  {
    asin: "B08XYZ1234",
    title: "Premium Resistance Bands Set - 5 Levels",
    imageUrl:
      "https://images.unsplash.com/photo-1598289431512-b97b0917affc?w=120&h=120&fit=crop",
    category: "declining_sales",
    metricLabel: "$573.45 decline in OPS",
    deltaAmount: -573.45,
  },
  {
    asin: "B09ABC5678",
    title: "Adjustable Dumbbell Pair 24lb",
    imageUrl:
      "https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=120&h=120&fit=crop",
    category: "declining_sales",
    metricLabel: "$412.20 decline in OPS",
    deltaAmount: -412.2,
  },
  {
    asin: "B07DEF9012",
    title: "Yoga Mat Extra Thick 6mm Non-Slip",
    imageUrl:
      "https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=120&h=120&fit=crop",
    category: "declining_sales",
    metricLabel: "$298.15 decline in OPS",
    deltaAmount: -298.15,
  },
  {
    asin: "B08GHI3456",
    title: "Foam Roller High Density 18 inch",
    imageUrl:
      "https://images.unsplash.com/photo-1518611012118-696072aa579a?w=120&h=120&fit=crop",
    category: "declining_sales",
    metricLabel: "$189.90 decline in OPS",
    deltaAmount: -189.9,
  },
  {
    asin: "B09JKL7890",
    title: "Jump Rope Weighted Speed Cable",
    imageUrl:
      "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=120&h=120&fit=crop",
    category: "increasing_sales",
    metricLabel: "$245.80 increase in OPS",
    deltaAmount: 245.8,
  },
  {
    asin: "B07MNO2345",
    title: "Kettlebell Cast Iron 20lb",
    imageUrl:
      "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=120&h=120&fit=crop",
    category: "increasing_sales",
    metricLabel: "$512.30 increase in OPS",
    deltaAmount: 512.3,
  },
];
