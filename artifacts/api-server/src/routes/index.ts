import { Router, type IRouter } from "express";
import healthRouter from "./health";
import sessionRouter from "./session";
import stadiumsRouter from "./stadiums";
import ordersRouter from "./orders";
import riderRouter from "./rider";
import adminRouter from "./admin";
import feedRouter from "./feed";

const router: IRouter = Router();

router.use(healthRouter);
router.use(sessionRouter);
router.use(stadiumsRouter);
router.use(feedRouter);
router.use(ordersRouter);
router.use(riderRouter);
router.use(adminRouter);

export default router;
