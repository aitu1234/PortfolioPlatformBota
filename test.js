const bcrypt = require('bcrypt');

const hash = '$2b$10$MFScvpqoKC.Vx1gdkVsDV.XF8HeNRvR6C0dxN7OKJ.kCLsDvTf2bu';
const getHash = '$2b$10$gRd4dqSZ9rOQ2w1SQJ8LrOLlKTY27fWXjFn6Kj3z9TL.050hWpho.';
const password = 'zxc';

bcrypt.compare(password, hash, (err, result) => {
    if (err) {
        console.error('Ошибка:', err);
    } else if (result) {
        console.log('Пароль совпадает с хешем.');
    } else {
        console.log('Пароль не совпадает с хешем.');
    }
});
