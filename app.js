class Product {
    constructor(product) {
        this.title = product.fields.title;
        this.id = product.sys.id;
        this.price = product.fields.price;
        this.image = product.fields.image.fields.file.url;
    }
}
/*******************************************************************/
class ProductList {
    constructor() {
        this.products = [];
    }

    add(pData) {
        const product = new Product(pData);
        this.products.push(product);
    }

    remove(id) {
        this.products = this.products.filter(p => p.id !== id);
    }
}
/*******************************************************************/
class Cart {
    constructor(products) {
        this.products = products;
        this.items = new Array(products.length).fill(0);
        this.totalPrice = 0;
    }

    increase(index) {
        this.items[index] += 1;
        this.total();
    }

    decrease(index) {
        this.items[index] > 0 ? this.items[index] -= 1 : this.remove(index);
        this.total();
    }

    remove(index) {
        this.items[index] = 0;
        this.total();
    }

    clearCart() {
        this.items.fill(0);
        this.totalPrice = 0;
    }

    total() {
        this.totalPrice = this.items.reduce((total, amount, index) => {
            return total + (amount * (this.products[index].price));
        }, 0);
        this.totalPrice = Math.round(this.totalPrice * 1000) / 1000;
    }
}
/*******************************************************************/
class ElementBuilder {
    constructor(name) {
        this.element = document.createElement(name);

        this.remove = function () {
            this.element.remove();
            return this;
        };

        this.text = function (text) {
            this.element.textContent = text;
            return this;
        };

        this.type = function (type) {
            this.element.type = type;
            return this;
        };

        this.source = function (source) {
            this.element.src = source;
            return this;
        };

        this.appendTo = function (parent) {
            if (parent instanceof ElementBuilder) {
                parent
                    .build()
                    .appendChild(this.element);
            }
            else {
                parent.appendChild(this.element);
            }
            return this;
        };

        this.placeholder = function (text) {
            this.element.placeholder = text;
            return this;
        };

        this.hide = function () {
            this.element.style.display = 'none';
            return this;
        };

        this.show = function () {
            this.element.style.display = 'block';
            return this;
        };

        this.className = function (className) {
            this.element.className = className;
            return this;
        };

        this.addClassName = function (...className) {
            this.element.classList.add(...className);
            return this;
        };

        this.onclick = function (fn) {
            this.element.onclick = fn;
            return this;
        };

        this.html = function (htmlValue) {
            this.element.innerHTML = htmlValue;
            return this;
        };

        this.value = function (value) {
            this.element.value = value;
            return this;
        };

        this.build = function () {
            return this.element;
        };
    }
}

const builder = {
    create(name) {
        return new ElementBuilder(name);
    }
}
/*******************************************************************/
class ShopApp {
    constructor(container, productsData) {
        this.container = container;
        this.productsList = new ProductList();
        for (let i = 0; i < productsData.items.length; i++) {
            this.productsList.add(productsData.items[i]);
        }
        this.cart = new Cart(this.productsList.products);
    }

    shopPainter() {
        this.container.innerHTML = '';
        const navbar = builder
            .create('div')
            .className('navbar')
            .appendTo(this.container);

        const navbarCenter = builder
            .create('div')
            .className('navbar-center')
            .appendTo(navbar);

        const navIcon = builder
            .create('span')
            .className('nav-icon')
            .appendTo(navbarCenter);

        builder
            .create('i')
            .className('fas fa-bars')
            .appendTo(navIcon);

        builder
            .create('img')
            .source("./images/logo.svg")
            .appendTo(navbarCenter);

        const cartBtn = builder
            .create('div')
            .className('cart-btn')
            .appendTo(navbarCenter);

        const navIcon2 = builder
            .create('span')
            .className('nav-icon')
            .appendTo(cartBtn);

        builder
            .create('i')
            .className('fas fa-cart-plus')
            .appendTo(navIcon2);

        const cartItems = builder
            .create('div')
            .className('cart-items')
            .appendTo(cartBtn);

        const hero = builder
            .create('div')
            .className('hero')
            .appendTo(this.container);

        const banner = builder
            .create('div')
            .className('banner')
            .appendTo(hero);

        builder
            .create('h1')
            .text('furniture collection')
            .className('banner-title')
            .appendTo(banner);

        builder
            .create('button')
            .text('shop now')
            .className('banner-btn')
            .appendTo(banner);

        const section = builder
            .create('section')
            .className('products')
            .appendTo(this.container);

        const sectionTitle = builder
            .create('div')
            .className('section-title')
            .appendTo(section)

        builder
            .create('h2')
            .text('Our Products')
            .appendTo(sectionTitle);

        const productsSection = builder
            .create('div')
            .className('products-center')
            .appendTo(section);

        for (let i = 0; i < this.productsList.products.length; i++) {
            const imageContainer = builder
                .create('div')
                .className('img-container')
                .appendTo(productsSection);

            builder
                .create('img')
                .source(this.productsList.products[i].image)
                .className('product-img')
                .appendTo(imageContainer);

            const button = builder
                .create('button')
                .className('bag-btn')
                .appendTo(imageContainer)
                .onclick(() => {
                    this.cart.increase(i);
                    cartItems.html(this.cart.items.reduce((a, b) => a + b, 0));
                });

            builder
                .create('i')
                .className('fas fa-shopping-cart')
                .text(' add to cart')
                .appendTo(button);

            builder
                .create('i')
                .className('fas fa-shopping-cart')
                .appendTo(button);

            const productDiv = builder
                .create('div')
                .className('product')
                .appendTo(imageContainer);

            builder
                .create('h3')
                .text(this.productsList.products[i].title)
                .appendTo(productDiv);
        }

        this.cartPainter(cartItems);

    }

    cartPainter(cartItems) {
        const BTN = Array.from(document.getElementsByClassName('cart-btn')).concat(Array.from(document.getElementsByClassName('bag-btn')));
        for (let j = 0; j < BTN.length; j++) {
            BTN[j].addEventListener('click', () => {
                if (j === 0) {
                    showCart.addClassName('showCart');
                }
                document.addEventListener('click', (e) => {
                    if (!(e.target.parentElement.parentElement.classList.contains('cart-btn'))) {
                        if (!document.getElementsByClassName('cart-overley')[0].contains(e.target)) {
                            if (!e.target.parentElement.parentElement.classList.contains('cart-item')) {
                                if (!(e.target.classList.contains('bag-btn') || e.target.classList.contains('fa-shopping-cart'))) {
                                    showCart.className('cart');
                                }
                            }
                        }
                    }
                });

                cartContent.html('');
                totalPrice.text(this.cart.totalPrice);

                this.cart.items.forEach((item, index) => {
                    if (item !== 0) {
                        const cartItem = builder
                            .create('div')
                            .className('cart-item')
                            .appendTo(cartContent);

                        builder
                            .create('img')
                            .source(this.productsList.products[index].image)
                            .appendTo(cartItem);

                        const Div = builder
                            .create('div')
                            .appendTo(cartItem);

                        builder
                            .create('h4')
                            .text(this.productsList.products[index].title)
                            .appendTo(Div);

                        builder
                            .create('h5')
                            .text(this.productsList.products[index].price)
                            .appendTo(Div);

                        builder
                            .create('span')
                            .className('remove-item')
                            .text('remove')
                            .appendTo(Div)
                            .onclick(() => {
                                this.cart.remove(index);
                                cartItem.remove();
                                totalPrice.text(this.cart.totalPrice);
                                let cartIconNumber = this.cart.items.reduce((a, b) => a + b, 0);
                                cartIconNumber = cartIconNumber > 0 ? cartIconNumber : '';
                                cartItems.html(cartIconNumber);
                            });

                        const chevronDiv = builder
                            .create('div')
                            .appendTo(cartItem);

                        builder
                            .create('i')
                            .className('fas fa-chevron-up')
                            .appendTo(chevronDiv)
                            .onclick(() => {
                                this.cart.increase(index);
                                itemAmount.text(this.cart.items[index]);
                                totalPrice.text(this.cart.totalPrice);
                                cartItems.html(this.cart.items.reduce((a, b) => a + b, 0));
                            });

                        const itemAmount = builder
                            .create('p')
                            .text(item)
                            .appendTo(chevronDiv);

                        builder
                            .create('i')
                            .className('fas fa-chevron-down')
                            .appendTo(chevronDiv)
                            .onclick(() => {
                                this.cart.decrease(index);
                                itemAmount.text(this.cart.items[index]);
                                if (this.cart.items[index] === 0) {
                                    cartItem.remove();
                                }
                                totalPrice.text(this.cart.totalPrice);
                                let cartIconNumber = this.cart.items.reduce((a, b) => a + b, 0);
                                cartIconNumber = cartIconNumber > 0 ? cartIconNumber : '';
                                cartItems.html(cartIconNumber);
                            });
                    }
                });
            });
        }

        const cartSection = builder
            .create('div')
            .className('cart-overley transparentBcg')
            .appendTo(this.container);

        const showCart = builder
            .create('div')
            .className('cart')
            .appendTo(cartSection);

        const closeButton = builder
            .create('span')
            .className('close-cart')
            .appendTo(showCart)
            .onclick(() => {
                showCart.className('cart');
            });

        builder
            .create('i')
            .className('fas fa-window-close')
            .appendTo(closeButton);

        builder
            .create('h2')
            .text('your cart')
            .appendTo(showCart);

        const cartContent = builder
            .create('div')
            .className('cart-content')
            .appendTo(showCart);

        const cartFooter = builder
            .create('div')
            .className('cart-footer')
            .appendTo(showCart);

        const cartFooterH3 = builder
            .create('h3')
            .text('your total : $ ')
            .appendTo(cartFooter);

        const totalPrice = builder
            .create('span')
            .className('cart-total')
            .text(this.cart.totalPrice)
            .appendTo(cartFooterH3);

        builder
            .create('button')
            .className('clear-cart banner-btn')
            .text('clear cart')
            .appendTo(cartFooter)
            .onclick(() => {
                this.cart.clearCart();
                cartContent.text('');
                totalPrice.text(this.cart.totalPrice);
                let cartIconNumber = this.cart.items.reduce((a, b) => a + b, 0);
                cartIconNumber = cartIconNumber > 0 ? cartIconNumber : '';
                cartItems.html(cartIconNumber);
            });

    }
}
/*******************************************************************/
function run(productsData) {
    const shopContainer = document.getElementsByTagName('body');
    const app = new ShopApp(shopContainer[0], productsData);
    app.shopPainter();
}
/*******************************************************************/
function getProductDataFromFile(url, callback) {
    var productsData;
    fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error("HTTP error " + response.status);
            }
            return response.json();
        })
        .then(products => myProducts = products)
        .then(() => callback(myProducts));
}

getProductDataFromFile('./products.json', run);