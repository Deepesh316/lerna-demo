import { Router } from "express";
import controller from "../../controller";

const router: any = Router();

router.get("/dummy", (req, res) => {
  res.send("Hello Dev");
});

router.post("/updateData", controller.updateData);

export default router;
