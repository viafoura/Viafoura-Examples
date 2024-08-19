
const express = require('express')
const router = express.Router();

import { version } from '../../package.json';
import { Request, Response } from 'express'
import { IRequest } from '../types';
import { createNotification } from '../providers';
import { isIterable } from '../utils/utils';

router.post('/vf-webhook', (req: Request, res: Response) => {
    const request = req.body as IRequest;
    
    if(isIterable(request.notifications)){
        for (var notification of request.notifications) {
            createNotification(notification);
        }
    }

    return res.send("webhook response");
});

router.get('/health-check', (req: Request, res: Response) => {
    return res.send("still alive on " + version);
});

export default router;