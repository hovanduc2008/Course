const usersDB = {
    users: require("../model/users.json"),
    setUser: function (data) {
        this.users = data;
    },
};

const jwt = require("jsonwebtoken");
require("dotenv").config();
const fsPromises = require("fs").promises;
const path = require("path");

const bcrypt = require("bcrypt");
const handleLogin = async function (req, res) {
    const { user, password } = req.body;

    if (!user || !password) {
        return res.status(400).json({ message: "Username or Password are required" });
    }

    const foundUser = usersDB.users.find((person) => person.username === user);
    if (!foundUser) return res.sendStatus(401); //Unauthorized
    // Evaluate Password
    const match = await bcrypt.compare(password, foundUser.password);

    if (match) {
        const roles = Object.values(foundUser.roles);

        // Create JWTs
        const accessToken = jwt.sign(
            {
                UserInfo: {
                    username: foundUser.username,
                    roles: roles,
                },
            },
            process.env.ACCESS_TOKEN_SECRET,
            { expiresIn: "30s" },
        );
        const refreshToken = jwt.sign(
            { username: foundUser.username },
            process.env.REFRESH_TOKEN_SECRET,
            { expiresIn: "1d" },
        );

        // Saving Refresh Token with current user
        const otherUser = usersDB.users.filter((person) => person.username !== foundUser.username);
        const currentUser = { ...foundUser, refreshToken };
        usersDB.setUser([...otherUser, currentUser]);

        await fsPromises.writeFile(
            path.join(__dirname, "..", "model", "users.json"),
            JSON.stringify(usersDB.users),
        );

        res.cookie("jwt", refreshToken, {
            httpOnly: true,
            sameSite: "None",
            secure: true,
            maxAge: 24 * 60 * 60 * 1000,
        });
        res.json({
            accessToken,
        });
    } else return res.sendStatus(401);
};

module.exports = { handleLogin };
