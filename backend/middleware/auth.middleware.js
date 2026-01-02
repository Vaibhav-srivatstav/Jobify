export default function (req, res, next) {
    // Frontend must send this header!
    // Example: "x-user-id": "user_12345"
    const userId = req.header('x-user-id');

    if (!userId) {
        return res.status(401).json({ msg: 'No user ID provided in headers' });
    }

    // We trust the frontend and inject the ID into the request
    req.user = { id: userId };
    next();
}