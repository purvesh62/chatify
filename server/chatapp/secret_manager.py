import boto3


class SecretManager:

    def __init__(self):
        session = boto3.session.Session()
        self.client = session.client(
            service_name='secretsmanager'
        )

    def get_secret_value(self, parameter_name):
        try:
            get_secret_value_response = self.client.get_secret_value(
                SecretId=parameter_name
            )
        except Exception as e:
            raise e
        return get_secret_value_response['SecretString']
