import { Router } from 'express';
import { KoreController } from './kore.controller';

const router = Router();

// Object Registry
router.get('/objects', KoreController.listObjects);
router.post('/objects', KoreController.createObject);
router.get('/objects/:name', KoreController.getObject);

// Property Registry
router.post('/objects/:name/properties', KoreController.addProperty);

// Action Registry
router.post('/objects/:name/actions', KoreController.addAction);

// Action Runtime
router.post('/runtime/execute', KoreController.executeAction);

export default router;
