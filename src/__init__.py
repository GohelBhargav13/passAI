from flask import Flask
from flask_cors import CORS
from src.controllers.upload_pdf_controller import upload_pdf
from src.utills.api_error_handler import api_error_handlers

# create the function for the calling the app everytime
def create_app():
    app = Flask(__name__)

    # setup the CORS after app intialization (r is the regular expression that is used for the match)
    CORS(app,resources=
        {
            r"/api/*":{
                      "origins":"http://127.0.0.1:5500",
                      "methods":["GET","POST","DELETE","OPTIONS"]
                      } 
        },
        allow_headers=["Content-Type","Authorization"],
        methods=["GET","POST","OPTIONS","DELETE"],
    )

    # register a blueprint with the prefix url
    # app.register_blueprint(select_controller,url_prefix='/api')
    app.register_blueprint(upload_pdf,url_prefix="/api")

    # register a error handlers that is mendatory
    api_error_handlers(app)

    return app


