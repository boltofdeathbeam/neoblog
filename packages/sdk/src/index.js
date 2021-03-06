// Babel
import "@babel/polyfill";

// Imports
import {
  getBestRPCNode,
  getLatest,
  getLatestPost,
  getArticle,
  getArticleData,
  getUserData,
  getAddressFromUserId
} from "./functions/neo/getters";
import {
  processAuthentication,
  createAccount,
  generateJwt,
  decodeJwt
} from "./functions/neo/account";
import {
  deserialize,
  scriptHashToAddress,
  addressToScriptHash,
  unhex,
  hexToTimestamp,
  param
} from "./helpers/conversion";
import { determineKey } from "./helpers/neo";
import { handleInvoke, updateUsername } from "./functions/neo/setters";
import { getFromGateway } from "./functions/ipfs/fetch";

export default class Neoblog {
  constructor(host, contract, account = undefined) {
    this.host = host;
    this.contract = contract;

    if (account) {
      const decodedAccount = decodeJwt(account);
      this.account = decodedAccount;
    } else this.account = undefined;

    this.getLatest = this.getLatest.bind(this);
    this.getLatestPost = this.getLatestPost.bind(this);
    this.getArticle = this.getArticle.bind(this);
    this.getArticleData = this.getArticleData.bind(this);
    this.getUserData = this.getUserData.bind(this);
    this.getAddressFromUserId = this.getAddressFromUserId.bind(this);
    this.processAuthentication = this.processAuthentication.bind(this);
  }

  executeGetter(getter, param) {
    return param
      ? getter(this.host, this.contract, param)
      : getter(this.host, this.contract);
  }

  executeSetter(setter, operation, args) {
    return setter(this.host, this.contract, this.account, operation, args);
  }

  getLatest(domain) {
    return this.executeGetter(getLatest, domain);
  }

  getLatestPost() {
    return this.executeGetter(getLatestPost);
  }

  getArticle(domainPre, index) {
    const data = { domainPre, index };
    return this.executeGetter(getArticle, data);
  }

  getArticleData(article) {
    return this.executeGetter(getArticleData, article);
  }

  getUserData(user) {
    return this.executeGetter(getUserData, user);
  }

  getAddressFromUserId(userId) {
    return this.executeGetter(getAddressFromUserId, userId);
  }

  async processAuthentication(token, password) {
    const WIF = processAuthentication(token, password);
    if (WIF) {
      const account = createAccount(WIF);
      const address = account.address;
      const privateKey = account.privateKey;

      const userName = await this.getUserData(address);
      this.account = { WIF, address, privateKey, userName };

      if (typeof Storage !== "undefined") {
        const jwt = this.generateJwt(this.account);
        localStorage.setItem("neoblogAccount", jwt);
      }
      return true;
    }

    return false;
  }

  generateJwt(userObject, secret = "neoblog") {
    return generateJwt(userObject, secret);
  }

  submitPost(postHash, category) {
    const address = addressToScriptHash(this.account.address);

    return this.executeSetter(handleInvoke, "submitPost", [
      param.string(address),
      param.string(postHash),
      param.string(category)
    ]);
  }

  updateUsername(newUserName, oldUserName = "undefined") {
    const address = addressToScriptHash(this.account.address);

    this.account.userName = newUserName;
    if (typeof Storage !== "undefined") {
      const jwt = this.generateJwt(this.account);
      localStorage.setItem("neoblogAccount", jwt);
    }

    return this.executeSetter(handleInvoke, "manageUser", [
      param.string(address),
      param.string(newUserName),
      param.string(oldUserName)
    ]);
  }

  getAccount() {
    return this.account;
  }
}
export {
  determineKey,
  addressToScriptHash,
  scriptHashToAddress,
  unhex,
  deserialize,
  hexToTimestamp,
  getBestRPCNode,
  getFromGateway
};
