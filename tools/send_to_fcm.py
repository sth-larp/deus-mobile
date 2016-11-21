import requests

url = 'https://fcm.googleapis.com/fcm/send'
headers = {'Content-Type': 'application/json',
           'Authorization': 'key=AIza...(copy code here)...'}

payload = """ 
{
  "to": "/topics/all",
  "notification": {
    "title": "Hello world",
    "body": "You are beautiful"
  }
}
""" 
resp = requests.post(url, headers=headers, data=payload)
print(resp)
print(resp.text)