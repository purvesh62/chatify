Create stack S3, Secret Manager, System Manager

`aws cloudformation create-stack --stack-name S3-Resources --template-body file://s3.yml --capabilities CAPABILITY_NAMED_IAM`

Upload file to S3 bucket

`aws s3 cp chatapp.zip s3://chatify-app-5409`

`aws s3 cp python.zip s3://chatify-app-5409`



API Gateway

`aws cloudformation create-stack --stack-name API-GATEWAY-Resources --template-body file://api_gateway.yaml --capabilities CAPABILITY_NAMED_IAM`

`docker build -t chatapp .`




