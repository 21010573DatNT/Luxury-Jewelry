const cloudinary = require('cloudinary').v2;

cloudinary.config({
    // cloud_name: 'tienduy2003',
    // api_key: '225841868995845',       // Thay bằng api_key của bạn
    // api_secret: 'vFg_IUlqLAfHXTsW3LHCDzfgqOA', // Thay bằng api_secret của bạn

    cloud_name: 'thanhdaw',
    api_key: '669985569292263',       // Thay bằng api_key của bạn
    api_secret: 'wd2-7f9d7GyG8Fsq13WM5ed5NdY',
});

module.exports = cloudinary;
