const homeSection = document.getElementById("homeSection");
const productSection = document.getElementById("productSection");
const bannerSection = document.getElementById("bannerSection");
const homeBtn = document.getElementById("homeBtn");
const productBtn = document.getElementById("productBtn");
const mobileHomeBtn = document.getElementById("mobileHomeBtn");
const mobileProductBtn = document.getElementById("mobileProductBtn");
const categoryContainer = document.getElementById("categoryContainer");
const productGrid = document.getElementById("productGrid");
const categoryTitle = document.getElementById("categoryTitle");

let currentProducts = [];
function setActiveNav(page) {
    homeBtn.classList.remove("text-indigo-600", "font-bold");
    productBtn.classList.remove("text-indigo-600", "font-bold");
    
    if(mobileHomeBtn) mobileHomeBtn.classList.remove("text-indigo-600", "font-bold");
    if(mobileProductBtn) mobileProductBtn.classList.remove("text-indigo-600", "font-bold");

    if(page === 'home') {
        homeBtn.classList.add("text-indigo-600", "font-bold");
        if(mobileHomeBtn) mobileHomeBtn.classList.add("text-indigo-600", "font-bold");
    } else {
        productBtn.classList.add("text-indigo-600", "font-bold");
        if(mobileProductBtn) mobileProductBtn.classList.add("text-indigo-600", "font-bold");
    }
}

function showHome() {
    homeSection.classList.remove("hidden");
    productSection.classList.add("hidden");
    bannerSection.classList.remove("hidden");
    setActiveNav('home');
}

function showProducts() {
    homeSection.classList.add("hidden");
    productSection.classList.remove("hidden");
    bannerSection.classList.add("hidden");
 
    setActiveNav('products');

    loadCategories();
    loadAllProducts();
}

homeBtn.addEventListener("click", showHome);
productBtn.addEventListener("click", showProducts);
if(mobileHomeBtn) mobileHomeBtn.addEventListener("click", showHome);
if(mobileProductBtn) mobileProductBtn.addEventListener("click", showProducts);

function loadCategories() {
    fetch("https://fakestoreapi.com/products/categories")
        .then(res => res.json())
        .then(categories => {
            let buttonsHTML = `
                <button class="category-btn px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-300 bg-indigo-600 text-white shadow-sm" data-category="all">
                    All
                </button>
            `;
            
            for(let i = 0; i < categories.length; i++) {
                const category = categories[i];
               
                let formattedCategory = '';
                const words = category.split(' ');
                for(let j = 0; j < words.length; j++) {
                    formattedCategory = formattedCategory + words[j].charAt(0).toUpperCase() + words[j].slice(1) + ' ';
                }
                formattedCategory = formattedCategory.trim();
                
                buttonsHTML = buttonsHTML + `
                    <button class="category-btn px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-300 bg-gray-100 text-gray-700 hover:bg-gray-200" data-category="${category}">
                        ${formattedCategory}
                    </button>
                `;
            }
            
            categoryContainer.innerHTML = buttonsHTML;
            
            const categoryButtons = document.querySelectorAll('.category-btn');
            for(let i = 0; i < categoryButtons.length; i++) {
                categoryButtons[i].addEventListener('click', function() {
              
                    for(let j = 0; j < categoryButtons.length; j++) {
                        categoryButtons[j].classList.remove('bg-indigo-600', 'text-white', 'shadow-sm');
                        categoryButtons[j].classList.add('bg-gray-100', 'text-gray-700');
                    }
                  
                    this.classList.remove('bg-gray-100', 'text-gray-700');
                    this.classList.add('bg-indigo-600', 'text-white', 'shadow-sm');
            
                    const cat = this.dataset.category;
                    if(cat === 'all') {
                        categoryTitle.textContent = 'All Products';
                        loadAllProducts();
                    } else {
                        let titleCat = '';
                        const words = cat.split(' ');
                        for(let j = 0; j < words.length; j++) {
                            titleCat = titleCat + words[j].charAt(0).toUpperCase() + words[j].slice(1) + ' ';
                        }
                        categoryTitle.textContent = titleCat.trim();
                        loadProductsByCategory(cat);
                    }
                });
                 }  });
}


function loadAllProducts() {
    fetch("https://fakestoreapi.com/products")
        .then(res => res.json())
        .then(products => {
            currentProducts = products;
            displayProducts(products);
        });
}

function loadProductsByCategory(category) {
    fetch(`https://fakestoreapi.com/products/category/${category}`)
        .then(res => res.json())
        .then(products => {
            currentProducts = products;
            displayProducts(products);
        });
}

function showDetails(productId) {
    const product = currentProducts.find(p => p.id === productId);
    if(!product) return;
    const modalContent = document.getElementById('modalContent');
    modalContent.innerHTML = `
        <div class="flex flex-col gap-4">
            <!-- Product Image -->
            <div class="bg-gray-50 p-4 rounded-lg flex justify-center items-center">
                <img src="${product.image}" alt="${product.title}" class="h-40 object-contain">
            </div>
            
          
            <div class="space-y-3">
             
                <h3 class="text-xl font-bold text-gray-800">${product.title}</h3>
                <div class="flex items-center gap-2">
                    <span><i class="text-amber-400 fa-solid fa-star"></i></span>
                    <span class="text-gray-600">${product.rating.rate}</span>
                    <span class="text-gray-400 text-sm">(${product.rating.count} reviews)</span>
                </div>
            
                <div class="text-2xl font-bold text-indigo-600">$${product.price}</div>
                <p class="text-gray-600 text-sm leading-relaxed">${product.description}</p>
                <button class="w-full mt-4 bg-gradient-to-r from-indigo-500 to-indigo-600 text-white font-medium py-3 rounded-lg hover:opacity-90 transition">
                    <i class="fa-solid fa-cart-shopping mr-1"></i> Buy Now
                </button>
            </div>
        </div>
    `;

    document.getElementById('productModal').showModal();
}
function displayProducts(products) {
    if(products.length === 0) {
        productGrid.innerHTML = '<p class="text-center text-gray-500 col-span-3 py-10">No products found in this category.</p>';
        return;
    }
    
    let productsHTML = '';
    
    for(let i = 0; i < products.length; i++) {
        const p = products[i];
  
        let catName = '';
        const words = p.category.split(' ');
        for(let j = 0; j < words.length; j++) {
            catName = catName + words[j].charAt(0).toUpperCase() + words[j].slice(1) + ' ';
        }
        catName = catName.trim();
        let title = p.title;
        if(title.length > 30) {
            title = title.substring(0, 27) + '...';
        }
        let stars = '';
        let rating = p.rating.rate;
        for(let s = 1; s <= 5; s++) {
            if(s <= Math.floor(rating)) {
                stars = stars + '<i class="fa-solid fa-star text-amber-400"></i>';
            } else if(s - 0.5 <= rating) {
                stars = stars + '<i class="fa-solid fa-star-half-alt text-amber-400"></i>';
            } else {
                stars = stars + '<i class="fa-regular fa-star text-amber-400"></i>';
            }
        }
        
        productsHTML = productsHTML + `
            <div class="bg-gray-50 rounded-xl shadow-sm overflow-hidden hover:shadow-md transition duration-300">
                <div class="bg-gray-200 flex justify-center items-center h-64">
                    <img class="h-48 object-contain" src="${p.image}" alt="${p.title}">
                </div>
                <div class="p-6 space-y-4">
                    <div class="flex items-center justify-between">
                        <p class="text-blue-600 bg-blue-100 rounded-full px-3 py-1 text-xs font-medium">${catName}</p>
                        <div class="flex items-center gap-1 text-sm">
                            <div class="flex text-amber-400">
                                ${stars}
                            </div>
                            <span class="text-gray-500">${p.rating.rate} (${p.rating.count})</span>
                        </div>
                    </div>
                    <p class="font-medium text-gray-800">${title}</p>
                    <h4 class="font-bold text-lg">$${p.price}</h4>
                    <div class="flex gap-4 pt-2">
                        <button onclick="showDetails(${p.id})" class="details-btn flex-1 btn border border-gray-300 rounded-lg py-2 text-sm hover:bg-gray-100 transition">
                            <i class="fa-regular fa-eye mr-1"></i> Details
                        </button>
                        <button class="flex-1 btn bg-gradient-to-r from-indigo-500 to-indigo-600 text-white rounded-lg py-2 text-sm hover:opacity-90 transition">
                            <i class="fa-solid fa-cart-shopping mr-1"></i> Add
                        </button>
                    </div>
                </div>
            </div>
        `;
    }
    
    productGrid.innerHTML = productsHTML;
}
showHome();