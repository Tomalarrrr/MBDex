
document.cookie = "cookies=none";
document.cookie = "sameSite=strict";

$(document).ready(function(){

    // retrieve stored cart items from local storage
    var storedCart = JSON.parse(localStorage.getItem("cart"));
    
    // create array to hold cart items
    var cart = [];
    
    // add item to cart
    $(".add-to-cart").click(function(event){
        event.preventDefault();
        var name = $(this).data("name");
        var price = Number($(this).data("price"));
        var img = $(this).data("img");
    
        addItemToCart(name, price, img);
        displayCart();
        localStorage.setItem("cart", JSON.stringify(cart));
    });
    
    // clear cart
    $(".clear-cart").click(function(){
        clearCart();
        displayCart();
        localStorage.setItem("cart", JSON.stringify(cart));
    });
    
    function displayCart(){
        var cartArray = listCart();
        var output = "";
        for(var i in cartArray){
            output += "<li>"
                     +"<img src='"+cartArray[i].img+"' width='100'>"
                     +" "+cartArray[i].name
                     +" x "+cartArray[i].price
                     +" = "+cartArray[i].total
                     +" <button class='delete-item btn btn-danger' data-name='"
                     +cartArray[i].name+"'>X</button></li>";
        }
        $(".show-cart").html(output);
        $(".total-count").html(countCart());
        $(".total-cost").html(totalCart());
    }
    
    // delete item from cart
    $(".show-cart").on("click", ".delete-item", function(event){
        var name = $(this).data("name");
        removeItemFromCartAll(name);
        displayCart();
        localStorage.setItem("cart", JSON.stringify(cart));
    });
    
    // item count
    $(".show-cart").on("change", ".item-count", function(event){
        var name = $(this).data("name");
        var count = Number($(this).val());
        itemCount(name, count);
        displayCart();
        localStorage.setItem("cart", JSON.stringify(cart));
    });
    
    // add item to cart
    function addItemToCart(name, price, img){
        for(var i in cart){
            if(cart[i].name === name){
                return;
            }
        }
        var item = {name: name, price: price, img: img, count: 1};
        cart.push(item);
        saveCart();
    }
    
    // remove item from cart
    function removeItemFromCart(name){
        for(var i in cart){
            if(cart[i].name === name){
                cart[i].count --;
                if(cart[i].count === 0){
                    cart.splice(i, 1);
                    }
                    break;
                }
            }
            saveCart();
        }
    
        // remove all items with the same name from cart
        function removeItemFromCartAll(name){
            for(var i in cart){
                if(cart[i].name === name){
                    cart.splice(i, 1);
                    break;
                }
            }
            saveCart();
        }
    
        // clear cart
        function clearCart(){
            cart = [];
            saveCart();
        }
    
        // count items in cart
        function countCart(){
            var totalCount = 0;
            for(var i in cart){
                totalCount += cart[i].count;
            }
            return totalCount;
        }
        
    
        // total cost of items in cart
        var total = 0;
        for (var i = 0; i < cart.length; i++) {
            total += cart[i].price;
        }
        console.log(total);
    
        // list items in cart
        function listCart(){
            var cartCopy = [];
            for(var i in cart){
                var item = cart[i];
                var itemCopy = {};
                for(var p in item){
                    itemCopy[p] = item[p];
                }
                itemCopy.total = (item.price * item.count).toFixed(2);
                cartCopy.push(itemCopy);
            }
            return cartCopy;
        }
    
        // update item count in cart
        function itemCount(name, count){
            for(var i in cart){
                if(cart[i].name === name){
                    cart[i].count = count;
                    break;
                }
            }
        }
    
        // save cart to local storage
        function saveCart(){
            localStorage.setItem("cart", JSON.stringify(cart));
        }
    
        // display stored cart items on page load
        if (storedCart) {
            cart = storedCart;
            displayCart();
        }
    });
    
    
