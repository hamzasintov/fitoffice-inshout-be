import * as rTracer from 'cls-rtracer';
import { Request, Response, NextFunction } from 'express';

function traceMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  const incomingTraceId: string | undefined = req.headers['traceid'] as string; // Assuming the header key is 'traceid'

  if (incomingTraceId) {
    // If traceid is provided in the request headers, use it
    req.headers['x-request-id'] = incomingTraceId;
  }

  // Use rTracer's middleware after setting the traceid
  rTracer.expressMiddleware({
    useHeader: true,
    headerName: 'x-request-id'
  })(req, res, next);
}

export default traceMiddleware;
