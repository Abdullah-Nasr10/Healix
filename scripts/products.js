//====================product api-start=====================

fetch("./JSON/data.json")
  .then((response) => {
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    return response.json();
  })
  .then((products) => {
    let allProducts = [...products];
    const container = document.getElementById("prods");

    function createCard(product) {
      const card = document.createElement("div");
      const imgcontainer = document.createElement("div");
      const info = document.createElement("div");

      const image = document.createElement("img");
      image.setAttribute("src", product.image);
      imgcontainer.appendChild(image);

      const iconcontainer = document.createElement("div");
      iconcontainer.classList.add("carticon-container", "add-to-cart");
      // Add data attributes for the product details
      iconcontainer.dataset.name = product.name;
      iconcontainer.dataset.price = product.price;
      iconcontainer.dataset.image = product.image;

      imgcontainer.appendChild(iconcontainer);

      const icon = document.createElement("i");
      icon.classList.add("fa-solid", "fa-cart-arrow-down", "carticon-card");
      icon.style.color = "white";

      iconcontainer.appendChild(icon);

      const starIcon = document.createElement("i");
      starIcon.classList.add("fa-solid", "fa-star");
      starIcon.style.color = "#38ae04";

      const divdetails = document.createElement("div");
      divdetails.classList.add(
        "popupPage",
        "productpage",
        "center",
        "product-popup"
      );
      document.body.appendChild(divdetails);

      const btnn = document.createElement("button");
      btnn.innerText = "View Details";
      btnn.classList.add("btn", "btndetails");

      btnn.addEventListener("click", function (e) {
        divdetails.innerHTML = `
      <div class="popaupPageContainer  customProductPopup">

    <div class="detailsimg-Container">
      <img
        id="popupProductImage"
        src="${product.image}"
        alt=""
      />
    </div>

    <div class="details-info">
      <p class="cat">${product.category}</p>
      <h2 class="titlee">${product.name}</h2>

      <div class="details-rating">
        <h2>${product.rating}</h2>
        <i class="fas fa-star" style="color: #FFD43B;"></i>
        <i class="fas fa-star" style="color: #FFD43B;"></i>
        <i class="fas fa-star" style="color: #FFD43B;"></i>
        <i class="fas fa-star" style="color: #FFD43B;"></i>
        <i class="fa-solid fa-star-half-stroke" style="color: #FFD43B;"></i>
      </div>

      <p class="details-description">${product.description}</p>
      <h2 class="details-price">${product.price + product.currency}</h2>

      <div class="details-availability">
        <p>${product.availability}</p>
      </div>
    </div>


  
</div>
<i class="fa-solid fa-xmark close" id="closeProductPage"></i>


   
  `;

        showPopup(e, divdetails);
      });
      divdetails.addEventListener("click", function (e) {
        if (e.target.classList.contains("close")) {
          closePopup(divdetails);
        }
      });

      const title = document.createElement("h2");
      title.innerText = product.name;
      title.classList.add("cardtitle");

      const rating = document.createElement("h2");
      rating.innerText = product.rating;
      rating.classList.add("cardrating");

      const price = document.createElement("h2");
      price.innerText = product.price + product.currency;
      info.classList.add("cardinfo");
      price.classList.add("cardprice");

      info.appendChild(title);
      info.appendChild(rating);
      info.appendChild(starIcon);
      info.appendChild(price);
      info.appendChild(btnn);

      card.appendChild(imgcontainer);
      card.appendChild(info);
      container.appendChild(card);

      card.classList.add("cardcontainer");
      imgcontainer.classList.add("imagecontainer-card");

      card.addEventListener("mouseenter", function () {
        iconcontainer.style.display = "block";
      });

      card.addEventListener("mouseleave", function () {
        iconcontainer.style.display = "none";
      });
    }

    // allProducts.forEach((product) => createCard(product));

    /*------------------SEARCH-------------*/
    const input = document.getElementById("search");
    const notFound = document.getElementById("notFound");

    input.addEventListener("input", () => {
      const value = input.value.toLowerCase();
      let anyVisible = false;

      document.querySelectorAll(".cardcontainer").forEach((card) => {
        const title = card
          .querySelector(".cardtitle")
          .textContent.toLowerCase();
        const isMatch = title.includes(value);
        card.style.display = isMatch ? "inline-block" : "none";

        if (isMatch) {
          anyVisible = true;
        }
      });

      // Show or hide the 'not found' message
      notFound.style.display = anyVisible ? "none" : "flex";
    });

    /*-------------------------filter&sort start--------------------------*/
    let selectedCategory = "all";
    let selectedPrice = "default";

    /*---------filter categories function----------*/

    function filterCategory() {
      return allProducts.filter((product) => {
        return (
          selectedCategory === "all" || product.category === selectedCategory

        );


      });
    }
    /*---------sort by price function----------*/

    function sortPrice(productsArray) {
      // const defaultSort = productsArray;
      if (selectedPrice === "low-to-high") {
        return productsArray.sort((a, b) => a.price - b.price);
      } else if (selectedPrice === "high-to-low") {
        return productsArray.sort((a, b) => b.price - a.price);
      }
      return productsArray;
    }

    const displayProducts = (productsArray) => {
      container.innerHTML = "";
      productsArray.forEach(createCard);

      /*------------------------viewmore------------------*/
      const cards = document.querySelectorAll(".cardcontainer");
      cards.forEach((card, index) => {
        if (index >= 8) card.style.display = "none";
      });


      const viewMoreBtn = document.getElementById('view_more')


      let expanded = false;
      viewMoreBtn.addEventListener("click", () => {
        const cards = document.querySelectorAll(".cardcontainer");
        if (!expanded) {
          cards.forEach(card => card.style.display = "inline-block");
          viewMoreBtn.textContent = "view less";
          expanded = true;
        } else {
          cards.forEach((card, index) => {
            card.style.display = index < 8 ? "inline-block" : "none";
          });
          viewMoreBtn.textContent = "view more";
          expanded = false;
        }
      });
    };

    const updateDisplay = () => {
      const filtered = filterCategory();
      const sorted = sortPrice(filtered);
      displayProducts(sorted);
    };




    /*-----------------events------------*/
    const categoryButtons = document.querySelectorAll("[data-category]");
    selectedPrice = "default";

    categoryButtons.forEach((button) => {
      button.addEventListener("click", () => {
        selectedCategory = button.dataset.category;
        selectedPrice = "default";
        document.querySelector("#priceSort").value = "default";
        categoryButtons.forEach(btn => btn.classList.remove('activbtn'));

        button.classList.add('activbtn');
        updateDisplay();
      });
    });

    const priceSelect = document.querySelector("#priceSort");
    priceSelect.addEventListener("change", () => {
      selectedPrice = priceSelect.value;
      updateDisplay();
    });

    updateDisplay();
  });