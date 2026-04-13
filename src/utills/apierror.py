
class ApiError(Exception):
    def __init__(self,statuscode,message,success=False):
        super().__init__(message)
        self.statuscode = statuscode
        self.message = message
        self.success = success
    
    def to_dict(self):
        return {
            "success":self.success,
            "statuscode":self.statuscode,
            "message":self.message
        }