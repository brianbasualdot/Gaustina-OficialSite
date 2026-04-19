import prisma from '../utils/prisma.js';

export const getSetting = async (req, res) => {
    const { key } = req.params;
    try {
        const setting = await prisma.setting.findUnique({
            where: { key }
        });
        
        // If it doesn't exist, return a default for maintenance_mode
        if (!setting && key === 'maintenance_mode') {
            return res.json({ key, value: 'false' });
        }
        
        if (!setting) {
            return res.status(404).json({ error: 'Setting not found' });
        }
        
        res.json(setting);
    } catch (error) {
        console.error('Error fetching setting:', error);
        res.status(500).json({ error: 'Error fetching setting' });
    }
};

export const updateSetting = async (req, res) => {
    const { key, value } = req.body;
    
    if (!key || value === undefined) {
        return res.status(400).json({ error: 'Key and value are required' });
    }
    
    try {
        const setting = await prisma.setting.upsert({
            where: { key },
            update: { value: String(value) },
            create: { key, value: String(value) }
        });
        
        res.json(setting);
    } catch (error) {
        console.error('Error updating setting:', error);
        res.status(500).json({ error: 'Error updating setting' });
    }
};
