class ApiResponse():
    def __init__(self,statuscode,message,success=True):
        self.statuscode = statuscode
        self.message = message
        self.success = success
    
    def __str__(self):
        return f"statuscode:{self.statuscode} message:{self.message} success:{self.success}"