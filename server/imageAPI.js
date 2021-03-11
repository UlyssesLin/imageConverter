var jimp = require('jimp');

async function handleImageConversion(image, commands) {
    image = await jimp.read(image);

    for (var commandName of Object.keys(commands)) {
        switch(commandName) {
            case 'flipHorizontal':
                image = flipHorizontal(image);
                break;
            case 'flipVertical':
                image = flipVertical(image);
                break;
            case 'rotate': // [<degrees - negative OK>]
                image = rotate(image, commands[commandName][0]);
                break;
            case 'grayscale':
                image = grayscale(image);
                break;
            case 'resize': // [<width>, <height>]
                image = resize(image, commands[commandName][0], commands[commandName][1]);
                break;
            case 'thumbNail':
                image = thumbNail(image);
                break;
            case 'rotateLeft':
                image = rotateLeft(image);
                break;
            case 'rotateRight':
                image = rotateRight(image);
                break;
        }
    }

    return image;
}

function flipHorizontal (image) {
    return image.flip(true, false);
}

function flipVertical (image) {
    return image.flip(false, true);
}

function rotate (image, strDegrees) {
    var intDegrees = parseInt(strDegrees);

    if (strDegrees.includes('-')) {
        intDegrees = 360 + intDegrees;
    }
    return image.rotate(intDegrees);
}

function grayscale (image) {
    return image.color([{ apply: 'desaturate', params: [100] }]);
}

function resize (image, x, y) {
    return image.resize(parseInt(x), parseInt(y));
}

function thumbNail (image) {
    return image.resize(jimp.AUTO, 120); // uniform height of 200px, auto width
}

function rotateLeft (image) {
    return image.rotate(90);
}

function rotateRight (image) {
    return image.rotate(270);
}

// TEST JIMP
var getImageAndCommands = (req, res) => {
    if (req && req.body && req.body.image && req.body.commands) {
        var image = req.body.image,
            commands = req.body.commands;

        handleImageConversion(image, commands).then(resultImage => {
            resultImage.getBase64(jimp.AUTO, (err, base64) => {
                res.json(base64);
            });
        });
    } else {
        return res.status(500).send("Please provide an image and command(s).");
    }
};

//------------COMMANDS------------
// (Invoke-WebRequest -UseBasicParsing http://localhost:3001/api/getImageAndCommands/ -ContentType "application/json" -Method POST -Body '{"image":"https://i.pinimg.com/474x/14/a3/56/14a35692b23635433909bf94e626d8f3.jpg","commands":{"flipHorizontal":[]}}').Content
// (Invoke-WebRequest -UseBasicParsing http://localhost:3001/api/getImageAndCommands/ -ContentType "application/json" -Method POST -Body '{"image":"https://i.pinimg.com/474x/14/a3/56/14a35692b23635433909bf94e626d8f3.jpg","commands":{"flipVertical":[]}}').Content
// (Invoke-WebRequest -UseBasicParsing http://localhost:3001/api/getImageAndCommands/ -ContentType "application/json" -Method POST -Body '{"image":"https://i.pinimg.com/474x/14/a3/56/14a35692b23635433909bf94e626d8f3.jpg","commands":{"rotate":["125"]}}').Content
// (Invoke-WebRequest -UseBasicParsing http://localhost:3001/api/getImageAndCommands/ -ContentType "application/json" -Method POST -Body '{"image":"https://i.pinimg.com/474x/14/a3/56/14a35692b23635433909bf94e626d8f3.jpg","commands":{"grayscale":[]}}').Content
// (Invoke-WebRequest -UseBasicParsing http://localhost:3001/api/getImageAndCommands/ -ContentType "application/json" -Method POST -Body '{"image":"https://i.pinimg.com/474x/14/a3/56/14a35692b23635433909bf94e626d8f3.jpg","commands":{"resize":["30","30"]}}').Content
// (Invoke-WebRequest -UseBasicParsing http://localhost:3001/api/getImageAndCommands/ -ContentType "application/json" -Method POST -Body '{"image":"https://i.pinimg.com/474x/14/a3/56/14a35692b23635433909bf94e626d8f3.jpg","commands":{"thumbNail":[]}}').Content
// (Invoke-WebRequest -UseBasicParsing http://localhost:3001/api/getImageAndCommands/ -ContentType "application/json" -Method POST -Body '{"image":"https://i.pinimg.com/474x/14/a3/56/14a35692b23635433909bf94e626d8f3.jpg","commands":{"rotateLeft":[]}}').Content
// (Invoke-WebRequest -UseBasicParsing http://localhost:3001/api/getImageAndCommands/ -ContentType "application/json" -Method POST -Body '{"image":"https://i.pinimg.com/474x/14/a3/56/14a35692b23635433909bf94e626d8f3.jpg","commands":{"rotateRight":[]}}').Content

module.exports = {
    getImageAndCommands
};