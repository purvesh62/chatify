import boto3
import logging 

class SystemManager:
    
    def __init__(self):
        self.ssm = boto3.client('ssm')
    
    
    def get_parameter(self, parameter_name):
        response = self.ssm.get_parameter(
                Name=parameter_name,
                WithDecryption=True|False
            )
        
        if response.get('Parameter').get('Value'):
            return response.get('Parameter').get('Value')
        else:
            logging.error("Error while fetching the parameter.")
            return ""