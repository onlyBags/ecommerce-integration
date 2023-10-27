import { Router, Request, Response, NextFunction } from 'express';
import { DashboardController } from '../controllers/dashboardController.js';
import { envConfig } from '@dg-live/ecommerce-config';
import {
  NewSlotReq,
  SaveUserReq,
  UpdateSlotReq,
} from '@dg-live/ecommerce-data-types';

const dashboardRouter = Router();
const dashboardController = new DashboardController();

/**
 * @swagger
 * /user:
 *   post:
 *     tags: [Dashboard]
 *     description: Create a new user
 *     parameters:
 *       - name: masterKey
 *         in: body
 *         required: true
 *         schema:
 *           $ref: '#/definitions/SaveUserReq'
 *     responses:
 *       200:
 *         description: Successfully created a new user
 *         schema:
 *           $ref: '#/definitions/DGLResponseUser'
 *       400:
 *         description: Invalid masterKey or other error
 *         schema:
 *           type: object
 *           properties:
 *             message:
 *               type: string
 */
dashboardRouter.post(
  '/user',
  async (req: Request<{}, {}, SaveUserReq>, res: Response) => {
    // #swagger.tags = ['Dashboard']
    try {
      const requestBody = req.body;
      if (
        !requestBody.masterKey ||
        envConfig.masterKey !== requestBody.masterKey
      ) {
        return res.status(400).json({ message: 'Invalid masterKey' });
      }
      const result = await dashboardController.createUser(requestBody);
      res.status(result.status).json(result);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }
);
dashboardRouter.post(
  '/user/slot/:datasourceId',
  async (
    req: Request<{ datasourceId: string }, {}, NewSlotReq>,
    res: Response
  ) => {
    /* #swagger.tags = ['Dashboard']
       #swagger.responses[200] = {
            description: 'Successfully created a new slot',
            schema: { $ref: '#/definitions/DGLResponseSlot' }
       }
       #swagger.responses[400] = {
            description: 'Invalid parameters',
            schema: { message: 'Invalid parameters' }
       }
    */
    try {
      const { datasourceId } = req.params;
      const { apiKey } = req.headers;
      const requestBody = req.body;

      if (!datasourceId || isNaN(Number(datasourceId))) {
        return res
          .status(400)
          .json({ message: 'Invalid datasourceId, it should be a number' });
      }
      const result = await dashboardController.newSlot(
        apiKey as string,
        Number(datasourceId),
        requestBody
      );

      res.status(result.status).json(result);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }
);

dashboardRouter.put(
  '/user/slot/:datasourceId/:slotId',
  async (
    req: Request<{ datasourceId: string; slotId: string }, {}, UpdateSlotReq>,
    res: Response
  ) => {
    /* #swagger.tags = ['Dashboard']
       #swagger.responses[204] = {
            description: 'Successfully updated the slot',
            schema: { $ref: '#/definitions/DGLResponseSlot' }
       }
       #swagger.responses[400] = {
            description: 'Invalid parameters',
            schema: { message: 'Invalid parameters' }
       }
    */
    try {
      const { datasourceId, slotId } = req.params;
      const { apiKey } = req.headers;
      const requestBody = req.body;

      const datasourceIdNum = Number(datasourceId);
      const slotIdNum = Number(slotId);

      if (isNaN(datasourceIdNum) || isNaN(slotIdNum)) {
        return res.status(400).json({ message: 'Invalid IDs' });
      }

      const result = await dashboardController.updateSlot(
        apiKey as string,
        datasourceIdNum,
        slotIdNum,
        requestBody
      );

      res.status(result.status).json(result);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }
);

dashboardRouter.delete(
  '/user/slot/:datasourceId/:slotId',
  async (req: Request, res: Response, next: NextFunction) => {
    /* #swagger.tags = ['Dashboard']
       #swagger.responses[204] = {
            description: 'Successfully deleted the slot',
            schema: { $ref: '#/definitions/DGLResponse' }
       }
       #swagger.responses[400] = {
            description: 'Invalid parameters',
            schema: { message: 'Invalid parameters' }
       }
    */
    try {
      const { apiKey } = req.headers;
      const { datasourceId, slotId } = req.params;
      const result = await dashboardController.deleteSlot(
        apiKey as string,
        Number(datasourceId),
        Number(slotId)
      );
      res.status(result.status).json(result);
    } catch (err) {
      next(err);
    }
  }
);

dashboardRouter.get(
  '/user/slot/:datasourceId/:slotId',
  async (req: Request, res: Response, next: NextFunction) => {
    /* #swagger.tags = ['Dashboard']
       #swagger.responses[200] = {
            description: 'Successfully fetched the slot',
            schema: { $ref: '#/definitions/DGLResponseSlot' }
       }
       #swagger.responses[400] = {
            description: 'Invalid parameters',
            schema: { message: 'Invalid parameters' }
       }
    */
    try {
      const { datasourceId, slotId } = req.params;
      const result = await dashboardController.getSlot(
        Number(slotId),
        Number(datasourceId)
      );
      res.status(result.status).json(result);
    } catch (err) {
      next(err);
    }
  }
);

dashboardRouter.get(
  '/user/slots/:datasourceId',
  async (req: Request, res: Response, next: NextFunction) => {
    /* #swagger.tags = ['Dashboard']
       #swagger.responses[200] = {
            description: 'Successfully fetched the slots',
            schema: { $ref: '#/definitions/DGLResponseSlots' }
       }
       #swagger.responses[400] = {
            description: 'Invalid parameters',
            schema: { message: 'Invalid parameters' }
       }
    */
    try {
      const { datasourceId } = req.params;
      const result = await dashboardController.getSlots(Number(datasourceId));
      res.status(result.status).json(result);
    } catch (err) {
      next(err);
    }
  }
);

dashboardRouter.get(
  '/user/datasource',
  async (req: Request, res: Response, next: NextFunction) => {
    /* #swagger.tags = ['Dashboard']
       #swagger.responses[204] = {
            description: 'Successfully updated the slot',
            schema: { $ref: '#/definitions/DGLResponseSlot' }
       }
       #swagger.responses[400] = {
            description: 'Invalid parameters',
            schema: { message: 'Invalid parameters' }
       }
    */
    try {
      const { apikey } = req.headers;
      const result = await dashboardController.getUserDatasources(
        apikey as string
      );
      res.status(result.status).json(result);
    } catch (err) {
      next(err);
    }
  }
);

dashboardRouter.get(
  '/user/datasource/:datasourceId',
  async (req: Request, res: Response, next: NextFunction) => {
    /* #swagger.tags = ['Dashboard']
       #swagger.responses[200] = {
            description: 'User datasources fetched successfully',
            schema: { $ref: '#/definitions/DGLResponseDatasource' }
       }
       #swagger.responses[400] = {
            description: 'Invalid parameters',
            schema: { message: 'Invalid parameters' }
       }
    */
    try {
      const { datasourceId } = req.params;
      const { apikey } = req.headers;
      if (!datasourceId || isNaN(Number(datasourceId))) {
        return res
          .status(400)
          .json({ message: 'Invalid datasourceId, it should be a number' });
      }
      const result = await dashboardController.getUserDatasource(
        apikey as string,
        Number(datasourceId)
      );
      res.status(result.status).json(result);
    } catch (err) {
      next(err);
    }
  }
);

export default dashboardRouter;
