"use strict";

const { DataTypes } = require("sequelize");
const sequelize = require("../../config/database");
const bcrypt = require("bcryptjs");

const User = sequelize.define(
  "user",
  {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER,
    },

    userType: {
      type: DataTypes.ENUM("0", "1", "2"),
    },

    firstName: {
      type: DataTypes.STRING,
    },

    lastName: {
      type: DataTypes.STRING,
    },

    email: {
      type: DataTypes.STRING,
    },

    password: {
      type: DataTypes.STRING,
    },

    confirmPassword: {
      type: DataTypes.VIRTUAL,
      validate: {
        matchesPassword() {
          if (this.password !== this.confirmPassword) {
            throw new Error("Password and confirm password must match");
          }
        },
      },
    },

    createdAt: {
      allowNull: false,
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },

    updatedAt: {
      allowNull: false,
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    freezeTableName: true,
    modelName: "user",
  }
);

// 🔐 hash password
User.beforeCreate(async (user) => {
  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(user.password, salt);
});

module.exports = User;
