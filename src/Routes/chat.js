import express from "express";
import bodyParser from "body-parser";
import crypto from "crypto";

const chatRouter = express.Router();
chatRouter.use(bodyParser.json());

const chatRooms = {};

/**
 * @swagger
 *  tags:
 *    name: Chat
 *    description: Chat operations
 */

/**
 * @swagger
 * /chat/create:
 *   post:
 *     summary: Create a new chat room
 *     tags: [Chat]
 *     responses:
 *       200:
 *         description: The chat room was successfully created
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                   description: The token of the created chat room
 */
chatRouter.post("/create", (req, res) => {
  const token = crypto.randomBytes(3).toString("hex");
  chatRooms[token] = [];
  res.json({ token });
});

/**
 * @swagger
 * /chat/{token}/messages:
 *   get:
 *     summary: Get all messages from a chat room
 *     tags: [Chat]
 *     parameters:
 *       - in: path
 *         name: token
 *         required: true
 *         schema:
 *           type: string
 *         description: The token of the chat room
 *     responses:
 *       200:
 *         description: List of messages
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   username:
 *                     type: string
 *                     description: The username of the sender
 *                   message:
 *                     type: string
 *                     description: The message content
 *       404:
 *         description: Chat room not found
 */
chatRouter.get("/:token/messages", (req, res) => {
  const { token } = req.params;
  const messages = chatRooms[token];
  if (!messages) {
    return res.status(404).send({ error: "Chat room not found" });
  }
  res.json(messages);
});

/**
 * @swagger
 * /chat/{token}/message:
 *   post:
 *     summary: Send a message to a chat room
 *     tags: [Chat]
 *     parameters:
 *       - in: path
 *         name: token
 *         required: true
 *         schema:
 *           type: string
 *         description: The token of the chat room
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *                 description: The username of the sender
 *               message:
 *                 type: string
 *                 description: The message to send
 *     responses:
 *       200:
 *         description: The message was successfully sent
 *       400:
 *         description: Username or message is missing
 *       404:
 *         description: Chat room not found
 */
chatRouter.post("/:token/message", (req, res) => {
  const { token } = req.params;
  const { username, message } = req.body;
  if (!username || !message) {
    return res.status(400).send({ error: "Username and message are required" });
  }
  const messages = chatRooms[token];
  if (!messages) {
    return res.status(404).send({ error: "Chat room not found" });
  }
  messages.push({ username, message });
  res.sendStatus(200);
});

export default chatRouter;
