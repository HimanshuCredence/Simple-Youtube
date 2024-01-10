const { userRegister, userAuthentication, userUpdate, logoutUser, userDelete, refreshAccessToken, getCurrentUser } = require("../controllers/user-controller");
const { upload } = require("../middlewares/multer-middleware");
const { registrationMiddleware, verifyJwt } = require("../middlewares/user-middleware");

// const multer = require('multer');
// const upload = multer({dest : "upload/"});

 
 
exports.route = (app) => {
    app.post("/youtube/project/v1/users/registration",upload.fields([{name : 'avatar', maxCount : 1}]),[registrationMiddleware],userRegister);
    app.post("/youtube/project/v1/users/authentication",userAuthentication);
    app.post("/youtube/project/v1/users/logout",[verifyJwt],logoutUser);
    app.put("/youtube/project/v1/users/:username",[verifyJwt],userUpdate);
    app.delete("/youtube/project/v1/users/:username",[verifyJwt],userDelete); 
    app.post("/youtube/project/v1/users",refreshAccessToken); 
    app.get("/youtube/project/v1/users",[verifyJwt],getCurrentUser);  

} 