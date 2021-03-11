Ulysses Lin
CPSC5200 WI 2021
Individual Project Writeup 2.0

## The System
<img src="images\readme_diagram.png">

There is a client and a server. The client is responsible for making each API call and the server is responsible for listening in to the calls and responding with resultant modified image data. My  application, which takes in client commands, interprets them and applies needed logic before utilizing the JavaScript image processing library called Jimp API, and gives the response (mutated image) back to the client later.
Each call contains an image URL as a string, an API call name (or multiple, in sequential order), and parameters (if any) associated with each call. The application listens for the particular calls, gets the parameters, repackages the information into a suitable Jimp method call, and returns the result.
The API should be deployed in Azure, with no database involved – the application is stateless and the image and its modification are simply passed in requests/responses. There is no UI; the user communicates with the API via Invoke-WebRequest/Postman/etc. sending in an image converted to a string via an HTTP POST.
Sample Code
Below is truncated controller code handling reading the image string into Jimp, going through the given commands, and exhibiting the “flipHorizontal” function. This code will be exported via the Express framework routes, and will be hit after a request has been received.
var jimp = require('jimp');

```
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
            // …
        }
    }

    return image;
}

function flipHorizontal (image) {
    return image.flip(true, false);
}
```

## Thoughts
The focus here is on the simplicity of the system; the client sends over a POST with image and commands, and the server responds with the converted image in Base64. The application really only has one controller object with one interface – send in an image, and commands in an object. Communicating with that interface is consistent and there is only way to communicate with the application – for example, you are not sending over the image first, then commands in separate calls. There is standardization with sending over the same type of POSTs each time. The server also does not save state, but rather simply takes the image as a URL string, transforms it, and returns it. No need to save image data to the server on a database, and as such, no storage or security issues as there is no copy. The image data is forgotten after the response is given.
For the Service Design Pattern, I struggled with what would suit the situation the best; my choice of architectural pattern here was very subject to my possibly misguided comprehension of various patterns. An initial consideration was the RPC API (18); the simplicity of the client sending a procedure name and parameters fits the bill. I thought about Message API (27), but the focus seemed to be on the message being independent of any remote procedure. Also, it seemed to be about the server having to figure out by the content what the best procedure to execute was. My application is fairly straight-forward in message structure and content, and I do not mind coupling with remote procedures. Another Service Design Pattern I considered was Resource API (38) – the appeal with this was the focus on resource modification and the targeting of specific URIs with server methods (such as POST). Another benefit of this pattern was that you do not need to wrap the image in a message envelope that needs additional protocols. My justification for using Resource API is that focus on sending a representation to a service for alteration, and the RESTful state transfer via request/response only, and the contract mandating representation format (string).
I also came across Service Connector (168). The client does not need to be bothered with how to cause a thumbnail procedure (just define it in our application as a certain resize) or rotating left/right (define that as rotations by 90 degrees) – those can be handled by the application logic and sent to Jimp. While I think my application essentially functions like an intermediary, bridging client commands with procedures on the actual converter (Jimp) – my application does not elaborate on how to connect to a service, get the right server method, or format requests. It just utilizes a library that is included in a Node package. So ultimately I do not think it is a service connector.
Specification and Commands
The client must POST to the API using the following JSON format:

```
{
    “image”: “<some string representing the image>”,
    “commands”: {
      “<command name1>”: [“<string parameter1>”, “<string parameter2>”],
      “<command name2>”: [<empty array if no parameters>],
        …
    }
}
```

These are the commands a user can give (everything is in a POST). I have formatted the below by listing the verbal description, then the literal command name, followed by parameters. My application will do necessary logic and then call on the needed Jimp methods to mutate the image.
Flip horizontal | flipHorizontal | [No parameters]
Flip vertical | flipVertical | [No parameters]
Rotate +/- n degrees | rotate | [<integer as string>] (ex: [“98”] for 98 degrees clockwise)
Convert to grayscale | grayscale | [No parameters]
Resize | resize | [<integer as string>, <integer as string>] (ex: [“150”, “350”])
Generate a thumbnail | thumbNail | [No parameters; thumbnail will do a predetermined resize]
Rotate left | rotateLeft | [No parameters]
Rotate right | rotateRight | [No parameters]
 
```
//------------COMMANDS------------
// (Invoke-WebRequest -UseBasicParsing http://localhost:3001/api/getImageAndCommands/ -ContentType "application/json" -Method POST -Body '{"image":"https://i.pinimg.com/474x/14/a3/56/14a35692b23635433909bf94e626d8f3.jpg","commands":{"flipHorizontal":[]}}').Content
// (Invoke-WebRequest -UseBasicParsing http://localhost:3001/api/getImageAndCommands/ -ContentType "application/json" -Method POST -Body '{"image":"https://i.pinimg.com/474x/14/a3/56/14a35692b23635433909bf94e626d8f3.jpg","commands":{"flipVertical":[]}}').Content
// (Invoke-WebRequest -UseBasicParsing http://localhost:3001/api/getImageAndCommands/ -ContentType "application/json" -Method POST -Body '{"image":"https://i.pinimg.com/474x/14/a3/56/14a35692b23635433909bf94e626d8f3.jpg","commands":{"rotate":["125"]}}').Content
// (Invoke-WebRequest -UseBasicParsing http://localhost:3001/api/getImageAndCommands/ -ContentType "application/json" -Method POST -Body '{"image":"https://i.pinimg.com/474x/14/a3/56/14a35692b23635433909bf94e626d8f3.jpg","commands":{"grayscale":[]}}').Content
// (Invoke-WebRequest -UseBasicParsing http://localhost:3001/api/getImageAndCommands/ -ContentType "application/json" -Method POST -Body '{"image":"https://i.pinimg.com/474x/14/a3/56/14a35692b23635433909bf94e626d8f3.jpg","commands":{"resize":["30","30"]}}').Content
// (Invoke-WebRequest -UseBasicParsing http://localhost:3001/api/getImageAndCommands/ -ContentType "application/json" -Method POST -Body '{"image":"https://i.pinimg.com/474x/14/a3/56/14a35692b23635433909bf94e626d8f3.jpg","commands":{"thumbNail":[]}}').Content
// (Invoke-WebRequest -UseBasicParsing http://localhost:3001/api/getImageAndCommands/ -ContentType "application/json" -Method POST -Body '{"image":"https://i.pinimg.com/474x/14/a3/56/14a35692b23635433909bf94e626d8f3.jpg","commands":{"rotateLeft":[]}}').Content
// (Invoke-WebRequest -UseBasicParsing http://localhost:3001/api/getImageAndCommands/ -ContentType "application/json" -Method POST -Body '{"image":"https://i.pinimg.com/474x/14/a3/56/14a35692b23635433909bf94e626d8f3.jpg","commands":{"rotateRight":[]}}').Content
```

