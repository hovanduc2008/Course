const usersDB = {
    users: require("../model/users.json"),
    setUser: function (data) {
        this.users = data;
    },
};

const fsPromises = require("fs").promises;
const path = require("path");
const bcrypt = require("bcrypt");

const handleNewUser = async (req, res) => {
    const { user, password } = req.body;

    if (!user || !password) {
        return res.status(400).json({ message: "Username or Password are required" });
    }

    // check for duplicate usernames in the db

    const duplicate = usersDB.users.find((person) => person.username === user);
    if (duplicate) return res.sendStatus(409);
    try {
        //encrypt the password
        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = {
            username: user,
            roles: {
                User: 2001,
            },
            password: hashedPassword,
        };
        usersDB.setUser([...usersDB.users, newUser]);
        await fsPromises.writeFile(
            path.join(__dirname, "..", "model", "users.json"),
            JSON.stringify(usersDB.users),
        );
        console.log(usersDB.users);
        res.status(201).json({
            success: `New user ${user} created`,
        });
    } catch (err) {
        res.status(500).json({
            message: err.message,
        });
    }
};

module.exports = { handleNewUser };
