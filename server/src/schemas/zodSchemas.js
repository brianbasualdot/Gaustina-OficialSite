// server/src/schemas/zodSchemas.js
import { z } from 'zod';

export const UserSchema = z.object({
    email: z.string().email({ message: "Invalid email address" }),
    name: z.string().min(2, { message: "Name must be at least 2 characters long" }).optional(),
    password: z.string().min(8).optional(), // Assuming auth uses a provider or separate handling
});

export const ProductSchema = z.object({
    name: z.string().min(1),
    description: z.string().min(10),
    price: z.number().positive(),
    stock: z.number().int().nonnegative(),
    images: z.array(z.string().url()),
});

export const OrderSchema = z.object({
    userId: z.string().uuid(),
    items: z.array(z.object({
        productId: z.string().uuid(),
        quantity: z.number().int().positive(),
    })).nonempty(),
});
