import json
import boto3

translate = boto3.client('translate')

def lambda_handler(event, context):
    print(event)

    SOURCE_TEXT = (event.get("message"))

    OUTPUT_LANG_CODE = event.get('language')

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
        'body': response
    }
