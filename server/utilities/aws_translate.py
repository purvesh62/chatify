import boto3
import json

translate = boto3.client('translate')

while True:
    ip = input("Enter text: ")
    SOURCE_TEXT = (ip)

    OUTPUT_LANG_CODE = 'en'

    result = translate.translate_text(
        Text=SOURCE_TEXT,
        SourceLanguageCode='auto',
        TargetLanguageCode='en',
        Settings={'Profanity': 'MASK'}
    )

    print("Translated Text: {}".format(result.get('TranslatedText')))