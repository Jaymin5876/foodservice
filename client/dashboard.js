// dashboard.js

// Display logged-in user's name
document.addEventListener('DOMContentLoaded', () => {
    const loggedInUser = localStorage.getItem('userName') || 'Guest';
    document.getElementById('loggedInUser').textContent = loggedInUser;
});

// Sample menu items
const menuItems = [
    {
        name: 'Cheeseburger',
        description: 'Juicy beef patty with cheddar cheese, lettuce, tomato, and pickles.',
        price: 'Rs.45',
        image: 'cheeseburger.jpg'
    },
    {
        name: 'Margherita Pizza',
        description: 'Classic pizza with fresh tomatoes, mozzarella cheese, and basil.',
        price: 'Rs.80',
        image: 'pizzamargherita.jpg'
    },
    {
        name: 'Gujarati Thali',
        description: 'Traditional meal with laddu, roti, sabji, dal-bhat, chhas, papad, salad, and onion.',
        price: 'Rs.100',
        image: 'gujaratithali.jpg'
    }
];

// Show menu items
const menuContainer = document.getElementById('menuContainer');
menuItems.forEach(item => {
    const card = document.createElement('div');
    card.className = 'col-md-4 mb-4';
    card.innerHTML = `
        <div class="card h-100">
            <img src="${item.image}" class="card-img-top" alt="${item.name}">
            <div class="card-body d-flex flex-column">
                <h5 class="card-title">${item.name}</h5>
                <p class="card-text">${item.description}</p>
                <p class="card-text"><strong>${item.price}</strong></p>
                <button class="btn btn-primary mt-auto" onclick="showItemDetails('${item.name}')">View Details</button>
            </div>
        </div>
    `;
    menuContainer.appendChild(card);
});

let selectedItem = null;

function showItemDetails(name) {
    selectedItem = menuItems.find(item => item.name === name);
    if (selectedItem) {
        document.getElementById('itemName').textContent = selectedItem.name;
        document.getElementById('itemDescription').textContent = selectedItem.description;
        document.getElementById('itemPrice').textContent = selectedItem.price;
        document.getElementById('itemImage').src = selectedItem.image;
        $('#itemModal').modal('show');
    }
}

document.getElementById('orderNowBtn').addEventListener('click', function() {
    $('#itemModal').modal('hide');
    $('#orderModal').modal('show');
});

document.getElementById('paymentMethod').addEventListener('change', function() {
    const method = this.value;
    const upiSection = document.getElementById('upiSection');
    const qrSection = document.getElementById('qrSection');
    const qrImage = document.getElementById('qrImage');

    upiSection.classList.add('d-none');
    qrSection.classList.add('d-none');

    if (method === 'UPI') {
        upiSection.classList.remove('d-none');
    } else if (method === 'Card') {
        if (selectedItem) {
            const amount = selectedItem.price.replace('Rs.', '').trim();
            qrImage.src = `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=Pay%20Rs.${amount}%20to%20merchant`;
            qrSection.classList.remove('d-none');
        }
    }
});

document.getElementById('orderForm').addEventListener('submit', function(e) {
    e.preventDefault();

    const name = document.getElementById('customerName').value.trim();
    const phone = document.getElementById('customerPhone').value.trim();
    const address = document.getElementById('customerAddress').value.trim();
    const payment = document.getElementById('paymentMethod').value;
    const upiId = document.getElementById('upiId').value.trim();

    if (!name || !phone || !address || !payment) {
        alert('Please fill all fields!');
        return;
    }

    if (payment === 'UPI' && !upiId) {
        alert('Please enter your UPI ID!');
        return;
    }

    console.log('Order Placed:', { item: selectedItem, name, phone, address, payment, upiId });

    document.getElementById('orderSuccess').classList.remove('d-none');

    setTimeout(() => {
        $('#orderModal').modal('hide');
        document.getElementById('orderForm').reset();
        document.getElementById('orderSuccess').classList.add('d-none');
    }, 2000);
});
