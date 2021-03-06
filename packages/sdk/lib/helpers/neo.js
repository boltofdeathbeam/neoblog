"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.executeInvoke = exports.testInvoke = exports.createInvoke = exports.getBalance = exports.getStorage = exports.determineKey = void 0;

var axios = _interopRequireWildcard(require("axios"));

var _neonJs = _interopRequireWildcard(require("@cityofzion/neon-js"));

var _neoHttpsProxy = require("@be-neo/neo-https-proxy");

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; return newObj; } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } } function _next(value) { step("next", value); } function _throw(err) { step("throw", err); } _next(); }); }; }

var s2h = _neonJs.u.str2hexstring;
var sb = _neonJs.default.create.scriptBuilder;
var httpsProxy = "https://wt-eb8e8a5788a32c0054649520e12aca04-0.sandbox.auth0-extend.com/neo-https-proxy";

var determineKey = function determineKey(key) {
  if (_neonJs.wallet.isNEP2(key)) return "NEP2";
  if (_neonJs.wallet.isWIF(key)) return "WIF";
  return false;
};
/**
 * Gets the value out of a key from a contract on the NEO Blockchain
 * @param {string} host Host endpoint
 * @param {string} contract Contract address
 * @param {string} key Key - to - search
 */


exports.determineKey = determineKey;

var getStorage =
/*#__PURE__*/
function () {
  var _ref = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee2(host, contract, key) {
    var client;
    return regeneratorRuntime.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            _context2.next = 2;
            return _neonJs.api.neonDB.getRPCEndpoint(host);

          case 2:
            client = _context2.sent;
            return _context2.abrupt("return", new Promise(
            /*#__PURE__*/
            function () {
              var _ref2 = _asyncToGenerator(
              /*#__PURE__*/
              regeneratorRuntime.mark(function _callee(resolve, reject) {
                var response;
                return regeneratorRuntime.wrap(function _callee$(_context) {
                  while (1) {
                    switch (_context.prev = _context.next) {
                      case 0:
                        _context.prev = 0;
                        _context.next = 3;
                        return (0, _neoHttpsProxy.queryHttpsProxy)(client, {
                          method: "getstorage",
                          params: [contract, key]
                        }, httpsProxy);

                      case 3:
                        response = _context.sent;
                        // const response = await rpc.queryRPC(client, {
                        //   method: "getstorage",
                        //   params: [contract, key]
                        // });
                        if (response.result) resolve(response.result);else reject({
                          error: "No result found!"
                        });
                        _context.next = 11;
                        break;

                      case 7:
                        _context.prev = 7;
                        _context.t0 = _context["catch"](0);
                        console.log("error!");
                        reject(_context.t0);

                      case 11:
                      case "end":
                        return _context.stop();
                    }
                  }
                }, _callee, this, [[0, 7]]);
              }));

              return function (_x4, _x5) {
                return _ref2.apply(this, arguments);
              };
            }()));

          case 4:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2, this);
  }));

  return function getStorage(_x, _x2, _x3) {
    return _ref.apply(this, arguments);
  };
}();
/**
 * Queries the Blockchain DB for a user's current balance
 * @param {string} host Host endpoint
 * @param {string} neoAddress User address
 */


exports.getStorage = getStorage;

var getBalance =
/*#__PURE__*/
function () {
  var _ref3 = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee3(host, neoAddress) {
    var query, _query$data, net, address, balances;

    return regeneratorRuntime.wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            _context3.next = 2;
            return axios.get("".concat(host, "/v2/address/balance/").concat(neoAddress));

          case 2:
            query = _context3.sent;
            _query$data = query.data, net = _query$data.net, address = _query$data.address; // Create Balance object

            balances = new _neonJs.wallet.Balance({
              net: net,
              address: address
            });
            balances.addAsset("NEO", query.data.NEO);
            balances.addAsset("GAS", query.data.GAS);
            return _context3.abrupt("return", balances);

          case 8:
          case "end":
            return _context3.stop();
        }
      }
    }, _callee3, this);
  }));

  return function getBalance(_x6, _x7) {
    return _ref3.apply(this, arguments);
  };
}();
/**
 * Create an invoke out of your params
 * @param {string} scriptHash Contract address
 * @param {string} operation Operation string
 * @param {array} args Argument array
 */


exports.getBalance = getBalance;

var createInvoke = function createInvoke(scriptHash, operation, args) {
  return {
    scriptHash: scriptHash,
    operation: operation,
    args: args
  };
};
/**
 *
 * @param {string} host Host endpoint
 * @param {object} invoke Invoke data
 */


exports.createInvoke = createInvoke;

var testInvoke =
/*#__PURE__*/
function () {
  var _ref4 = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee4(host, invoke) {
    var client, vmScript;
    return regeneratorRuntime.wrap(function _callee4$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            _context4.next = 2;
            return _neonJs.api.neonDB.getRPCEndpoint(host);

          case 2:
            client = _context4.sent;
            // Create SC script
            vmScript = sb().emitAppCall(invoke.scriptHash, invoke.operation, invoke.args, false); // Execute

            return _context4.abrupt("return", (0, _neoHttpsProxy.queryHttpsProxy)(client, {
              method: "invokescript",
              params: [vmScript.str]
            }, httpsProxy));

          case 5:
          case "end":
            return _context4.stop();
        }
      }
    }, _callee4, this);
  }));

  return function testInvoke(_x8, _x9) {
    return _ref4.apply(this, arguments);
  };
}();
/**
 *
 * @param {string} host Host endpoint
 * @param {object} account Account data
 * @param {object} invoke Invoke data
 * @param {number} gasCost Default 0
 * @param {array} intents Intent array
 */


exports.testInvoke = testInvoke;

var executeInvoke =
/*#__PURE__*/
function () {
  var _ref5 = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee5(host, account, invoke, gasCost, intents) {
    var client, script, balances, unsignedTx, signedTx;
    return regeneratorRuntime.wrap(function _callee5$(_context5) {
      while (1) {
        switch (_context5.prev = _context5.next) {
          case 0:
            _context5.next = 2;
            return _neonJs.api.neonDB.getRPCEndpoint(host);

          case 2:
            client = _context5.sent;
            // Create SC script
            script = sb().emitAppCall(invoke.scriptHash, invoke.operation, invoke.args, false); // Create TX

            _context5.next = 6;
            return getBalance(host, account.address);

          case 6:
            balances = _context5.sent;
            unsignedTx = _neonJs.tx.Transaction.createInvocationTx(balances, intents, script.str, gasCost, {
              version: 1
            }); // Sign TX

            signedTx = _neonJs.tx.signTransaction(unsignedTx, account.privateKey); // Invoke

            return _context5.abrupt("return", (0, _neoHttpsProxy.queryHttpsProxy)(client, {
              method: "sendrawtransaction",
              params: [_neonJs.tx.serializeTransaction(signedTx)],
              id: 1
            }, httpsProxy));

          case 10:
          case "end":
            return _context5.stop();
        }
      }
    }, _callee5, this);
  }));

  return function executeInvoke(_x10, _x11, _x12, _x13, _x14) {
    return _ref5.apply(this, arguments);
  };
}();

exports.executeInvoke = executeInvoke;