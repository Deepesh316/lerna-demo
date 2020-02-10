import { Router } from "express";

const router: any = Router();

router.get("/dummy", (req, res, next) => {
  res.send("Hello Deepesh");
});

export default router;
