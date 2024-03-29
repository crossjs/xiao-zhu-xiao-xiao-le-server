import { Application } from "egg";
import * as utility from "utility";

/**
 * 玩家
 */
export default (app: Application) => {
  const { mongoose, g4 } = app;
  const { Schema } = mongoose;

  const UserSchema = new Schema({
    provider: {
      type: String,
    },
    openId: {
      type: String,
    },
    unionId: {
      type: String,
    },
    username: {
      type: String,
      lowercase: true,
      required: true,
    },
    password: {
      type: String,
    },
    salt: {
      type: String,
    },
    // 游戏化信息
    nickname: {
      type: String,
    },
    gender: {
      type: Number,
      default: 0,
    },
    country: {
      type: String,
    },
    province: {
      type: String,
    },
    city: {
      type: String,
    },
    language: {
      type: String,
    },
    avatar: {
      type: String,
    },
    coins: {
      type: Number,
      default: 0,
    },
    points: {
      type: Number,
      default: 0,
    },
    // 以下 PVE
    score: { // 最好分数
      type: Number,
      default: 0,
    },
    level: { // 最高难度
      type: Number,
      default: 0,
    },
    combo: { // 最大连击
      type: Number,
      default: 0,
    },
    scores: { // 累计获得分数
      type: Number,
      default: 0,
    },
    played: { // 累计完成局数
      type: Number,
      default: 0,
    },
    // 以下 PVP
    won: { // 累计获胜局数
      type: Number,
      default: 0,
    },
    lost: { // 累计失败局数
      type: Number,
      default: 0,
    },
    // 联系信息
    mobile: {
      type: Number,
    },
    email: {
      type: String,
    },
    // 登录信息
    // TODO 增加有效期
    accessToken: {
      type: String,
    },
    enabled: {
      type: Boolean,
      default: true,
    },
  }, {
    toJSON: {
      virtuals: true,
    },
    timestamps: true,
  });

  UserSchema.index({ username: 1 }, { unique: true, sparse: true });
  UserSchema.index({ email: 1 }, { unique: true, sparse: true });
  UserSchema.index({ mobile: 1 }, { unique: true, sparse: true });
  UserSchema.index({ openId: 1, provider: 1 }, { unique: true, sparse: true });
  UserSchema.index({ accessToken: 1 });

  UserSchema.virtual("avatarUrl").get(function () {
    const { avatar, email } = this;
    if (avatar) {
      if (/^http/.test(avatar)) {
        return avatar;
      }
      return `${app.config.uploadFilePrefix}${this.avatar}`;
    }

    if (email) {
      // 使用 gravatar
      return `https://gravatar.com/avatar/${utility.md5(email.toLowerCase())}?size=96`;
    }

    return "";
  });

  return g4.model("User", UserSchema);
};
