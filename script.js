const miWhatsApp = "573174886630";
let todosLosProductos = [];

async function inicializarExtraShoes() {
    const contenedorSlider = document.getElementById('catalogo');
    const contenedorGrid = document.getElementById('grid-productos');
    
    try {
        const respuesta = await fetch('productos.json');
        if (!respuesta.ok) throw new Error('Error al cargar JSON');
        todosLosProductos = await respuesta.json();

        // 1. SI ESTAMOS EN INDEX (Slider)
        if (contenedorSlider) {
            contenedorSlider.innerHTML = "";
            todosLosProductos.forEach(p => {
                contenedorSlider.innerHTML += `
                    <div class="swiper-slide">
                        ${generarHTMLProducto(p)}
                    </div>`;
            });

            new Swiper(".swiper-productos", {
                slidesPerView: 1,
                spaceBetween: 20,
                loop: true, 
                navigation: {
                    nextEl: ".swiper-button-next.swiper-nav-principal",
                    prevEl: ".swiper-button-prev.swiper-nav-principal",
                },
                breakpoints: {
                    768: { slidesPerView: 2 },
                    1024: { slidesPerView: 3 }
                }
            });
        }

        // 2. SI ESTAMOS EN PRODUCTOS.HTML (Grid + Filtros)
        if (contenedorGrid) {
            renderizarGrid(todosLosProductos);
            generarBotonesFiltros();
            
            document.getElementById('buscador').addEventListener('input', (e) => {
                const busqueda = e.target.value.toLowerCase();
                const filtrados = todosLosProductos.filter(p => 
                    p.nombre.toLowerCase().includes(busqueda)
                );
                renderizarGrid(filtrados);
            });
        }

        // 3. SIEMPRE INICIALIZAR RESEÑAS (Si existe el contenedor)
        if (document.querySelector(".swiper-resenas")) {
            new Swiper(".swiper-resenas", {
                slidesPerView: 1,
                spaceBetween: 30,
                loop: true,
                navigation: {
                    nextEl: ".swiper-button-next.swiper-nav-secundario",
                    prevEl: ".swiper-button-prev.swiper-nav-secundario",
                },
                breakpoints: {
                    768: { slidesPerView: 2 }
                }
            });
        }

    } catch (error) {
        console.error("Error:", error);
    }
}

function generarHTMLProducto(p) {
    const msj = encodeURIComponent(`¡Hola ExtraShoes! Me interesan los ${p.nombre}. ¿Tallas disponibles?`);
    return `
        <div class="card-producto">
            <div class="img-contenedor">
                <img src="${p.imagen}" alt="${p.nombre}">
            </div>
            <h3>${p.nombre}</h3>
            <p class="precio">$${p.precio}</p>
            <a href="https://wa.me/${miWhatsApp}?text=${msj}" target="_blank" class="btn-wa">
                <i class="fab fa-whatsapp"></i> Preguntar talla
            </a>
        </div>`;
}

function renderizarGrid(lista) {
    const contenedor = document.getElementById('grid-productos');
    if (!contenedor) return;
    contenedor.innerHTML = lista.map(p => generarHTMLProducto(p)).join('');
}

function generarBotonesFiltros() {
    const container = document.getElementById('categorias-container');
    if (!container) return;
    const categorias = ["Todos", ...new Set(todosLosProductos.map(p => p.categoria))];
    
    container.innerHTML = categorias.map(cat => `
        <button class="btn-filtro ${cat === 'Todos' ? 'active' : ''}" onclick="filtrarCategoria('${cat}', this)">
            ${cat}
        </button>
    `).join('');
}

window.filtrarCategoria = (cat, btn) => {
    document.querySelectorAll('.btn-filtro').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const filtrados = cat === "Todos" ? todosLosProductos : todosLosProductos.filter(p => p.categoria === cat);
    renderizarGrid(filtrados);
};

document.addEventListener('DOMContentLoaded', inicializarExtraShoes);