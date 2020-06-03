"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _bodyParser = _interopRequireDefault(require("body-parser"));

var _express = _interopRequireDefault(require("express"));

var _controllers = require("../controllers");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const CreateRoutes = app => {
  const userController = new _controllers.UserController(); //middleware

  app.use(_bodyParser.default);
  app.get('/', (req, res) => res.send('Hello World!'));
  app.get("/user/:id", userController.show); //TODO add validation

  app.post("/signup", userController.create);
};

var _default = CreateRoutes;
exports.default = _default;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9jb3JlL3JvdXRlcy5qcyJdLCJuYW1lcyI6WyJDcmVhdGVSb3V0ZXMiLCJhcHAiLCJ1c2VyQ29udHJvbGxlciIsIlVzZXJDb250cm9sbGVyIiwidXNlIiwiYm9keVBhcnNlciIsImdldCIsInJlcSIsInJlcyIsInNlbmQiLCJzaG93IiwicG9zdCIsImNyZWF0ZSJdLCJtYXBwaW5ncyI6Ijs7Ozs7OztBQUFBOztBQUNBOztBQUNBOzs7O0FBRUEsTUFBTUEsWUFBWSxHQUFHQyxHQUFHLElBQUk7QUFDeEIsUUFBTUMsY0FBYyxHQUFHLElBQUlDLDJCQUFKLEVBQXZCLENBRHdCLENBRXhCOztBQUNBRixFQUFBQSxHQUFHLENBQUNHLEdBQUosQ0FBUUMsbUJBQVI7QUFDQUosRUFBQUEsR0FBRyxDQUFDSyxHQUFKLENBQVEsR0FBUixFQUFhLENBQUNDLEdBQUQsRUFBTUMsR0FBTixLQUFjQSxHQUFHLENBQUNDLElBQUosQ0FBUyxjQUFULENBQTNCO0FBQ0FSLEVBQUFBLEdBQUcsQ0FBQ0ssR0FBSixDQUFRLFdBQVIsRUFBcUJKLGNBQWMsQ0FBQ1EsSUFBcEMsRUFMd0IsQ0FNeEI7O0FBQ0FULEVBQUFBLEdBQUcsQ0FBQ1UsSUFBSixDQUFTLFNBQVQsRUFBb0JULGNBQWMsQ0FBQ1UsTUFBbkM7QUFDSCxDQVJEOztlQVNlWixZIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IGJvZHlQYXJzZXIgZnJvbSBcImJvZHktcGFyc2VyXCI7XG5pbXBvcnQgZXhwcmVzcyBmcm9tIFwiZXhwcmVzc1wiO1xuaW1wb3J0IHsgVXNlckNvbnRyb2xsZXIgfSBmcm9tIFwiLi4vY29udHJvbGxlcnNcIjtcblxuY29uc3QgQ3JlYXRlUm91dGVzID0gYXBwID0+IHtcbiAgICBjb25zdCB1c2VyQ29udHJvbGxlciA9IG5ldyBVc2VyQ29udHJvbGxlcigpO1xuICAgIC8vbWlkZGxld2FyZVxuICAgIGFwcC51c2UoYm9keVBhcnNlcik7XG4gICAgYXBwLmdldCgnLycsIChyZXEsIHJlcykgPT4gcmVzLnNlbmQoJ0hlbGxvIFdvcmxkIScpKTtcbiAgICBhcHAuZ2V0KFwiL3VzZXIvOmlkXCIsIHVzZXJDb250cm9sbGVyLnNob3cpO1xuICAgIC8vVE9ETyBhZGQgdmFsaWRhdGlvblxuICAgIGFwcC5wb3N0KFwiL3NpZ251cFwiLCB1c2VyQ29udHJvbGxlci5jcmVhdGUpO1xufVxuZXhwb3J0IGRlZmF1bHQgQ3JlYXRlUm91dGVzOyJdfQ==