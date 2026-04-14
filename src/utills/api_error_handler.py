from src.utills.apierror import ApiError
from flask import jsonify

# define the handler for the API error
def api_error_handlers(app):

    # register the error handler with @app.errorhandler
    @app.errorhandler(ApiError) # register the ApiError in the errorhandler
    def handle_api_error(error:ApiError): # 'error' is the object of the ApiError
         return jsonify({
            "success": False,
            "statuscode":  error.statuscode,
            "message": error.message
        }), error.statuscode