
# valid status code range is from 100 to 599
MAX_RANGE_STATUSCODE = range(100,600) 

class ApiError(Exception):
    def __init__(self,statuscode: int,message : str):

        if statuscode not in MAX_RANGE_STATUSCODE:
            raise ValueError("Invalid status code")
        super().__init__(message)
        self.statuscode = statuscode
        self.message = message
        self.success = statuscode < 400
    