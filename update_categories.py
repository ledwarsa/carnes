import json

with open("data/products.json") as f:
    products = json.load(f)

res = ["Carne molida de res", "Carne de res para sudar", "Carne de res para asar", "Carne de res para desmechar", "Sobrebarriga", "Carne de res para goulash", "Costilla de res", "Lomo Fino", "Lomo ancho", "Punta de anca", "Churrasco Porcionado", "Hígado de res", "Callo de res"]
cerdo = ["Pernil de Cerdo", "Carne molida de cerdo", "Costilla de cerdo", "Lomo de cerdo", "Chuleta de cerdo"]
pollo = ["Pechuga entera", "Filete de Pechuga", "Muslos de pollo", "Alas de pollo", "Pierna-Pernil"]

for p in products:
    name_lower = p['name'].lower()
    if any(n.lower() in name_lower for n in res):
        p['category'] = 'res'
    elif any(n.lower() in name_lower for n in cerdo):
        p['category'] = 'cerdo'
    elif any(n.lower() in name_lower for n in pollo):
        p['category'] = 'pollo'
    else:
        p['category'] = 'res' # fallback

with open("data/products.json", "w") as f:
    json.dump(products, f, indent=4)
print("Categories added.")
