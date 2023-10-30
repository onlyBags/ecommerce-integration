import { Router, Request, Response, NextFunction } from 'express';
import { DashboardController } from '../controllers/dashboardController.js';
import { envConfig } from '@dg-live/ecommerce-config';
import {
  NewSlotReq,
  SaveUserDatasourceReq,
  SaveUserReq,
  UpdateSlotReq,
} from '@dg-live/ecommerce-data-types';

const dashboardRouter = Router();
const dashboardController = new DashboardController();
dashboardRouter.post(
  '/user',
  async (req: Request<{}, {}, SaveUserReq>, res: Response) => {
    /*
    #swagger.tags = ['Dashboard'] 
    #swagger.requestBody = {
      required: true,
      content: {
        "application/json": {
          schema: {
            $ref: "#/components/schemas/SaveUserReq"
          }
        }
      }
    }
     #swagger.responses[201] = {
      description: "User created successfully",
      content: {
        "application/json": {
          schema:{
            $ref: "#/components/schemas/DGLResponse_User"
          }
        }           
      }
    }
    #swagger.responses[400] = {
      description: 'Invalid parameters',
      schema: { message: 'Invalid masterKey' }
    }
  */
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
  '/user/datasource',
  async (req: Request<{}, {}, SaveUserDatasourceReq>, res: Response) => {
    /*
    #swagger.tags = ['Dashboard']
    #swagger.parameters['api-key'] = {
      in: header,
      description: the apy key,
      required: true
    }
    #swagger.requestBody = {
      required: true,
      content: {
        "application/json": {
          schema: {
            $ref: "#/components/schemas/SaveUserDatasourceReq"
          }
        }
      }
    }
     #swagger.responses[201] = {
      description: "Datasource created successfully",
      content: {
        "application/json": {
          schema:{
            $ref: "#/components/schemas/DGLResponse_User"
          }
        }           
      }
    }
    #swagger.responses[400] = {
      description: 'Invalid parameters',
      schema: { message: 'Invalid masterKey' }
    }
  */
    try {
      const apiKey = req.headers['api-key'];
      const requestBody = req.body;
      const result = await dashboardController.saveUserDatasource(
        apiKey as string,
        requestBody
      );
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
    /*
    #swagger.tags = ['Dashboard'] 
    #swagger.requestBody = {
      required: true,
      content: {
        "application/json": {
          schema: {
            $ref: "#/components/schemas/NewSlotReq"
          }
        }
      }
    }
     #swagger.responses[201] = {
      description: "User created successfully",
      content: {
        "application/json": {
          schema:{
            $ref: "#/components/schemas/DGLResponse_User"
          }
        }           
      }
    }
    #swagger.responses[400] = {
      description: 'Invalid parameters',
      schema: { message: 'Invalid datasourceId, it should be a number' }
    }
  */
    try {
      const { datasourceId } = req.params;
      const apiKey = req.headers['api-key'];
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
    /*
    #swagger.tags = ['Dashboard'] 
    #swagger.requestBody = {
      required: true,
      content: {
        "application/json": {
          schema: {
            $ref: "#/components/schemas/UpdateSlotReq"
          }
        }
      }
    }
     #swagger.responses[204] = {
      description: 'Successfully updated the slot',
      content: {
        "application/json": {
          schema:{
            $ref: "#/components/schemas/DGLResponse_Slot"
          }
        }           
      }
    }
    #swagger.responses[400] = {
      description: 'Invalid Ids',
      schema: { message: 'Invalid datasourceId, it should be a number' }
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
    /*
    #swagger.tags = ['Dashboard'] 
     #swagger.responses[204] = {
      description: 'Successfully deleted the slot',
      content: {
        "application/json": {
          schema:{
            $ref: "#/components/schemas/DGLResponse_Slot"
          }
        }           
      }
    }
    #swagger.responses[400] = {
      description: 'Invalid Ids',
      schema: { message: 'Invalid datasourceId, it should be a number' }
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
    /*
    #swagger.tags = ['Dashboard'] 
     #swagger.responses[204] = {
      description: 'Successfully fetched the slot',
      content: {
        "application/json": {
          schema:{
            $ref: "#/components/schemas/DGLResponse_Slot"
          }
        }           
      }
    }
    #swagger.responses[400] = {
      description: 'Invalid Ids',
      schema: { message: 'Invalid datasourceId, it should be a number' }
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
    /*
    #swagger.tags = ['Dashboard'] 
     #swagger.responses[204] = {
      description: 'Successfully fetched the slots',
      content: {
        "application/json": {
          schema:{
            $ref: "#/components/schemas/DGLResponse_Slots"
          }
        }           
      }
    }
    #swagger.responses[400] = {
      description: 'Invalid Ids',
      schema: { message: 'Invalid datasourceId, it should be a number' }
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
            description: 'Successfully fetched the datasources',
            schema: { $ref: '#/definitions/DGLResponse_Datasources' }
       }
       #swagger.responses[400] = {
            description: 'Invalid parameters',
            schema: { message: 'Invalid apikey' }
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
       #swagger.responses[204] = {
            description: 'Successfully fetched the datasource',
            schema: { $ref: '#/definitions/DGLResponse_Datasource' }
       }
       #swagger.responses[400] = {
            description: 'Invalid parameters',
            schema: { message: 'Invalid apikey' }
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
