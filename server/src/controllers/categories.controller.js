import { PrismaClient } from '@prisma/client';
import { z } from 'zod';

const prisma = new PrismaClient();

// Validación
const categorySchema = z.object({
    name: z.string().min(1, "Name is required"),
    description: z.string().optional(),
});

// CREATE
export const createCategory = async (req, res) => {
    try {
        const body = req.body;
        const validation = categorySchema.safeParse(body);

        if (!validation.success) {
            return res.status(400).json({ error: validation.error.issues });
        }

        const newCategory = await prisma.category.create({
            data: {
                name: body.name,
                description: body.description,
            }
        });

        res.status(201).json(newCategory);
    } catch (error) {
        // Manejar error de duplicados (Prisma P2002)
        if (error.code === 'P2002') {
            return res.status(400).json({ error: 'Category name already exists' });
        }
        res.status(500).json({ error: 'Failed to create category' });
    }
};

// GET ALL
export const getAllCategories = async (req, res) => {
    try {
        const categories = await prisma.category.findMany({
            orderBy: { name: 'asc' },
            include: { _count: { select: { products: true } } } // Opcional: contar productos
        });
        res.json(categories);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch categories' });
    }
};

// DELETE
export const deleteCategory = async (req, res) => {
    try {
        const { id } = req.params;
        await prisma.category.delete({
            where: { id: parseInt(id) }
        });
        res.json({ message: 'Category deleted successfully' });
    } catch (error) {
        if (error.code === 'P2003') {
            return res.status(400).json({ error: 'Cannot delete category with associated products' });
        }
        res.status(500).json({ error: 'Failed to delete category' });
    }
};
