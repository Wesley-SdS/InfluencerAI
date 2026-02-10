import { z } from 'zod';

export const createCheckoutSchema = z.object({
  planSlug: z.string().min(1, 'Plano é obrigatório'),
});

export const purchaseCreditsSchema = z.object({
  amount: z.number().min(10, 'Mínimo de 10 créditos'),
});

export const transactionsQuerySchema = z.object({
  page: z.coerce.number().min(1).optional().default(1),
  limit: z.coerce.number().min(1).max(100).optional().default(20),
  type: z.enum(['usage', 'purchase', 'subscription', 'bonus', 'refund']).optional(),
});
