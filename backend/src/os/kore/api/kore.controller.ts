import { Request, Response } from 'express';
import { ObjectRegistry } from '../language/ObjectRegistry';
import { PropertyRegistry } from '../language/PropertyRegistry';
import { ActionRegistry } from '../language/ActionRegistry';
import { ActionRuntime } from '../runtime/ActionRuntime';

export class KoreController {
  
  // ==========================================
  // Object Registry
  // ==========================================
  static async listObjects(req: Request, res: Response) {
    try {
      const objects = await ObjectRegistry.listObjects();
      res.json({ success: true, data: objects });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  }

  static async getObject(req: Request, res: Response) {
    try {
      const objectName = req.params.name;
      const objectDef = await ObjectRegistry.getObjectDefinition(objectName);
      res.json({ success: true, data: objectDef });
    } catch (error: any) {
      res.status(404).json({ success: false, error: error.message });
    }
  }

  static async createObject(req: Request, res: Response) {
    try {
      const payload = req.body;
      const newObject = await ObjectRegistry.registerObject(payload);
      res.json({ success: true, data: newObject });
    } catch (error: any) {
      res.status(400).json({ success: false, error: error.message });
    }
  }

  // ==========================================
  // Property Registry
  // ==========================================
  static async addProperty(req: Request, res: Response) {
    try {
      const objectName = req.params.name;
      const payload = { ...req.body, objectName };
      const newProp = await PropertyRegistry.registerProperty(payload);
      res.json({ success: true, data: newProp });
    } catch (error: any) {
      res.status(400).json({ success: false, error: error.message });
    }
  }

  // ==========================================
  // Action Registry
  // ==========================================
  static async addAction(req: Request, res: Response) {
    try {
      const objectName = req.params.name;
      const payload = { ...req.body, objectName };
      const newAction = await ActionRegistry.registerAction(payload);
      res.json({ success: true, data: newAction });
    } catch (error: any) {
      res.status(400).json({ success: false, error: error.message });
    }
  }

  // ==========================================
  // Action Runtime Execution
  // ==========================================
  static async executeAction(req: Request, res: Response) {
    try {
      const { objectName, actionName, payload } = req.body;
      
      // In a real system, actorId comes from req.user
      // For now we pass a mock actor if not provided
      const actorId = req.body.actorId || 'SYSTEM';

      const result = await ActionRuntime.execute({
        objectName,
        actionName,
        actorId,
        payload
      });
      
      res.json(result);
    } catch (error: any) {
      res.status(400).json({ success: false, error: error.message });
    }
  }
}
