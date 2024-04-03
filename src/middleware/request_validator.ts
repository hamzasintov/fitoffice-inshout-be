import { Request, Response, NextFunction } from 'express';

const validate = (schema: any, component: string) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const { error, value } = schema.validate(req[component]);

    if (error) {
      res.status(400).send(error.details[0].message);
      return;
    }

    // If the validation is successful, you can replace the request body with the validated value
    // (this is optional, but it ensures that subsequent middleware or route handlers work with validated and sanitized data)
    // req.body = value;

    next();
  };
};

export default validate;
