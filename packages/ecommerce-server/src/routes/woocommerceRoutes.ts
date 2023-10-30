import { Router, Request, Response, NextFunction } from 'express';
import { WoocommerceController } from '../controllers/woocommerceController.js';
import { WoocommerceOrder } from '@dg-live/ecommerce-data-types';

const woocommerceRouter = Router();
const woocommerceController = new WoocommerceController();

woocommerceRouter.get(
  '/catalog/:datasourceId',
  async (req: Request, res: Response, next: NextFunction) => {
    /* 
      #swagger.tags = ['Woocommerce']
      #swagger.responses[200] = {
        description: 'Successfully fetched the products',
        content: {
          "application/json": {
            schema:{
              $ref: "#/components/schemas/DGLResponse_WoocommerceProducts"
            }
          }           
        }
      }
      #swagger.responses[400] = {
        description: 'Invalid parameters',
        schema: { message: 'Invalid parameters' }
      }
   */
    try {
      const { datasourceId } = req.params;
      const apiKey = req.headers['api-key'] as string;
      const result = await woocommerceController.getCatalog(
        apiKey,
        Number(datasourceId)
      );
      res.status(result.status).json(result);
    } catch (err) {
      next(err);
    }
  }
);

woocommerceRouter.get(
  '/catalog/sync/:datasourceId',
  async (req: Request, res: Response, next: NextFunction) => {
    /* 
      #swagger.tags = ['Woocommerce']
      #swagger.responses[200] = {
        description: 'Successfully synced the catalog',
        content: {
          "application/json": {
            schema:{
              $ref: "#/components/schemas/DGLResponse_WoocommerceSyncCatalog"
            }
          }           
        }
      }
      #swagger.responses[400] = {
        description: 'Invalid parameters',
        schema: { message: 'Invalid parameters' }
      }
   */
    try {
      const { datasourceId } = req.params;
      const apiKey = req.headers['api-key'] as string;
      const result = await woocommerceController.syncCatalog(
        apiKey,
        Number(datasourceId)
      );
      res.status(result.status).json(result);
    } catch (err) {
      next(err);
    }
  }
);

woocommerceRouter.get(
  '/shipping/:datasourceId',
  async (req: Request, res: Response, next: NextFunction) => {
    /* 
      #swagger.tags = ['Woocommerce']
      #swagger.responses[200] = {
        description: 'Successfully fetched the shipping zones',
        content: {
          "application/json": {
            schema:{
              $ref: "#/components/schemas/DGLResponse_WoocommerceShippingZones"
            }
          }           
        }
      }
      #swagger.responses[400] = {
        description: 'Invalid parameters',
        schema: { message: 'Invalid parameters' }
      }
   */
    try {
      const { datasourceId } = req.params;
      const apiKey = req.headers['api-key'] as string;
      const result = await woocommerceController.getShippings(
        apiKey,
        Number(datasourceId)
      );
      res.status(result.status).json(result);
    } catch (err) {
      next(err);
    }
  }
);

woocommerceRouter.get(
  '/shipping/:datasourceId/locations/:shippingZoneId',
  async (req: Request, res: Response, next: NextFunction) => {
    /* 
      #swagger.tags = ['Woocommerce']
      #swagger.responses[200] = {
        description: 'Successfully fetched the shipping locations',
        content: {
          "application/json": {
            schema:{
              $ref: "#/components/schemas/DGLResponse_WoocommerceShippingZones"
            }
          }           
        }
      }
      #swagger.responses[400] = {
        description: 'Invalid parameters',
        schema: { message: 'Invalid parameters' }
      }
   */
    try {
      const { datasourceId, shippingZoneId } = req.params;
      const apiKey = req.headers['api-key'] as string;
      const result = await woocommerceController.getShippingLocations(
        apiKey,
        Number(datasourceId),
        Number(shippingZoneId)
      );
      res.status(result.status).json(result);
    } catch (err) {
      next(err);
    }
  }
);

woocommerceRouter.get(
  '/shipping/:datasourceId/methods/:shippingZoneId',
  async (req: Request, res: Response, next: NextFunction) => {
    /* 
      #swagger.tags = ['Woocommerce']
      #swagger.responses[200] = {
        description: 'Successfully fetched the shipping methods',
        content: {
          "application/json": {
            schema:{
              $ref: "#/components/schemas/DGLResponse_WoocommerceShippingZones"
            }
          }           
        }
      }
      #swagger.responses[400] = {
        description: 'Invalid parameters',
        schema: { message: 'Invalid parameters' }
      }
   */
    try {
      const { datasourceId, shippingZoneId } = req.params;
      const apiKey = req.headers['api-key'] as string;
      const result = await woocommerceController.getShippingMethods(
        apiKey,
        Number(datasourceId),
        Number(shippingZoneId)
      );
      res.status(result.status).json(result);
    } catch (err) {
      next(err);
    }
  }
);

woocommerceRouter.get(
  '/variation/:datasourceId/:productId',
  async (req: Request, res: Response, next: NextFunction) => {
    /* 
      #swagger.tags = ['Woocommerce']
      #swagger.responses[200] = {
        description: 'Successfully fetched the product variation',
        content: {
          "application/json": {
            schema:{
              $ref: "#/components/schemas/DGLResponse_WoocommerceProductVariation"
            }
          }           
        }
      }
      #swagger.responses[400] = {
        description: 'Invalid parameters',
        schema: { message: 'Invalid parameters' }
      }
   */
    try {
      const { datasourceId, productId } = req.params;
      const apiKey = req.headers['api-key'] as string;
      const { attributes, values } = req.query;
      const result = await woocommerceController.getProductVariation(
        apiKey,
        Number(productId),
        Number(datasourceId),
        attributes as string[],
        values as string[]
      );
      res.status(result.status).json(result);
    } catch (err) {
      next(err);
    }
  }
);

woocommerceRouter.post(
  '/order',
  async (
    req: Request<{}, {}, { datasourceId: number; wcOrder: WoocommerceOrder }>,
    res: Response,
    next: NextFunction
  ) => {
    /* 
      #swagger.tags = ['Woocommerce']
      #swagger.requestBody = {
        required: true,
        content: {
          "application/json": {
            schema: {
              $ref: "#/components/schemas/WoocommerceOrderReq"
            }  
          }
        }
      }
      #swagger.responses[200] = {
        description: 'Successfully created the order',
        content: {
          "application/json": {
            schema:{
              $ref: "#/components/schemas/DGLResponse_WoocommerceOrderCreatedRes"
            }
          }           
        }
      }
      #swagger.responses[400] = {
        description: 'Invalid parameters',
        schema: { message: 'Invalid parameters' }
      }
   */
    try {
      const apiKey = req.headers['api-key'] as string;
      const body = req.body;
      const result = await woocommerceController.wcCreateOrder(body);
      res.status(result.status).json(result);
    } catch (err) {
      next(err);
    }
  }
);

woocommerceRouter.get(
  '/webhooks/:datasourceId',
  async (req: Request, res: Response, next: NextFunction) => {
    /* 
      #swagger.tags = ['Woocommerce']
      #swagger.responses[200] = {
        description: 'Successfully fetched the webhooks',
        content: {
          "application/json": {
            schema:{
              $ref: "#/components/schemas/DGLResponse_WoocommerceWebhookResponse"
            }
          }           
        }
      }
      #swagger.responses[400] = {
        description: 'Invalid parameters',
        schema: { message: 'Invalid parameters' }
      }
   */
    try {
      const { datasourceId } = req.params;
      const apiKey = req.headers['api-key'] as string;
      const result = await woocommerceController.getWebhooks(
        apiKey,
        Number(datasourceId)
      );
      res.status(result.status).json(result);
    } catch (err) {
      next(err);
    }
  }
);

woocommerceRouter.post(
  '/webhooks/:datasourceId',
  async (req: Request, res: Response, next: NextFunction) => {
    /* #swagger.tags = ['Woocommerce']
     #swagger.responses[200] = {
          description: 'Successfully created the webhooks',
          schema: { $ref: '#/definitions/DGLResponseWoocommerceWebhookResponse' }
     }
     #swagger.responses[400] = {
          description: 'Invalid parameters',
          schema: { message: 'Invalid parameters' }
     }
  */
    try {
      const { datasourceId } = req.params;
      const apiKey = req.headers['api-key'] as string;
      const result = await woocommerceController.createWebhooks(
        apiKey,
        Number(datasourceId)
      );
      res.status(result.status).json(result);
    } catch (err) {
      next(err);
    }
  }
);

export default woocommerceRouter;
