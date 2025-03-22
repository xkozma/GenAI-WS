import express from "express";
import cors from "cors";
import morgan from "morgan";
import bodyParser from "body-parser";
import { fileURLToPath } from "url";
import path from "path";
import dotenv from "dotenv";
import swaggerUI from "swagger-ui-express";
import swaggerJsDoc from "swagger-jsdoc";
import postRouter from "./Routes/posts.js";
import fizzbuzzRouter from "./Routes/fizzbuzz.js";
import chatRouter from "./Routes/chat.js";

// CDN CSS

const CSS_URL =
  "https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.1.0/swagger-ui.min.css";

const app = express();

app.use(bodyParser.json()); // to use body object in requests
const PORT = process.env.PORT || 8080;
dotenv.config();

app.use(morgan("dev"));
app.use(cors());

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Library API",
      version: "1.0.0",
      description: "A simple Express Library API",
      termsOfService: "http://example.com/terms/",
      contact: {
        name: "API Support",
        url: "http://www.exmaple.com/support",
        email: "support@example.com",
      },
    },
  },
  // This is to call all the file
  apis: ["src/**/*.js"],
};

const specs = swaggerJsDoc(options);

app.use(
  "/api-docs",
  swaggerUI.serve,
  swaggerUI.setup(specs, { customCssUrl: CSS_URL })
);

// Use the router from the post.js file
app.use("/posts", postRouter);

// Use the router from the fizzbuzz.js file
app.use("/fizzbuzz", fizzbuzzRouter);

// Use the router from the chat.js file
app.use("/chat", chatRouter);

// Endpoint to get available routes and methods
app.get('/available-routes', (req, res) => {
  const routes = [];
  app._router.stack.forEach(middleware => {
    if (middleware.route) { // routes registered directly on the app
      routes.push({
        path: middleware.route.path,
        methods: Object.keys(middleware.route.methods).join(', ').toUpperCase()
      });
    } else if (middleware.name === 'router') { // router middleware
      middleware.handle.stack.forEach(handler => {
        const route = handler.route;
        route && routes.push({
          path: route.path,
          methods: Object.keys(route.methods).join(', ').toUpperCase()
        });
      });
    }
  });
  res.json(routes);
});

app.listen(PORT, () => console.log(`Server runs on port ${PORT}`));


const router = express();

router.use(bodyParser.json()); // to use body object in requests
router.use(morgan("dev"));
router.use(cors());

router.set("view engine", "ejs");

// This was we can keep everything inside our src folder!!

const __dirname = path.dirname(fileURLToPath(import.meta.url));

router.set("views", path.join(__dirname, "views"));
router.set("view engine", "ejs");

// This is to read csss
router.use(express.static(path.join(__dirname, "views/pages")));

router.get("/", (req, res) => {
  res.render(path.join(__dirname, "views", "pages", "index"));
});

// Here we are calling the basic html
// Use the router from the hello.js file
app.use("/", router);

export default router;
