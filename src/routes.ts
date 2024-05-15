import { Application } from "express";
import userModule from "./modules/user/user.module";
import { authModule } from "./modules/auth/auth.module";

export function Routes(app: Application) {
  app.use("/user", userModule);
  /**
   * @openapi
   * /healthcheck:
   *  get:
   *     tags:
   *     - Healthcheck
   *     description: Responds if the app is up and running
   *     responses:
   *       200:
   *         description: App is up and running
   */
  app.use("/auth", authModule);
}
