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

// Relationship Registry
router.get('/objects/:name/relationships', KoreController.listRelationships);
router.post('/objects/:name/relationships', KoreController.addRelationship);
router.delete('/objects/:name/relationships/:relId', KoreController.deleteRelationship);

// Action Runtime
router.post('/runtime/execute', KoreController.executeAction);

export default router;
