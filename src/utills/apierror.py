
class ApiError(Exception):
    def __init__(self,statuscode,message,success=False):
        super().__init__(message)
        self.statuscode = statuscode
        self.message = message
        self.success = success
    