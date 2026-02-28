const crypto = require("crypto");

exports.encrypt = function (plainText, workingKey) {
    const iv = Buffer.alloc(16, 0); // 16 bytes IV filled with zeros
    const key = crypto.createHash("md5").update(workingKey).digest(); // MD5 hash of working key

    const cipher = crypto.createCipheriv("aes-128-cbc", key, iv);

    let encrypted = cipher.update(plainText, "utf8", "hex");
    encrypted += cipher.final("hex");

    return encrypted;
};

exports.decrypt = function (encryptedText, workingKey) {
    const iv = Buffer.alloc(16, 0);
    const key = crypto.createHash("md5").update(workingKey).digest();

    const decipher = crypto.createDecipheriv("aes-128-cbc", key, iv);

    let decrypted = decipher.update(encryptedText, "hex", "utf8");
    decrypted += decipher.final("utf8");

    return decrypted;
};