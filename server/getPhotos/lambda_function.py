import json

import boto3


def get_parameters(name):
    ssm = boto3.client('ssm', 'us-east-1')
    response = ssm.get_parameter(
        Name=name,
        WithDecryption=True|False
    )
    return response['Parameter']['Value']


def get_bucket_items():
    photos = []
    photo_types = ('.jpg', '.png')
    
    bucket_name = get_parameters('cloud_project_s3_bucket')
    bucket = boto3.resource('s3').Bucket(bucket_name)
    
    for obj in bucket.objects.all():
        if obj.key.lower().endswith(photo_types):
            photos.append(obj.key)
    return photos

def lambda_handler(event, context):
    method_type = event.get('requestContext').get('http').get('method')
    
    print("event: ", event)
    
    
    if method_type == 'GET':
        photos = get_bucket_items()
        return {
            'statusCode': 200,
            'body': json.dumps({
                'photos': photos
            })
        }
    
    return {
        'statusCode': 400,
        'body': json.dumps({
            'message': "Method not supported"
        })
    }
