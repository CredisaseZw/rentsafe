import requests
def send_messages(request):
    url = "http://sms.vas.co.zw/client/api/sendmessage?"
    mobile_number = '0779586059'
    registration_message = "test"
    params = {
            "apikey": '968dfdbc80b5fa1c',
            "mobiles":mobile_number,
            "sms": registration_message,
        }
            
    try:
        response = request.get(url, params=params)
    except requests.exceptions.RequestException as e:
        ...