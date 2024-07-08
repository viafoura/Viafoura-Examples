
const express = require('express')
const router = express.Router();

import { Request, Response } from 'express'
import { IRequest } from '../types';
import { createNotification } from '../providers';

router.post('/vf-webhook', (req: Request, res: Response) => {
    const request = req.body as IRequest;
    for (var notification of request.notifications) {
        createNotification(notification);
    }

    return res.send("webhook response");
});

router.get('/health-check', (req: Request, res: Response) => {
    return res.send("still alive");
});

export default router;