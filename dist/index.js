"use strict";

var _express = _interopRequireDefault(require("express"));

var _dotenv = _interopRequireDefault(require("dotenv"));

var _http = require("http");

var _routes = _interopRequireDefault(require("./core/routes"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// import "./core/db";
_dotenv.default.config();

const app = (0, _express.default)();
const http = (0, _http.createServer)(app);
(0, _routes.default)(app);
const PORT = process.env.PORT || 3003;
http.listen(PORT, () => {
  console.log(`Server: http://localhost:${process.env.PORT}`);
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9pbmRleC5qcyJdLCJuYW1lcyI6WyJkb3RlbnYiLCJjb25maWciLCJhcHAiLCJodHRwIiwiUE9SVCIsInByb2Nlc3MiLCJlbnYiLCJsaXN0ZW4iLCJjb25zb2xlIiwibG9nIl0sIm1hcHBpbmdzIjoiOztBQUFBOztBQUNBOztBQUNBOztBQUdBOzs7O0FBREE7QUFFQUEsZ0JBQU9DLE1BQVA7O0FBR0EsTUFBTUMsR0FBRyxHQUFHLHVCQUFaO0FBQ0EsTUFBTUMsSUFBSSxHQUFHLHdCQUFhRCxHQUFiLENBQWI7QUFFQSxxQkFBYUEsR0FBYjtBQUVBLE1BQU1FLElBQUksR0FBSUMsT0FBTyxDQUFDQyxHQUFSLENBQVlGLElBQVosSUFBb0IsSUFBbEM7QUFFQUQsSUFBSSxDQUFDSSxNQUFMLENBQVlILElBQVosRUFBa0IsTUFBTTtBQUNwQkksRUFBQUEsT0FBTyxDQUFDQyxHQUFSLENBQWEsNEJBQTJCSixPQUFPLENBQUNDLEdBQVIsQ0FBWUYsSUFBSyxFQUF6RDtBQUNILENBRkQiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgZXhwcmVzcyBmcm9tIFwiZXhwcmVzc1wiO1xuaW1wb3J0IGRvdGVudiBmcm9tIFwiZG90ZW52XCI7XG5pbXBvcnQgeyBjcmVhdGVTZXJ2ZXIgfSBmcm9tIFwiaHR0cFwiO1xuXG4vLyBpbXBvcnQgXCIuL2NvcmUvZGJcIjtcbmltcG9ydCBjcmVhdGVSb3V0ZXMgZnJvbSBcIi4vY29yZS9yb3V0ZXNcIjtcbmRvdGVudi5jb25maWcoKTtcblxuXG5jb25zdCBhcHAgPSBleHByZXNzKCk7XG5jb25zdCBodHRwID0gY3JlYXRlU2VydmVyKGFwcCk7XG5cbmNyZWF0ZVJvdXRlcyhhcHApO1xuXG5jb25zdCBQT1JUID0gIHByb2Nlc3MuZW52LlBPUlQgfHwgMzAwMztcblxuaHR0cC5saXN0ZW4oUE9SVCwgKCkgPT4ge1xuICAgIGNvbnNvbGUubG9nKGBTZXJ2ZXI6IGh0dHA6Ly9sb2NhbGhvc3Q6JHtwcm9jZXNzLmVudi5QT1JUfWApO1xufSlcbiJdfQ==