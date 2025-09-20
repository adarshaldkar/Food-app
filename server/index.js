"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var dotenv_1 = require("dotenv");
dotenv_1.default.config();
var app = (0, express_1.default)();
var PORT = process.env.PORT || 5000;
app.listen(PORT, function () {
    console.log("Server listen at port ".concat(PORT));
});
