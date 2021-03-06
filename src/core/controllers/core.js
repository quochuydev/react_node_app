const path = require("path");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");

const UserMD = mongoose.model("User");
const { ShopModel } = require(path.resolve("./src/shop/models/shop"));

const _is = require(path.resolve("./client/src/share/_is.lib.share.js"));
const { CustomerModel } = require(path.resolve(
  "./src/customers/models/customers.js"
));
// const { getToken, url } = require("./google");
const config = require(path.resolve("./src/config/config"));

async function assertUserShop(email) {
  let user = await UserMD.findOne({ email }).lean(true);
  if (!user) {
    let shop_data = {
      name: email,
      code: email,
      google_info: userAuth,
      user_created: {
        email,
      },
    };
    let new_shop = await ShopModel.create(shop_data);
    let new_user = {
      email,
      is_root: true,
    };
    user = await UserMD.create(new_user);

    let guest_customer = {
      first_name: "Khách hàng lẻ",
      type: "GUEST",
    };
    await CustomerModel.create(guest_customer);
  }
  return user;
}

let auth = async (req, res) => {
  try {
    // let { code } = req.query;
    // const { tokens } = await getToken(code);
    // let userAuth = jwt.decode(tokens.id_token);
    // let { email } = userAuth;
    // if (!email) {
    //   return res.sendStatus(401);
    // }
    // let user = await assertUserShop(email);
    // let user_gen_token = {
    //   id: user.id,
    //   email: user.email,
    //   exp: (Date.now() + 8 * 60 * 60 * 1000) / 1000,
    // };
    // let userToken = jwt.sign(user_gen_token, config.hash_token);
    // res.redirect(`${config.frontend_admin}/loading?token=${userToken}`);
  } catch (error) {
    console.log(error);
    res.redirect(
      `${config.frontend_admin}/login?message=${encodeURIComponent(
        "Something errror!"
      )}`
    );
  }
};

async function changeShop({ user }) {
  let result = {};
  let found_user = await UserMD.findOne({ email: user.email }).lean(true);
  if (!found_user) {
    throw { message: "Không thể chuyển cửa hàng", code: "USER_NOT_FOUND" };
  }

  let user_gen_token = {
    id: found_user.id,
    email: found_user.email,
    exp: (Date.now() + 8 * 60 * 60 * 1000) / 1000,
  };

  let userToken = jwt.sign(user_gen_token, config.hash_token);
  result.url = `${config.frontend_admin}/loading?token=${userToken}`;
  return result;
}

async function checkUser({ body }) {
  let verify_user = jwt.verify(body.token, config.hash_token);
  if (!verify_user.email) {
    throw { message: "check user failed" };
  }
  let group_users = await UserMD.aggregate([
    { $match: { email: verify_user.email, is_deleted: false } },
    { $group: { _id: "$email" } },
  ]);
  if (!(group_users && group_users.length)) {
    throw { message: "check user failed" };
  }
  let group_user = group_users[0];
  let shops = await ShopModel.find({ id: { $in: group_user.shops } }).lean(
    true
  );
  let shop = await ShopModel.findOne({}).lean(true);
  let user = { id: verify_user.id, email: group_user._id, shops, shop };
  return { error: false, user };
}

async function signup(req, res, next) {
  try {
    let { email, password, is_create_shop, name, code, phone } = req.body;

    if (!password) {
      return res.status(400).json({ message: "Nhập mật khẩu" });
    }

    let count_shop_by_code = await ShopModel.count({ code });
    if (count_shop_by_code) {
      code = `${code}-${String(Math.ceil(Math.random() * 10000))}`;
    }

    if (is_create_shop) {
      if (!name) {
        return res.status(400).json({
          message: "Thiếu thông tin tên cửa hàng",
          code: "name_required",
        });
      }
      if (!code) {
        return res.status(400).json({ message: "Thiếu mã code" });
      }

      if (!email) {
        return res
          .status(400)
          .json({ message: "Thiếu thông tin Email", code: "email_required" });
      }

      if (email && !_is.email(email)) {
        return res.status(400).json({ message: "Email không đúng định dạng" });
      }

      let shop_data = {
        name,
        code,
        user_created: {
          email,
          phone,
        },
      };
      let shop = await ShopModel.create(shop_data);
      let new_user = {
        email,
        phone,
        username: phone,
        first_name: email,
        last_name: email,
        password,
        is_root: true,
      };
      let user = await UserMD.create(new_user);
      return res.json({
        message: "Đăng ký thành công",
        shop,
        user,
        code: "CREATE_NEW_SHOP_SUCCESS",
      });
    } else {
      let found_user = await UserMD.findOne({ email }).lean(true);
      if (found_user) {
        return res.json({ message: "Email này đã tồn tại" });
      }
      let new_user = {
        email,
        phone,
        first_name: email,
        last_name: email,
      };
      let user = await UserMD.create(new_user);
      return res.json({
        message: "Đăng ký thành công",
        user,
        code: "CREATE_NEW_USER_SUCCESS",
      });
    }
  } catch (error) {
    console.log(error);
    next(error);
  }
}

let login = async (req, res, next) => {
  try {
    let { user_login, password } = req.body;
    if (!user_login) {
      throw { message: `Vui lòng nhập 'email' hoặc 'Số điện thoại'!` };
    }
    let user = null;
    let users = await UserMD.find({ email: user_login }).lean(true);
    if (!(users && users.length)) {
      throw { message: `User này không tồn tại` };
    }
    for (const user_found of users) {
      if (UserMD.authenticate(user_found, password)) {
        user = user_found;
      }
    }
    if (!user) {
      throw {
        statusCode: 401,
        message: `Mật khẩu không đúng hoặc Tài khoản không tồn tại`,
      };
    }
    let user_gen_token = {
      id: user.id,
      email: user.email,
      exp: (Date.now() + 8 * 60 * 60 * 1000) / 1000,
    };
    let userToken = jwt.sign(user_gen_token, config.hash_token);
    res.json({
      error: false,
      token: userToken,
      url: `${config.frontend_admin}/loading?token=${userToken}`,
    });
  } catch (error) {
    next(error);
  }
};

function loginGoogle(req, res) {
  res.json({ error: false, url });
}

let logout = (req, res) => {
  res.json({ error: false, code: "LOGOUT" });
};

let logout_redirect = (req, res) => {
  res.redirect(`${config.frontend_admin}/logout`);
};

module.exports = {
  auth,
  login,
  loginGoogle,
  logout,
  logout_redirect,
  signup,
  changeShop,
  checkUser,
};
