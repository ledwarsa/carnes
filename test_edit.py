import urllib.request
import urllib.parse
import json

url = 'http://localhost/carnes/api/products.php'
data = urllib.parse.urlencode({
    'id': '1',
    'name': 'Carne de res para sudar Test',
    'category': 'res',
    'price': '$42.857'
}).encode('utf-8')

req = urllib.request.Request(url, data=data, method='POST')
try:
    with urllib.request.urlopen(req) as response:
        print("Success:", response.read().decode('utf-8'))
except urllib.error.HTTPError as e:
    print("Error:", e.code, e.read().decode('utf-8'))
