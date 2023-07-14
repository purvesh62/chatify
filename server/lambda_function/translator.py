import json
import boto3

translate = boto3.client('translate')


def lambda_handler(event, context):
    print("Event: ", event)
    
    body = json.loads(event.get('body'))

    SOURCE_TEXT = body.get("message")

    OUTPUT_LANG_CODE = body.get('language')

    result = translate.translate_text(
        Text=SOURCE_TEXT,
        SourceLanguageCode='auto',
        TargetLanguageCode=OUTPUT_LANG_CODE,
        Settings={'Profanity': 'MASK'}
    )

    response = {
        "translated_text": result.get('TranslatedText'),
        "language": OUTPUT_LANG_CODE
    }
    
    print(response)
    
    return {
        'statusCode': 200,
        'body': json.dumps(response),
        'headers': {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Headers': 'Content-Type',
        },
    }
