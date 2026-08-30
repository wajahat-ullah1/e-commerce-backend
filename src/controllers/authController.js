const authService = require("../services/authService");

exports.register = async (req, res) => {
    try {

        const { name, email, phone, password } = req.body;

        const user = await authService.registerUser({
            name,
            email,
            phone,
            password
        });

        res.status(201).json({
            message: "User registered successfully",
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                phone: user.phone,
                role: user.role
            }
        });

    } catch (error) {

        res.status(400).json({
            message: error.message
        });
    }
};