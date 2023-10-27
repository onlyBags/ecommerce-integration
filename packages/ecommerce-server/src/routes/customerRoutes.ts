import { Router, Request, Response } from 'express';
import { CustomerController } from '../controllers/customerController.js';

const customerRouter = Router();
const customerController = new CustomerController();
customerRouter.get('/shipping/:wallet', async (req: Request, res: Response) => {
  /*
    #swagger.tags = ['Customer'] 
     #swagger.parameters['wallet'] = { description: 'Customer wallet' } 
     #swagger.responses[200] = {
      description: "Get the user shupping addres by wallet.",
      content: {
        "application/json": {
          schema:{
            $ref: "#/components/schemas/DGLResponse_Shipping"
          }
        }           
      }
    }
    #swagger.responses[400] = {
      description: 'Invalid parameters',
      schema: { message: 'Invalid parameters' }
    }
  */
  const wallet = req.params.wallet;
  if (!wallet) return res.status(400).json({ message: 'Invalid wallet' });
  const data = await customerController.getCustomerShipping(wallet);
  return res.status(data.status).json(data);
});

customerRouter.get('/billing/:wallet', async (req: Request, res: Response) => {
  /*
    #swagger.tags = ['Customer'] 
     #swagger.parameters['wallet'] = { description: 'Customer wallet' } 
     #swagger.responses[200] = {
      description: "Get the user billing addres by wallet.",
      content: {
        "application/json": {
          schema:{
            $ref: "#/components/schemas/DGLResponse_Billing"
          }
        }           
      }
    }
    #swagger.responses[400] = {
      description: 'Invalid parameters',
      schema: { message: 'Invalid parameters' }
    }
  */
  const wallet = req.params.wallet;
  if (!wallet) return res.status(400).json({ message: 'Invalid wallet' });
  const data = await customerController.getCustomerShipping(wallet);
  return res.status(data.status).json(data);
});

export default customerRouter;
