let itemList = {
    "mon001": {
        "name": "Tôm Nướng Muối Ớt",
        "price": 100000,
        "photo": "Picture/sanpham/tomnuong.jpg"},
    
    "mon002": {
        "name": "Mực Nướng Sa Tế",
        "price": 120000,
        "photo": "Picture/sanpham/mucnuong2.jpg"},     

    "mon003": {
        "name": "Cá Lóc Nướng",
        "price": 120000,
        "photo": "Picture/sanpham/calocnuong.jpg"},

    "mon004": {
        "name": "Hàu Nướng Mỡ Hành",
        "price": 60000,
        "photo": "Picture/sanpham/haunuong.jpg"},

    "mon005": {
        "name": "Ghẹ Hấp",
        "price": 200000,
        "photo": "Picture/sanpham/ghehap.jpg"},

    "mon006": {
        "name": "Tôm Hấp",
        "price": 80000,
        "photo": "Picture/sanpham/tomhap.jpg"},

    "mon007": {
        "name": "Mực Hấp",
        "price": 120000,
        "photo": "Picture/sanpham/muchap.jpg"},

    "mon008": {
        "name": "Sò Hấp",
        "price": 99000,
        "photo": "Picture/sanpham/sohap.jpg"},

    "mon009": {
        "name": "Lẩu Hải Sản",
        "price": 280000,
        "photo": "Picture/sanpham/lauhaisan.jpg"},
    
    "mon0010": {
        "name": "Lẩu Cua",
        "price": 220000,
        "photo": "Picture/sanpham/laucuabien.jpg"},
    
    "mon0011": {
        "name": "Canh Chua Cá",
        "price": 100000,
        "photo": "Picture/sanpham/canhchuaca.jpg"},

    "mon012": {
        "name": "Lẩu Thập Cẩm",
        "price": 260.000,
        "photo": "Picture/sanpham/lauthapcam.jpg"}
};

function move_donhang(){
    window.location.href="donhang.html";    
}

function int_to_tring (a){
    let b = String(a);
    let j = 0;
    for(let i=b.length; i >= 0; i--){
        if(j === 3 && i!==0){
            b = b.substr(0, i) + '.' + b.substr(i);
            j = 0;
        }
        j++;
    }
    return b;
}


function addCart (e) {    
    if(typeof localStorage[e] === "undefined"){
        number = parseInt(document.getElementById(e).value);
        window.localStorage.setItem(e, number);
        if (number <= 0){
            window.localStorage.setItem(e, 1);
            Swal.fire({
                title: 'Oh!',
                text: 'Số lượng sản phẩm quá ít, bạn sẽ lấy 1 sản phẩm?',
                icon: 'question', // Có thể là 'success', 'error', 'warning', 'info', hoặc 'question'
                confirmButtonText: 'OK'
            });
        }
    }
    else {
        number = parseInt(document.getElementById(e).value);
        current = parseInt(window.localStorage.getItem(e));
        total = number + current;
        if (total > 100){
            window.localStorage.setItem(e, 100);
            Swal.fire({
                title: 'Oh!',
                text: 'Số lượng sản phẩm vượt quá mức cho phép, bạn sẽ lấy 100 sản phẩm?',
                icon: 'question', // Có thể là 'success', 'error', 'warning', 'info', hoặc 'question'
                confirmButtonText: 'OK'
            });
        }

        
        else{
            window.localStorage.setItem(e, total);
        }
    }
    for (let key in localStorage){
        console.log(key);
    }
    console.log(localStorage);
}

function show_cart() {
    let total = 0;
    let tbody = document.getElementById("tbdy");
    tbody.innerHTML = "";
    for (let key in localStorage){
        console.log(key);
        let item = itemList[key];
        let photo = item.photo;
        let name = item.name;
        let price = item.price;
        let orderNumber = localStorage.getItem(key);

        // let tbody = document.getElementById("tbdy");

        let tr = document.createElement("tr", id=`tr_${key}`);

        let td_check = document.createElement("td");
        td_check.innerHTML=`<input type="checkbox" id="box_${key}" class="checkbox" onclick="update_total1('${key}')">`;
        tr.appendChild(td_check);

        let td_img = document.createElement("td");
        td_img.innerHTML=`<img src=${photo} width = '100px'>`
        tr.appendChild(td_img);

        let td_name = document.createElement("td");
        td_name.innerHTML = name;
        tr.appendChild(td_name);

        let td_price = document.createElement("td");
        td_price.innerHTML = `${int_to_tring(price)}/phần`;
        tr.appendChild(td_price);

        let td_orderNumber = document.createElement("td");
        td_orderNumber.innerHTML =`<input type="number" id="${key}_new" class="input_number" onchange="change_number('${key}')" name="soluong" max="100" min="0" size="3" value="${orderNumber}">` ;
        tr.appendChild(td_orderNumber);

        let td_count = document.createElement("td");
        td_count.innerHTML = int_to_tring (count_price(key));
        tr.appendChild(td_count);

        let td_delete = document.createElement("td");
        td_delete.innerHTML = `<a class="icon_trash" onclick="removeCart('${key}')"><i class="fa-solid fa-trash-can"></i></a>`;
        tr.appendChild(td_delete);

        tbody.append(tr);
    }

}


function change_number (key){
    let div_count = document.getElementById("count");
    div_count.innerHTML = `<p>Vui lòng chọn sản phẩm trong giỏ hàng!</p>`;
    let check = document.getElementById("check_all");
    check.checked = false;   

    number = parseInt(document.getElementById(`${key}_new`).value);
    if (number > 100){
        window.localStorage.setItem(key, 100);
    }
    else{
        window.localStorage.setItem(key, number);
    }
    let tbody = document.getElementById("tbdy");
    tbody.innerHTML ="";
    update_total2()
    show_cart();
}


let total = 0;
function update_total1(key){
    let checkBox = document.getElementById(`box_${key}`);
    if(checkBox.checked === true){
        total += count_price(key);
    }
    else if(total > 0){
        total -= count_price(key);
    }
    let discount = total*get_discount_rate();
    let tax = (total - discount)*0.1;
    let fee = total - discount + tax;
    let div_count = document.getElementById("count");
    if(fee !==0 ){
        div_count.innerHTML = `<p class="count_fee">Tổng giá trị đơn hàng: <span>${int_to_tring(total)}đ</span> </p>
                        <p class="count_fee">Giá trị khuyến mãi: <span>${int_to_tring(discount)}đ</span> </p>
                        <p class="count_fee">Thuế giá trị gia tăng: <span>${int_to_tring(tax)}đ</span> </p>
                        <p class="Buy">Thành tiền: <span class="fee">${int_to_tring(fee)}đ</span> </p>
                        <button class="buy">Mua</button>`;   
    }
    else if(localStorage.length !== 0) {
        div_count.innerHTML = `<p>Vui lòng chọn sản phẩm trong giỏ hàng!</p>`;
    }
}

function check_all(){    
    let check = document.getElementById("check_all");    
    if (check.checked === true){  
        update_total2();      
        let checkbox = document.getElementsByClassName("checkbox");
        for(let i in checkbox){
            checkbox[i].checked = true;
        }
        for (let key in localStorage){
            update_total1(key);
        }
    }
    else {
        let checkbox = document.getElementsByClassName("checkbox");
        for(let i in checkbox){
            checkbox[i].checked = false;
        }
        
    }
    update_total2();
    let div_count = document.getElementById("count");
    div_count.innerHTML = `<p>Vui lòng chọn sản phẩm trong giỏ hàng!</p>`;

}


function update_total2(){
    total = 0;
    // let div_count = document.getElementById("count");
    // div_count.innerHTML = `<p>Vui lòng chọn sản phẩm trong giỏ hàng!</p>`;
}

function count_price(key){
    item = itemList[key];
    price = item.price;
    orderNumber = localStorage.getItem(key);
    return orderNumber*price;
}

function get_discount_rate(){
    let d = new Date();
    let weekday = d.getDay();
    let totalMins = d.getHours()*60+d.getMinutes();
    if(weekday >= 1  && weekday<=3 &&((totalMins >= 420 && totalMins <= 660) || (totalMins >= 780 && totalMins <= 1020))){
        return 0.1;
    }
    return 0;
}

function display_cart() {
    if (localStorage.length === 0){        
        let a = document.getElementById("cart");
        a.style.display = "none";
        let div_count = document.getElementById("count");
        div_count.innerHTML = `<p>Hiện tại chưa có sản phẩm nào trong giỏ hàng!</p>`;        
    }
    else{
        let a = document.getElementById("cart");
        a.style.display = "block";
        show_cart();
    }
}

display_cart();
window.onstorage = () => {display_cart();};

function removeCart (code){
    update_total2();
    let div_count = document.getElementById("count");
    div_count.innerHTML = `<p>Vui lòng chọn sản phẩm trong giỏ hàng!</p>`;
    let check = document.getElementById("check_all");
    check.checked = false;
    if(typeof window.localStorage[code] !== "undefined"){
        window.localStorage.removeItem(code);      
        document.getElementById("CartDetail").getElementsByTagName('tbody')[0].innerHTML = "";
        display_cart();        
    }    
}
