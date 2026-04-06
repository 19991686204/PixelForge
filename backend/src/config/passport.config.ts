import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';
import User from '../models/User.model';
import bcrypt from 'bcrypt';

// JWT 策略配置
const jwtOptions = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWT_SECRET || 'pixelforge-jwt-secret',
};

// JWT 策略
passport.use(new JwtStrategy(jwtOptions, async (payload, done) => {
  try {
    const user = await User.findById(payload.userId).select('-password');
    if (user) {
      return done(null, user);
    } else {
      return done(null, false);
    }
  } catch (error) {
    return done(error, false);
  }
}));

// 本地策略（用于用户名/密码登录）
passport.use(new LocalStrategy({
  usernameField: 'email',
  passwordField: 'password',
}, async (email, password, done) => {
  try {
    // 验证输入参数
    if (!email || !password) {
      return done(null, false, { message: '邮箱和密码不能为空' });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return done(null, false, { message: '用户不存在' });
    }

    const isMatch = await bcrypt.compare(password, user.password!);
    if (!isMatch) {
      return done(null, false, { message: '密码错误' });
    }

    return done(null, user);
  } catch (error) {
    return done(error);
  }
}));

// 序列化用户
passport.serializeUser((user: any, done) => {
  done(null, user._id);
});

// 反序列化用户
passport.deserializeUser(async (id: any, done) => {
  try {
    const user = await User.findById(id).select('-password');
    done(null, user);
  } catch (error) {
    done(error);
  }
});

export default passport;