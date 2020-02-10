import Logger from "@dkr/logger";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import express, { NextFunction, Request, Response, Router } from "express";
import { ExpressJoiError } from "express-joi-validation";
import helmet from "helmet";
import { get } from "lodash";

const Server = (port: string = "3000", routes: Router) => {
  const app = express();

  /* Configuration of common middle wears */
  app.use(helmet());

  // JSON body Parser
  /* This middle wear will look for the request having json like Content-type (application/json).
     This middle wear can also be configured to control max size of body.eg { limit: '1ookb' }
  */
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true }));

  app.use(express.static("public"));

  // Cookies parser
  app.use(cookieParser());

  /* Configuration of routes */

  app.use("/", routes);

  // error handling, including request validation
  app.use((err: any, req: Request, res: Response, next: NextFunction) => {
    let error = err.message || err.errors || "Unknown error";
    let statusCode = err.status || 500;
    if (get(err, "error.isJoi", false)) {
      const e: ExpressJoiError = err;
      error = err.error.message || `You submitted a bad ${e.type} paramater.`;
      statusCode = 400;
    }
    Logger.error({ error }, `Server-util: error handler, returning error`);
    if (process.env.env === "PROD") {
      res.sendStatus(statusCode);
    } else {
      res.status(statusCode).json({ error });
    }
  });

  app.listen(port, () => {
    Logger.info(`info Listening on port ${port}!  from ${process.cwd()}`);
  });
};

export default Server;
