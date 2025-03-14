/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
import io from "socket.io-client";
import { userService } from "./users/user.service.remote";

export const SOCKET_EVENT_ADD_MSG = "chat-add-msg";
export const SOCKET_EMIT_SEND_MSG = "chat-send-msg";
export const SOCKET_EMIT_SET_TOPIC = "chat-set-topic";
export const SOCKET_EMIT_USER_WATCH = "user-watch";
export const SOCKET_EVENT_USER_UPDATED = "user-updated";
export const SOCKET_EMIT_USER_FOLLOWED = "user-emit-followed";
export const SOCKET_EVENT_USER_FOLLOWED = "user-event-followed";
export const SOCKET_EMIT_USER_LIKED = "user-emit-liked";
export const SOCKET_EVENT_USER_LIKED = "user-event-liked";
export const SOCKET_EMIT_USER_COMMENT = "user-emit-comment";
export const SOCKET_EVENT_USER_COMMENT = "user-event-comment";
const SOCKET_EMIT_LOGIN = "set-user-socket";
const SOCKET_EMIT_LOGOUT = "unset-user-socket";

const baseUrl = process.env.NODE_ENV === "production" ? "" : "//localhost:4000";
export const socketService = createSocketService();

window.socketService = socketService;

socketService.setup();

function createSocketService() {
  var socket = null;
  const socketService = {
    setup() {
      socket = io(baseUrl);
      const user = userService.getLoggedinUser();
      if (user) this.login(user._id);
    },
    on(eventName, cb) {
      socket.on(eventName, cb);
    },
    off(eventName, cb = null) {
      if (!socket) return;
      if (!cb) socket.removeAllListeners(eventName);
      else socket.off(eventName, cb);
    },
    emit(eventName, data) {
      socket.emit(eventName, data);
    },
    login(userId) {
      socket.emit(SOCKET_EMIT_LOGIN, userId);
    },
    logout() {
      socket.emit(SOCKET_EMIT_LOGOUT);
    },
    terminate() {
      socket = null;
    },
  };
  return socketService;
}

function createDummySocketService() {
  var listenersMap = {};
  const socketService = {
    listenersMap,
    setup() {
      listenersMap = {};
    },
    terminate() {
      this.setup();
    },
    login() {
      console.log("Dummy socket service here, login - got it");
    },
    logout() {
      console.log("Dummy socket service here, logout - got it");
    },
    on(eventName, cb) {
      listenersMap[eventName] = [...(listenersMap[eventName] || []), cb];
    },
    off(eventName, cb) {
      if (!listenersMap[eventName]) return;
      if (!cb) delete listenersMap[eventName];
      else
        listenersMap[eventName] = listenersMap[eventName].filter(
          (l) => l !== cb
        );
    },
    emit(eventName, data) {
      var listeners = listenersMap[eventName];
      if (eventName === SOCKET_EMIT_SEND_MSG) {
        listeners = listenersMap[SOCKET_EVENT_ADD_MSG];
      }

      if (!listeners) return;

      listeners.forEach((listener) => {
        listener(data);
      });
    },
    // Functions for easy testing of pushed data
    testChatMsg() {
      this.emit(SOCKET_EVENT_ADD_MSG, {
        from: "Someone",
        txt: "Aha it worked!",
      });
    },
    testUserUpdate() {
      this.emit(SOCKET_EVENT_USER_UPDATED, {
        ...userService.getLoggedinUser(),
        score: 555,
      });
    },
  };
  window.listenersMap = listenersMap;
  return socketService;
}
