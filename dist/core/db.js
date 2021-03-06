"use strict";

var _mongoose = _interopRequireDefault(require("mongoose"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_mongoose.default.connect('mongodb://localhost:27017/naval_battles', {
  useNewURLParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9jb3JlL2RiLmpzIl0sIm5hbWVzIjpbIm1vbmdvb3NlIiwiY29ubmVjdCIsInVzZU5ld1VSTFBhcnNlciIsInVzZUNyZWF0ZUluZGV4IiwidXNlRmluZEFuZE1vZGlmeSIsInVzZVVuaWZpZWRUb3BvbG9neSJdLCJtYXBwaW5ncyI6Ijs7QUFBQTs7OztBQUVBQSxrQkFBU0MsT0FBVCxDQUFpQix5Q0FBakIsRUFBNEQ7QUFDeERDLEVBQUFBLGVBQWUsRUFBRSxJQUR1QztBQUV4REMsRUFBQUEsY0FBYyxFQUFFLElBRndDO0FBR3hEQyxFQUFBQSxnQkFBZ0IsRUFBRSxLQUhzQztBQUl4REMsRUFBQUEsa0JBQWtCLEVBQUU7QUFKb0MsQ0FBNUQiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgbW9uZ29vc2UgZnJvbSBcIm1vbmdvb3NlXCI7XG5cbm1vbmdvb3NlLmNvbm5lY3QoJ21vbmdvZGI6Ly9sb2NhbGhvc3Q6MjcwMTcvbmF2YWxfYmF0dGxlcycsIHtcbiAgICB1c2VOZXdVUkxQYXJzZXI6IHRydWUsXG4gICAgdXNlQ3JlYXRlSW5kZXg6IHRydWUsXG4gICAgdXNlRmluZEFuZE1vZGlmeTogZmFsc2UsXG4gICAgdXNlVW5pZmllZFRvcG9sb2d5OiB0cnVlLFxuXG59KTsiXX0=