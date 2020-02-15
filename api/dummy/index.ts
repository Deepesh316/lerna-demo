// tslint:disable-next-line:no-var-requires
require("dotenv").config({ path: ".env" }); // for env variables

import Server from "@dkr/server";
import routes from "./lib/routes/routes";

const { PORT } = process.env;

Server(PORT, routes);
