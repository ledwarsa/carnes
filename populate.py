import json

products = [
    {
        "id": "1",
        "name": "Carne de res para sudar",
        "price": "$42.857",
        "description": "Corte ideal para guisos y preparaciones de cocción lenta, logrando una carne suave y jugosa.\n100% colombiana · Grass Fed · Sin hormonas · Empacada al vacío",
        "reference": "",
        "is_sold_out": False,
        "button_url": "",
        "image": "uploads/productos/page0_img0.png"
    },
    {
        "id": "2",
        "name": "Carne molida de cerdo",
        "price": "$21.429",
        "description": "Carne seleccionada y molida, perfecta para hamburguesas, albóndigas, rellenos y mucho más.\n100% colombiana · Sin inyecciones de agua · Empacada al vacío",
        "reference": "",
        "is_sold_out": False,
        "button_url": "",
        "image": "uploads/productos/page1_img0.png"
    },
    {
        "id": "3",
        "name": "Muslos de pollo",
        "price": "$20.000",
        "description": "Corte jugoso y lleno de sabor, ideal para horno, parrilla, guisos o preparaciones en salsa.\n100% colombiano · Empacado al vacío",
        "reference": "",
        "is_sold_out": False,
        "button_url": "",
        "image": "uploads/productos/page2_img0.png"
    },
    {
        "id": "4",
        "name": "Alas de pollo",
        "price": "$13.429",
        "description": "Ideales para horno, parrilla, BBQ o preparaciones crocantes.\n100% colombianas · Empacadas al vacío",
        "reference": "",
        "is_sold_out": False,
        "button_url": "",
        "image": "uploads/productos/page3_img0.png"
    },
    {
        "id": "5",
        "name": "Hígado de res",
        "price": "$27.857",
        "description": "Producto fresco y limpio, ideal para preparar a la plancha, con cebolla o en guisos.\n100% colombiano · Limpio · Empacado al vacío",
        "reference": "",
        "is_sold_out": False,
        "button_url": "",
        "image": "uploads/productos/page4_img0.png"
    },
    {
        "id": "6",
        "name": "Callo de res",
        "price": "$27.857",
        "description": "Corte tradicional ideal para sopas, guisos y preparaciones de cocción prolongada.\n100% colombiano · Limpio · Empacado al vacío",
        "reference": "",
        "is_sold_out": False,
        "button_url": "",
        "image": "uploads/productos/page5_img0.png"
    },
    {
        "id": "7",
        "name": "Carne de res para asar",
        "price": "$48.571",
        "description": "Corte seleccionado para parrilla, plancha o sartén. Ideal para disfrutar una carne tierna y jugosa.\n100% colombiana · Grass Fed · Sin hormonas · Empacada al vacío",
        "reference": "",
        "is_sold_out": False,
        "button_url": "",
        "image": "uploads/productos/page6_img0.png"
    },
    {
        "id": "8",
        "name": "Costilla de res",
        "price": "$32.857",
        "description": "Corte lleno de sabor, ideal para horno, parrilla y preparaciones de cocción lenta.\n100% colombiana · Grass Fed · Sin hormonas · Empacada al vacío",
        "reference": "",
        "is_sold_out": False,
        "button_url": "",
        "image": "uploads/productos/page7_img0.png"
    },
    {
        "id": "9",
        "name": "Costilla de cerdo",
        "price": "$28.571",
        "description": "Corte lleno de sabor, ideal para parrilla, horno, BBQ y cocción lenta.\n100% colombiana · Sin inyecciones de agua · Empacada al vacío",
        "reference": "",
        "is_sold_out": False,
        "button_url": "",
        "image": "uploads/productos/page8_img0.png"
    },
    {
        "id": "10",
        "name": "Lomo de cerdo",
        "price": "$31.429",
        "description": "Corte magro y versátil, perfecto para plancha, horno, parrilla o preparaciones en salsa.\n100% colombiano · Sin inyecciones de agua · Empacado al vacío",
        "reference": "",
        "is_sold_out": False,
        "button_url": "",
        "image": "uploads/productos/page9_img0.png"
    },
    {
        "id": "11",
        "name": "Pechuga entera",
        "price": "$22.857",
        "description": "Pechuga fresca y limpia, ideal para horno, parrilla, plancha o preparaciones en salsa.\n100% colombiana · Empacada al vacío",
        "reference": "",
        "is_sold_out": False,
        "button_url": "",
        "image": "uploads/productos/page10_img0.png"
    },
    {
        "id": "12",
        "name": "Lomo ancho",
        "price": "$64.286",
        "description": "Corte premium, jugoso y lleno de sabor. Perfecto para parrilla, sartén o preparaciones especiales.\nCorte premium · 100% colombiano · Grass Fed · Empacado al vacío",
        "reference": "",
        "is_sold_out": False,
        "button_url": "",
        "image": "uploads/productos/page11_img0.png"
    },
    {
        "id": "13",
        "name": "Punta de anca",
        "price": "$64.286",
        "description": "Corte de excelente sabor y textura, ideal para parrilla, asados y preparaciones a la plancha.\nCorte premium · 100% colombiano · Grass Fed · Empacado al vacío",
        "reference": "",
        "is_sold_out": False,
        "button_url": "",
        "image": "uploads/productos/page12_img0.png"
    },
    {
        "id": "14",
        "name": "Chuleta de cerdo",
        "price": "$31.429",
        "description": "Porción práctica y sabrosa, ideal para preparar a la plancha, sartén o parrilla.\n100% colombiana · Sin inyecciones de agua · Empacada al vacío",
        "reference": "",
        "is_sold_out": False,
        "button_url": "",
        "image": "uploads/productos/page13_img0.png"
    },
    {
        "id": "15",
        "name": "Pierna-Pernil",
        "price": "$20.000",
        "description": "Corte jugoso y versátil, perfecto para horno, parrilla o preparaciones en salsa.\n100% colombiano · Empacado al vacío",
        "reference": "",
        "is_sold_out": False,
        "button_url": "",
        "image": "uploads/productos/page14_img0.png"
    },
    {
        "id": "16",
        "name": "Carne de res para desmechar",
        "price": "$40.000",
        "description": "El corte ideal para preparar carne desmechada, con el balance perfecto entre carne y grasa.\n100% colombiana · Grass Fed · Sin hormonas · Empacada al vacío",
        "reference": "",
        "is_sold_out": False,
        "button_url": "",
        "image": "uploads/productos/page16_img0.png"
    },
    {
        "id": "17",
        "name": "Filete de Pechuga",
        "price": "$31.429",
        "description": "Pechuga fileteada y lista para cocinar. Perfecta para preparaciones rápidas y prácticas.\n100% colombiano · Listo para cocinar · Empacado al vacío",
        "reference": "",
        "is_sold_out": False,
        "button_url": "",
        "image": "uploads/productos/page17_img0.png"
    },
    {
        "id": "18",
        "name": "Carne molida de res",
        "price": "$34.286",
        "description": "Carne de res seleccionada, molida y lista para preparar hamburguesas, albóndigas, pastas y mucho más.\n100% colombiana · Grass Fed · Sin hormonas · Empacada al vacío",
        "reference": "",
        "is_sold_out": False,
        "button_url": "",
        "image": "uploads/productos/page18_img0.png"
    },
    {
        "id": "19",
        "name": "Pernil de Cerdo",
        "price": "$28.571",
        "description": "Corte jugoso y versátil, ideal para horno, asados y preparaciones familiares.\n100% colombiano · Sin inyecciones de agua · Empacado al vacío",
        "reference": "",
        "is_sold_out": False,
        "button_url": "",
        "image": "uploads/productos/page0_img0.png" # Assuming it was on page 0 with sudar
    },
    {
        "id": "20",
        "name": "Sobrebarriga",
        "price": "$40.000",
        "description": "Corte tradicional colombiano, perfecto para horno, sudados y preparaciones en salsa.\n100% colombiana · Grass Fed · Sin hormonas · Empacada al vacío",
        "reference": "",
        "is_sold_out": False,
        "button_url": "",
        "image": ""
    },
    {
        "id": "21",
        "name": "Carne de res para goulash",
        "price": "$37.143",
        "description": "Corte porcionado en trozos, ideal para goulash, estofados y guisos de cocción lenta.\n100% colombiana · Grass Fed · Sin hormonas · Empacada al vacío",
        "reference": "",
        "is_sold_out": False,
        "button_url": "",
        "image": ""
    },
    {
        "id": "22",
        "name": "Lomo Fino",
        "price": "$85.714",
        "description": "Corte premium de gran terneza, ideal para medallones, filetes y preparaciones especiales.\nCorte premium · 100% colombiano · Grass Fed · Empacado al vacío",
        "reference": "",
        "is_sold_out": False,
        "button_url": "",
        "image": ""
    },
    {
        "id": "23",
        "name": "Churrasco Porcionado",
        "price": "$64.286",
        "description": "Corte seleccionado y porcionado, listo para llevar a la parrilla o sartén.",
        "reference": "",
        "is_sold_out": False,
        "button_url": "",
        "image": ""
    }
]

with open('data/products.json', 'w') as f:
    json.dump(products, f, indent=4)
print("Products populated successfully")
