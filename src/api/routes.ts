import { Router, Request as ExpressRequest, Response, NextFunction } from 'express';
import { publisherMessageToExchange } from './publisherMessage';

type Request = ExpressRequest<{}, {}, {item: string}>;

const routes = Router();

routes.post('/createBar', async (request: Request, response: Response, next: NextFunction) => {
  
  try {
    const { item } = request.body;

    await publisherMessageToExchange({ routingKey: 'bar', message: { item } });

    response.status(200).json({
      status: 'message published successfully',
      messageQueue: {
        item,
      }
    });
  } catch (error) {
    next(error);
  }

});

routes.post('/createKitchen', async (request: Request, response: Response, next: NextFunction) => {
  try {
    const { item } = request.body;

    await publisherMessageToExchange({ routingKey: 'kitchen', message: { item } });
  
    response.status(200).json({
      status: 'message published successfully',
      messageQueue: {
        item,
      }
    });
  } catch (error) {
    next(error);
  }
});

export default routes;
