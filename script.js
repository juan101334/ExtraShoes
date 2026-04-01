const miWhatsApp = "3000000000";

async function inicializarExtraShoes() {
    const contenedor = document.getElementById('catalogo');
    
    try {
        const respuesta = await fetch('productos.json');
        
        if (!respuesta.ok) throw new Error('Error al cargar JSON');

        const productos = await respuesta.json();

        contenedor.innerHTML = "";

        productos.forEach(p => {
            const msj = encodeURIComponent(`¡Hola ExtraShoes! Me interesan los ${p.nombre}. ¿Tallas disponibles?`);
            
            contenedor.innerHTML += `
                <div class="swiper-slide">
                    <div class="card-producto">
                        <div class="img-contenedor">
                            <img src="${p.imagen}" alt="${p.nombre}">
                        </div>
                        <h3>${p.nombre}</h3>
                        <p class="precio">$${p.precio}</p>
                        <a href="https://wa.me/${miWhatsApp}?text=${msj}" target="_blank" class="btn-wa">
                            <i class="fab fa-whatsapp"></i> Preguntar talla
                        </a>
                    </div>
                </div>
            `;
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

        new Swiper(".swiper-resenas", {
            slidesPerView: 1,
            spaceBetween: 30,
            loop: true, /* Infinito */
            navigation: {
                nextEl: ".swiper-button-next.swiper-nav-secundario",
                prevEl: ".swiper-button-prev.swiper-nav-secundario",
            },
            breakpoints: {
                768: { slidesPerView: 2 }
            }
        });

    } catch (error) {
        console.error(error);
        contenedor.innerHTML = `
            <div style="grid-column: 1/-1; text-align: center; padding: 40px;">
                <p>⚠️ Recuerda usar <b>Live Server</b> para ver los productos.</p>
            </div>`;
    }
}

document.addEventListener('DOMContentLoaded', inicializarExtraShoes);