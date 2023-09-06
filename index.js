// all DOM selection

let list = document.querySelector("ul");
let productSection = document.querySelector(".product__section");
let selectEl = document.querySelector(".select__product");
let totalPages = 10;
let allProduct;
window.addEventListener("load", () => {
  element(totalPages, 1);
  fetch("https://dummyjson.com/products/categories")
    .then((res) => res.json())
    .then((categories) => {
      addCategory(categories);
    });
});

function fetchData(skip) {
  fetch(`https://dummyjson.com/products?limit=20&skip=${skip}`)
    .then((res) => res.json())
    .then((data) => {
      renderProducts(data.products);
      allProduct = data.products;
    });
}

function addCategory(category) {
  let option = "";
  category.forEach((item) => {
    option = `<option value="${item}">${item}</option>`;
    selectEl.insertAdjacentHTML("beforeend", option);
  });
}

function element(totalPages, page) {
  let paginationList = "";
  let beforePages = page - 1;
  let afterPages = page + 1;
  let activeLi;
  selectEl.firstChild.nextSibling.selected = true;
  if (page > 1) {
    paginationList += `<li class="btn prev__btn" onclick="element(totalPages, ${
      page - 1
    })"><span>Prev</span></li>`;
  }
  if (page > 2) {
    paginationList += `<li class="num__btn" onclick="element(totalPages, 1)"><span>1</span></li>`;
    if (page > 3) {
      paginationList += `<li class="dot__btn"><span>...</span></li>`;
    }
  }

  if (beforePages == 0) {
    fetchData(0);
  } else {
    fetchData(((afterPages + beforePages) / 2 - 1) * 10);
  }

  for (let pageLength = beforePages; pageLength <= afterPages; pageLength++) {
    if (pageLength > totalPages) {
      continue;
    }
    if (pageLength == 0) {
      pageLength += 1;
    }

    if (page == pageLength) {
      activeLi = "active";
    } else {
      activeLi = "";
    }
    paginationList += `<li class="num__btn ${activeLi}" onclick="element(totalPages, ${pageLength})"><span>${pageLength}</span></li>`;
  }

  if (page < totalPages - 1) {
    if (page < totalPages - 2) {
      paginationList += `<li class="dot__btn"><span>...</span></li>`;
    }
    paginationList += `<li class="num__btn" onclick="element(totalPages, ${totalPages})"><span>${totalPages}</span></li>`;
  }

  if (page < totalPages) {
    paginationList += `<li class="btn next__btn" onclick="element(totalPages, ${
      page + 1
    })"><span>Next</span></li>`;
  }
  list.innerHTML = paginationList;
}

function renderProducts(lists) {
  productSection.innerHTML = "";
  let card;
  if (lists.length > 0) {
    lists.forEach((list) => {
      card = `
<div class="product__card">
    <h2>${list.title}</h2>
    <h3>${list.id}</h3>
    <img src="${list.thumbnail}" style="max-width:100%"/>
</div>
`;
      productSection.classList.remove("empty__box");
      productSection.insertAdjacentHTML("beforeend", card);
    });
  } else {
    card = "<h2>Product not found in this page</h2>";
    productSection.classList.add("empty__box");
    productSection.insertAdjacentHTML("beforeend", card);
  }
}

function filterCategory(el) {
  let filterByCategory = allProduct.filter(
    (product) => product.category == el.value
  );
  renderProducts(filterByCategory);
}
