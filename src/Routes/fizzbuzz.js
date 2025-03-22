import express from "express";
import bodyParser from "body-parser";

const fizzbuzzRouter = express.Router();

fizzbuzzRouter.use(bodyParser.json());

/**
 * @swagger
 *  tags:
 *    name: FizzBuzz
 *    description: FizzBuzz operations
 */

/**
 * @swagger
 * /fizzbuzz:
 *   get:
 *     summary: Returns FizzBuzz up to 100
 *     tags: [FizzBuzz]
 *     responses:
 *       200:
 *         description: FizzBuzz list up to 100
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: string
 */
fizzbuzzRouter.get("/", (req, res) => {
  const result = [];
  for (let i = 1; i <= 100; i++) {
    if (i % 15 === 0) result.push("FizzBuzz");
    else if (i % 3 === 0) result.push("Fizz");
    else if (i % 5 === 0) result.push("Buzz");
    else result.push(i.toString());
  }
  res.json(result);
});

/**
 * @swagger
 * /fizzbuzz/{number}:
 *   post:
 *     summary: Returns FizzBuzz up to a specified number
 *     tags: [FizzBuzz]
 *     parameters:
 *       - in: path
 *         name: number
 *         required: true
 *         schema:
 *           type: integer
 *         description: The number to go up to
 *     responses:
 *       200:
 *         description: FizzBuzz list up to the specified number
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: string
 *       400:
 *         description: Invalid input
 */
fizzbuzzRouter.post("/:number", (req, res) => {
  const { number } = req.params;
  const num = parseInt(number, 10);
  if (isNaN(num) || num <= 0) {
    return res.status(400).send({ error: "Invalid input" });
  }

  const result = [];
  for (let i = 1; i <= num; i++) {
    if (i % 15 === 0) result.push("FizzBuzz");
    else if (i % 3 === 0) result.push("Fizz");
    else if (i % 5 === 0) result.push("Buzz");
    else result.push(i.toString());
  }
  res.json(result);
});

export default fizzbuzzRouter;
