
const express = require('express')
const router = express.Router();

import { Request, Response } from 'express'

router.post('/vf-webhook', (req: Request, res: Response) => {
    return res.send("webhook response");
});

router.get('/health-check', (req: Request, res: Response) => {
    return res.send("still alive");
});

export default router;