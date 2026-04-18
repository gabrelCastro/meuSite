require('dotenv').config();
const express = require("express");
const path = require("path");
const helmet = require("helmet");
const app = express();
const Routes = require(path.resolve("src","routes","route"));
const ConectDB = require(path.resolve("src","database","connection"))

app.use(helmet({
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            scriptSrc: ["'self'"],
            styleSrc: ["'self'", "https://fonts.googleapis.com", "'unsafe-inline'"],
            fontSrc: ["'self'", "https://fonts.gstatic.com"],
            imgSrc: ["'self'", "data:", "blob:", "https://i.ytimg.com", "https://*.ytimg.com"],
            connectSrc: ["'self'"],
            frameSrc: ["'self'", "blob:", "https://www.youtube.com", "https://www.youtube-nocookie.com", "https://player.vimeo.com"],
            workerSrc: ["'self'", "blob:"],
        },
    },
    referrerPolicy: { policy: 'strict-origin-when-cross-origin' },
}));

Routes(app);

ConectDB();

const PORT = process.env.PORT || 3003;
app.listen(PORT, () => {
  console.log(`Connected Server on port ${PORT}`);
});