// middlewares/checkRole.js
exports.isAdmin = (req, res, next) => {
    if (!req.session.userId) {
        return res.redirect('/auth/login');
    }

    User.findById(req.session.userId, (err, user) => {
        if (err || !user || user.role !== 'admin') {
            return res.status(403).send('Доступ запрещен');
        }
        next();
    });
};

exports.isEditorOrAdmin = (req, res, next) => {
    if (!req.session.userId) {
        return res.redirect('/auth/login');
    }

    User.findById(req.session.userId, (err, user) => {
        if (err || !user || (user.role !== 'admin' && user.role !== 'editor')) {
            return res.status(403).send('Доступ запрещен');
        }
        next();
    });
};
