"use strict";

document.addEventListener('DOMContentLoaded', function () {
    let addProductBtn = document.getElementById('add-product-btn');
    let updateInventoryBtn = document.getElementById('update-inventory-btn');
    let addProductModal = document.getElementById('add-product-modal');
    let updateInventoryModal = document.getElementById('update-inventory-modal');
    let closeAddModal = document.getElementById('close-add-modal');
    let closeUpdateModal = document.getElementById('close-update-modal');
    let addProductForm = document.getElementById('add-product-form');
    let updateInventoryForm = document.getElementById('update-inventory-form');
    let recipientTableBody = document.getElementById('recipient-table-body');

    let products = JSON.parse(localStorage.getItem('products')) || [];
    let recipients = JSON.parse(localStorage.getItem('recipients')) || [];
    let chart = null;

    function saveData() {
        localStorage.setItem('products', JSON.stringify(products));
        localStorage.setItem('recipients', JSON.stringify(recipients));
    }

    function renderTopProducts() {
        let topProducts = products.sort((a, b) => b.quantity - a.quantity).slice(0, 3);
        topProducts.forEach((product, index) => {
            document.getElementById(`top-product-${index + 1}`).textContent = `${product.name}: ${product.quantity}`;
        });
    }

    function renderChart() {
        let ctx = document.getElementById('inventoryChart').getContext('2d');
        if (chart) {
            chart.destroy(); 
        }
        const backgroundColors = [
            'rgba(0, 51, 0, 0.7)',    
            'rgba(50, 50, 50, 0.7)',   
            'rgba(48, 25, 52, 0.7)',   
            'rgba(75, 0, 0, 0.7)',     
            'rgba(102, 102, 0, 0.7)',  
            'rgba(255, 69, 0, 0.7)',   
            'rgba(0, 0, 139, 0.7)',    
            'rgba(139, 0, 139, 0.7)',  
            'rgba(101, 67, 33, 0.7)'   
        ];
        
        const borderColors = [
            'rgba(0, 51, 0, 1)',       
            'rgba(50, 50, 50, 1)',      
            'rgba(48, 25, 52, 1)',      
            'rgba(75, 0, 0, 1)',        
            'rgba(102, 102, 0, 1)',     
            'rgba(255, 69, 0, 1)',      
            'rgba(0, 0, 139, 1)',       
            'rgba(139, 0, 139, 1)',     
            'rgba(101, 67, 33, 1)'      
        ];
        
        chart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: products.map(product => product.name),
                datasets: [{
                    label: 'Inventory Status',
                    data: products.map(product => product.quantity),
                    backgroundColor: products.map((_, index) => backgroundColors[index % backgroundColors.length]),
                    borderColor: products.map((_, index) => borderColors[index % borderColors.length]),
                    borderWidth: 1
                }]
            },
            options: {
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });
    }

    function renderRecipients() {
        recipientTableBody.innerHTML = '';
        recipients.forEach(recipient => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${recipient.product}</td>
                <td>${recipient.name}</td>
                <td>${recipient.quantity}</td>
            `;
            recipientTableBody.appendChild(row);
        });
    }

    addProductBtn.addEventListener('click', () => {
        addProductModal.style.display = 'block';
    });

    closeAddModal.addEventListener('click', () => {
        addProductModal.style.display = 'none';
    });

    addProductForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const productName = e.target['product-name'].value;
        const productQuantity = parseInt(e.target['product-quantity'].value);
        const existingProduct = products.find(product => product.name === productName);

        if (existingProduct) {
            existingProduct.quantity += productQuantity;
        } else {
            products.push({ name: productName, quantity: productQuantity });
        }

        saveData();
        renderTopProducts();
        renderChart();
        addProductModal.style.display = 'none';
        addProductForm.reset();
    });

    updateInventoryBtn.addEventListener('click', () => {
        updateInventoryModal.style.display = 'block';
    });

    closeUpdateModal.addEventListener('click', () => {
        updateInventoryModal.style.display = 'none';
    });

    updateInventoryForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const productName = e.target['update-product-name'].value;
        const productQuantity = parseInt(e.target['update-quantity'].value);
        const recipientName = e.target['update-recipient'].value;
        const product = products.find(product => product.name === productName);

        if (product && product.quantity >= productQuantity) {
            product.quantity -= productQuantity;
            recipients.push({ product: productName, name: recipientName, quantity: productQuantity });

            saveData();
            renderTopProducts();
            renderChart();
            renderRecipients();
            updateInventoryModal.style.display = 'none';
            updateInventoryForm.reset();
        } else {
            alert('Insufficient quantity or product not found.');
        }
    });

    window.onclick = function (event) {
        if (event.target === addProductModal) {
            addProductModal.style.display = 'none';
        }
        if (event.target === updateInventoryModal) {
            updateInventoryModal.style.display = 'none';
        }
    };

    renderTopProducts();
    renderChart();
    renderRecipients();
});

// -------------------------------------------------------- or -------------------------------------------------------------------------------------------------------

// document.addEventListener('DOMContentLoaded', function () {
//     const API_URL = 'http://localhost:3001'; 

//     fetch(`${API_URL}/products`)
//         .then(response => response.json())
//         .then(products => {
//             console.log('Fetched products:', products); 
//             renderTopProducts(products);
//             renderChart(products);
//         })
//         .catch(error => console.error('Error fetching products:', error));

//     function renderTopProducts(products) {
//         const topProducts = products.sort((a, b) => b.quantity - a.quantity).slice(0, 3);
//         topProducts.forEach((product, index) => {
//             document.getElementById(`top-product-${index + 1}`).textContent = `${product.name}: ${product.quantity}`;
//         });
//     }

//     function renderChart(products) {
//         const ctx = document.getElementById('inventoryChart').getContext('2d');
//         if (window.inventoryChart) {
//             window.inventoryChart.destroy();
//         }
    
//         window.inventoryChart = new Chart(ctx, {
//             type: 'bar',
//             data: {
//                 labels: products.map(product => product.name),
//                 datasets: [{
//                     label: 'Inventory Status',
//                     data: products.map(product => product.quantity),
//                     backgroundColor: [
//                         'rgba(75, 192, 192, 0.2)',
//                         'rgba(153, 102, 255, 0.2)',
//                         'rgba(255, 159, 64, 0.2)'
//                     ],
//                     borderColor: [
//                         'rgba(75, 192, 192, 1)',
//                         'rgba(153, 102, 255, 1)',
//                         'rgba(255, 159, 64, 1)'
//                     ],
//                     borderWidth: 1
//                 }]
//             },
//             options: {
//                 scales: {
//                     y: {
//                         beginAtZero: true
//                     }
//                 }
//             }
//         });
//     }
    

//     function renderRecipients(recipients) {
//         const recipientTableBody = document.getElementById('recipient-table-body');
//         recipientTableBody.innerHTML = '';
//         recipients.forEach(recipient => {
//             const row = document.createElement('tr');
//             row.innerHTML = `
//                 <td data-label="Product">${recipient.product}</td>
//                 <td data-label="Recipient">${recipient.name}</td>
//                 <td data-label="Quantity">${recipient.quantity}</td>
//             `;
//             recipientTableBody.appendChild(row);
//         });
//     }

 
//     const addProductBtn = document.getElementById('add-product-btn');
//     const addProductModal = document.getElementById('add-product-modal');
//     const closeAddModal = document.getElementById('close-add-modal');

//     addProductBtn.onclick = function () {
//         addProductModal.style.display = 'block';
//     }

//     closeAddModal.onclick = function () {
//         addProductModal.style.display = 'none';
//     }

    
//     window.onclick = function (event) {
//         if (event.target === addProductModal || event.target === updateInventoryModal) {
//             addProductModal.style.display = 'none';
//             updateInventoryModal.style.display = 'none';
//         }
//     }

//     const addProductForm = document.getElementById('add-product-form');
//     addProductForm.onsubmit = function (event) {
//         event.preventDefault();
//         const formData = new FormData(addProductForm);
//         const product = {
//             name: formData.get('product-name'),
//             quantity: parseInt(formData.get('product-quantity'), 10)
//         };

//         fetch(`${API_URL}/products`, {
//             method: 'POST',
//             headers: {
//                 'Content-Type': 'application/json'
//             },
//             body: JSON.stringify(product)
//         })
//         .then(response => response.json())
//         .then(data => {
//             console.log('Product added:', data);
//             addProductModal.style.display = 'none';
//             location.reload(); 
//         })
//         .catch(error => console.error('Error adding product:', error));
//     }

//     const updateInventoryBtn = document.getElementById('update-inventory-btn');
//     const updateInventoryModal = document.getElementById('update-inventory-modal');
//     const closeUpdateModal = document.getElementById('close-update-modal');

//     updateInventoryBtn.onclick = function () {
//         updateInventoryModal.style.display = 'block';
//     }

//     closeUpdateModal.onclick = function () {
//         updateInventoryModal.style.display = 'none';
//     }

//     const updateInventoryForm = document.getElementById('update-inventory-form');
//     updateInventoryForm.onsubmit = function (event) {
//         event.preventDefault();
//         const formData = new FormData(updateInventoryForm);
//         const updatedData = {
//             name: formData.get('update-product-name'),
//             quantity: parseInt(formData.get('update-quantity'), 10),
//             recipient: formData.get('update-recipient')
//         };

//         fetch(`${API_URL}/recipients`, {
//             method: 'POST',
//             headers: {
//                 'Content-Type': 'application/json'
//             },
//             body: JSON.stringify(updatedData)
//         })
//         .then(response => response.json())
//         .then(data => {
//             console.log('Recipient updated:', data);
//             updateInventoryModal.style.display = 'none';
//             location.reload(); 
//         })
//         .catch(error => console.error('Error updating inventory:', error));
//     }
// });

