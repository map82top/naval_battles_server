"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _mongoose = _interopRequireWildcard(require("mongoose"));

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function () { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

const UserSchema = new _mongoose.Schema({
  username: {
    type: String,
    required: [true, "Username required"]
  },
  email: {
    type: String,
    required: [true, "Email required"]
  },
  password: {
    type: String,
    required: [true, "Password required"]
  }
}, {
  timestamps: true
});

const UserModel = _mongoose.default.model("UserModel", UserSchema);

var _default = UserModel;
exports.default = _default;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9tb2RlbHMvVXNlci5qcyJdLCJuYW1lcyI6WyJVc2VyU2NoZW1hIiwiU2NoZW1hIiwidXNlcm5hbWUiLCJ0eXBlIiwiU3RyaW5nIiwicmVxdWlyZWQiLCJlbWFpbCIsInBhc3N3b3JkIiwidGltZXN0YW1wcyIsIlVzZXJNb2RlbCIsIm1vbmdvb3NlIiwibW9kZWwiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7QUFBQTs7Ozs7O0FBRUEsTUFBTUEsVUFBVSxHQUFJLElBQUlDLGdCQUFKLENBQ2hCO0FBQ0lDLEVBQUFBLFFBQVEsRUFBRTtBQUNOQyxJQUFBQSxJQUFJLEVBQUVDLE1BREE7QUFFTkMsSUFBQUEsUUFBUSxFQUFFLENBQUMsSUFBRCxFQUFPLG1CQUFQO0FBRkosR0FEZDtBQUtJQyxFQUFBQSxLQUFLLEVBQUU7QUFDSEgsSUFBQUEsSUFBSSxFQUFFQyxNQURIO0FBRUhDLElBQUFBLFFBQVEsRUFBRSxDQUFDLElBQUQsRUFBTyxnQkFBUDtBQUZQLEdBTFg7QUFTSUUsRUFBQUEsUUFBUSxFQUFFO0FBQ05KLElBQUFBLElBQUksRUFBRUMsTUFEQTtBQUVOQyxJQUFBQSxRQUFRLEVBQUUsQ0FBQyxJQUFELEVBQU8sbUJBQVA7QUFGSjtBQVRkLENBRGdCLEVBZWhCO0FBQ0lHLEVBQUFBLFVBQVUsRUFBRTtBQURoQixDQWZnQixDQUFwQjs7QUFvQkEsTUFBTUMsU0FBUyxHQUFHQyxrQkFBU0MsS0FBVCxDQUFlLFdBQWYsRUFBNEJYLFVBQTVCLENBQWxCOztlQUVlUyxTIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IG1vbmdvb3NlLCB7IFNjaGVtYSB9IGZyb20gXCJtb25nb29zZVwiO1xuXG5jb25zdCBVc2VyU2NoZW1hID0gIG5ldyBTY2hlbWEoXG4gICAge1xuICAgICAgICB1c2VybmFtZToge1xuICAgICAgICAgICAgdHlwZTogU3RyaW5nLFxuICAgICAgICAgICAgcmVxdWlyZWQ6IFt0cnVlLCBcIlVzZXJuYW1lIHJlcXVpcmVkXCJdXG4gICAgICAgIH0sXG4gICAgICAgIGVtYWlsOiB7XG4gICAgICAgICAgICB0eXBlOiBTdHJpbmcsXG4gICAgICAgICAgICByZXF1aXJlZDogW3RydWUsIFwiRW1haWwgcmVxdWlyZWRcIl1cbiAgICAgICAgfSxcbiAgICAgICAgcGFzc3dvcmQ6IHtcbiAgICAgICAgICAgIHR5cGU6IFN0cmluZyxcbiAgICAgICAgICAgIHJlcXVpcmVkOiBbdHJ1ZSwgXCJQYXNzd29yZCByZXF1aXJlZFwiXVxuICAgICAgICB9XG4gICAgfSxcbiAgICB7XG4gICAgICAgIHRpbWVzdGFtcHM6IHRydWVcbiAgICB9XG4pO1xuXG5jb25zdCBVc2VyTW9kZWwgPSBtb25nb29zZS5tb2RlbChcIlVzZXJNb2RlbFwiLCBVc2VyU2NoZW1hKVxuXG5leHBvcnQgZGVmYXVsdCBVc2VyTW9kZWw7Il19