const qs = require('querystring');
const crypto = require('crypto');

module.exports = (req, res, next) => {
    if (process.env.NODE_ENV === 'development') {
        req.app.set('authData', { vk_user_id: "MOCK_USER_ID" });
        return next();
    }
    
    try {
        const header = req.headers.authorization;

        if (header) {
            const authData = JSON.parse(header);
            const ordered = {};

            Object.keys(authData).sort().forEach((key) => {
                if (key.slice(0, 3) === 'vk_') {
                    ordered[key] = authData[key];
                }
            });

            const stringParams = qs.stringify(ordered);
            const paramsHash = crypto
                .createHmac('sha256', process.env.VK_SECRET_KEY)
                .update(stringParams)
                .digest()
                .toString('base64')
                .replace(/\+/g, '-')
                .replace(/\//g, '_')
                .replace(/=$/, '');

            if (paramsHash === authData.sign) {
                req.app.set('authData', authData);

                next();
            } else {
                res.status(403).json({ error: 'Bad sign' });
            }

        } else {
            res.status(403).json({ error: 'Bad auth header' });
        }

    } catch (e) {
        res.status(500).json({ error: 'Server error', message: e.message });
    }
}